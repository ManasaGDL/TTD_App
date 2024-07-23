import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { IoPersonAddSharp } from "react-icons/io5";
import { format, parseISO, isValid, differenceInHours } from "date-fns";
import PropTypes from 'prop-types';
import apis from "../../api/apis";
import { constants } from "../../constant";
import { MdDeleteOutline } from "react-icons/md";
import { Toaster, toast } from 'sonner';
import MyModal from "./MyModal";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa6";
import { MdEditOff } from "react-icons/md";

const schema = yup.object({
  pilgrims: yup.array().of(
    yup.object({
      pilgrim_name: yup.string().required("Name is required"),
      age: yup.number().typeError("Age must be a number").positive().integer().required("Age is required"),
      phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
      aadhaar_number: yup.string().matches(/^[0-9]{12}$/, 'Aadhaar must be exactly 12 digits').required("Adhaar is required"),
      seva: yup.string(),
      booked_datetime: yup.string()
    })
  ),
});

const AddEditFormTest = ({ bookingsObject, getPilgrimDetails, date, bookingsLeft, setIsModalOpen, setToastMessage, isModalOpen, bookedPilgrimDetails }) => {
  const [initialBookings, setInitialBookings] = useState(localStorage.getItem('is_mla')==='true' ? constants.Mla : constants.Mp);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const mid_bookings = localStorage.getItem('is_mla') ? 3 : 5;
  const [ disableAddPilgrim , setDisableAddPilgrim] = useState(false)
  const [numberOfPersons, setNumberOfPersons] = useState(1); // New state for number of persons
  
  const { register, control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pilgrims: bookedPilgrimDetails.map(pilgrim => ({
        ...pilgrim,
        editable: true,
        clicked: false,
        booked_datetime: pilgrim.booked_datetime // All initially booked pilgrims are editable
      }))
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "pilgrims",
  });

  useEffect(() => {
    reset({
      pilgrims: bookedPilgrimDetails.map(pilgrim => ({
        ...pilgrim,
        editable: true,
        clicked: false,
        booked_datetime: pilgrim.booked_datetime // Ensure editable flag is set to true for booked pilgrims on reset
      }))
    });
  }, [date, bookedPilgrimDetails, reset]);

  useEffect(() => {
    if (!isModalOpen) reset();
  }, [isModalOpen, reset]);

  const shouldDisableEditDeleteIn38hrs = (bookingDate) => {
    const currentDate = new Date();
    const parsedBookingDate = parseISO(bookingDate);
    return differenceInHours(parsedBookingDate, currentDate) < 38;
  };

  const onSubmit = async (data) => {
    try {
      const editPilgrims = [];
      const newPilgrims = [];
      data.pilgrims.forEach(pilgrim => {
        if (pilgrim.clicked && pilgrim.editable == false) {
          editPilgrims.push(pilgrim);
        }
        if (!Object.prototype.hasOwnProperty.call(pilgrim, 'editable')) {
          newPilgrims.push(pilgrim);
        }
      });

      if (newPilgrims.length > 0) {
        const response = await apis.addPilgrims(newPilgrims);
        if (response.status === 201) {
          setIsModalOpen(false);
          
          setToastMessage({ type: 'success', message: "Booked Successfully" });
          reset();
        }
      }
      if (editPilgrims.length > 0) {
        const response = await apis.updatePilgrims(editPilgrims);
        if (response.status === 200) {
          setIsModalOpen(false);
          setToastMessage({ type: 'success', message: "Booked/Edited Successfully" });
          reset();
        }
      }
      setDisableAddPilgrim(false)
      setNumberOfPersons(1)
    } catch (e) {
      if (e.response && e.response.status === 400) {
        setToastMessage({ type: 'error', message: "Something went wrong!" });
      } else {
        setToastMessage({ type: 'error', message: 'Something went wrong!' });
        reset();
      }
    }
  };

  const addPilgrims = () => {
    setDisableAddPilgrim(true)
    const availableSlots = Math.min(numberOfPersons,bookingsLeft
      //  bookingsLeft - fields.length
      );

    if (availableSlots > 0) {
      for (let i = 0; i < availableSlots; i++) {
        append({
          pilgrim_name: "",
          age: "",
          aadhaar_number: "",
          seva: "",
          phone_number: "",
          booked_datetime: date
        });
      }
    }
  };

  const toggleEdit = (index) => {
    const updatedPilgrims = [...fields];
    updatedPilgrims[index].editable = !updatedPilgrims[index].editable;
    updatedPilgrims[index].clicked = true;
    update(index, updatedPilgrims[index]);
  };

  const parseDate = (date) => {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return format(parsedDate, 'd-MMMM-yyyy');
    }
    return 'Invalid Date';
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    if (Object.prototype.hasOwnProperty.call(fields[index], "editable")) {
      setOpenModal(true);
    } else {
      remove(index);
    }
  };

  const handlePilgrimDelete = async () => {
    try {
      const res = await apis.deletePilgrim(fields[deleteIndex].pilgrim_id);
      if (res.status == 204) {
        setToastMessage({ type: 'success', message: "Successfully deleted" });
        setOpenModal(false);
        getPilgrimDetails(date);
      }
    } catch (e) {
      toast.error("Something went wrong!");
      console.log(e);
    }
  };

  const getTicketClass = (bookingsLeft) => {
    if (bookingsLeft === initialBookings) return 'text-lime-500';
    if (bookingsLeft > mid_bookings) return 'text-yellow-500';
    if (bookingsLeft > 0) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="overflow-y-auto h-full max-h-screen">
      <MyModal isOpen={openModal} handlePilgrimDelete={handlePilgrimDelete} setIsModalOpen={setOpenModal} title="Delete?" message="Are you sure to Delete the Booked Pilgrim"/>
      <div className="flex justify-between">
        {date && <span className="font-mono text-sm">Date: {parseDate(date)}</span>}
        {date && <span className={`font-mono text-base mr-5 text-black font-bold ${getTicketClass(bookingsLeft)}`}> Available: {bookingsLeft}</span>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 w-full max-w-8xl">
        {fields.map((field, index) => (
          <div key={field.id} className="grid sm:grid-cols-12 gap-2 mb-4">
            <div className="col-span-12 md:col-span-2 relative">
              <input
                placeholder={`Name ${index + 1}`}
                type="text"
                {...register(`pilgrims.${index}.pilgrim_name`)}
                className={`border pl-6 border-gray-300 rounded p-2 w-full ${field.editable ? "bg-slate-200" : ''}`}
                disabled={field.editable}
              />
              <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none">
                <IoMdPerson className="text-gray-400" />
              </div>
              {errors?.pilgrims?.[index]?.pilgrim_name && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].pilgrim_name.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 col-span-6 relative">
              <input
                placeholder={`Phone ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.phone_number`)}
                className={`border pl-6 border-gray-300 rounded p-2 w-full ${field.editable ? "bg-slate-200" : ''}`}
                disabled={field.editable}
              />
              <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none">
                <FaPhoneAlt className="text-gray-400" />
              </div>
              {errors?.pilgrims?.[index]?.phone_number && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].phone_number.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 col-span-6 relative">
              <input
                placeholder={`Aadhaar ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.aadhaar_number`)}
                className={`border pl-6 border-gray-300 rounded p-2 w-full ${field.editable ? "bg-slate-200" : ''}`}
                disabled={field.editable}
              />
              <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none">
                <FaAddressCard className="text-gray-400" />
              </div>
              {errors?.pilgrims?.[index]?.aadhaar_number && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].aadhaar_number.message}
                </p>
              )}
            </div>
            <div className="col-span-6 md:col-span-2 relative">
              <input
                placeholder={`Age ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.age`)}
                className={`border pl-6 border-gray-300 rounded p-2 w-full ${field.editable ? "bg-slate-200" : ''}`}
                disabled={field.editable}
              />
              <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none">
                <IoMdPerson className="text-gray-400" />
              </div>
              {errors?.pilgrims?.[index]?.age && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].age.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 col-span-6">
      <select
        {...register(`pilgrims.${index}.seva`)}
        className={`border border-gray-300 rounded p-2 w-full ${field.editable ? "bg-slate-200" : ''}`}
        disabled={field.editable} // Disable input based on editable flag
        defaultValue={"VIP Break"}
      >
        <option value="">Select Seva</option>
        <option value="VIP Break">VIP Break</option>
      </select>
      {errors?.pilgrims?.[index]?.seva && (
        <p className="text-red-600 text-sm">
          {errors.pilgrims[index].seva.message}
        </p>
      )}
    </div>
            <div className="col-span-2 md:col-span-1 flex items-center ">
              {/* <input
                type="text"
                {...register(`pilgrims.${index}.booked_datetime`)}
                className="hidden"
                defaultValue={date}
              /> */}
              {field.editable ? (
                <button
                  type="button"
                  className="text-black rounded-none"
                  onClick={() => toggleEdit(index)}
                  disabled={shouldDisableEditDeleteIn38hrs(field.booked_datetime)}
                >
                  <MdEditOff className="mx-auto" />
                </button>
              ) : (
                <button
                  type="button"
                  className="text-lime-500 rounded hover:bg-lime-700"
                  onClick={() => toggleEdit(index)}
                >
                  <Pencil className="mx-auto" />
                </button>
              )}
               <button
        type="button"
        className="text-red-500 rounded hover:bg-red-700 ml-2"
        onClick={() => handleDelete(index)} // Handle delete action
      >
        <MdDeleteOutline size={24} />
      </button>
            </div>
           
          </div>
        ))}
        <div className="grid grid-cols-12 gap-2 mb-4">
          {!disableAddPilgrim && <div className="col-span-12 md:col-span-6">
            <input
              type="number"
              value={numberOfPersons}
              onChange={(e) => setNumberOfPersons(Number(e.target.value))}
              min="0"
              max={bookingsLeft - fields.length}
              placeholder="Number of Persons"
              className="border border-gray-300 rounded p-2 w-full"
            />
             {numberOfPersons>bookingsLeft && <span className="text-red-500">Error : Exceeding Available tickets.Please enter again!</span>}
          </div>}
         {!disableAddPilgrim && <div className="col-span-12 md:col-span-6">
            <button
              type="button"
              onClick={addPilgrims}
              disabled={numberOfPersons>bookingsLeft}
              className={` text-white rounded p-2 w-full flex items-center justify-center ${numberOfPersons>bookingsLeft?"bg-green-100":"bg-green-500"}`}
            >
              <IoPersonAddSharp className="mr-2" />
              Add {numberOfPersons} Pilgrim{numberOfPersons > 1 ? "s" : ""}
            </button>
           
          </div>}
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-green-500 text-white p-2 rounded">Save</button>
        </div>
      </form>
      {/* <Toaster /> */}
    </div>
  );
};

AddEditFormTest.propTypes = {
  bookingsObject: PropTypes.object.isRequired,
  getPilgrimDetails: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  bookingsLeft: PropTypes.number.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setToastMessage: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  bookedPilgrimDetails: PropTypes.array.isRequired
};

export default AddEditFormTest;
