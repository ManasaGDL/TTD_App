import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { IoPersonAddSharp } from "react-icons/io5";
import { format, parseISO, isValid } from "date-fns";
import PropTypes from 'prop-types';
import apis from "../../api/apis";
import { constants } from "../../constant";

const schema = yup.object({
  pilgrims: yup.array().of(
    yup.object({
      pilgrim_name: yup.string().required("Name is required"),
      age: yup.number().typeError("Age must be a number").positive().integer().required("Age is required"),
      phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
      aadhaar_number: yup.number().typeError("Adhaar number must be a number").required("Adhaar is required"),
      seva: yup.string(),
      booked_datetime: yup.string()
    })
  ),
});

const AddEditForm = ({ bookingsObject, date, bookingsLeft, setIsModalOpen, setToastMessage, isModalOpen, bookedPilgrimDetails }) => {
  const [initialBookings, setInitialBookings] = useState(localStorage.getItem('is_mla')==='true' ? constants.Mla : constants.Mp);

  const { register, control, handleSubmit, formState: { errors }, reset ,setValue} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pilgrims: bookedPilgrimDetails.map(pilgrim => ({
        ...pilgrim,
        editable: true,
        clicked:false // All initially booked pilgrims are editable
      }))
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "pilgrims",
  });

  useEffect(() => {
    reset({
      pilgrims: bookedPilgrimDetails.map(pilgrim => ({
        ...pilgrim,
        editable: true,
        clicked:false // Ensure editable flag is set to true for booked pilgrims on reset
      }))
    });
  }, [date, bookedPilgrimDetails, reset]);

  useEffect(() => {
    if (!isModalOpen) reset();
  }, [isModalOpen, reset]);

  const onSubmit = async (data) => {
    try {
      // Filter out pilgrims that are already booked and should not be added again
      // const newPilgrims = data.pilgrims.filter(pilgrim => !bookedPilgrimDetails.some(bookedPilgrim => bookedPilgrim.aadhaar_number === pilgrim.aadhaar_number));
  const editPilgrims =[]
  const newPilgrims =[]
  data.pilgrims.forEach(pilgrim=>{
    console.log(pilgrim)
    if( pilgrim.clicked && pilgrim.editable==false)
      {
        editPilgrims.push(pilgrim)
      }
 if(!Object.prototype.hasOwnProperty.call(pilgrim, 'editable'))
     newPilgrims.push(pilgrim)
  })
  console.log("NP",newPilgrims

  )
  console.log("op",editPilgrims)
  // Object.values(data).flat()
  if(newPilgrims.length>0)
     { const response = await apis.addPilgrims(newPilgrims);
      if (response.status === 201) {
        setIsModalOpen(false);
        setToastMessage({ type: 'success', message: "Booked Successfully" });
        reset();
      }
    }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        setToastMessage({ type: 'error', message: "Something went wrong!" });
      } else {
        setToastMessage({ type: 'error', message: 'Something went wrong!' });
        reset();
      }
    }
  };

  const addPilgrim = () => {
    if (fields.length < initialBookings) {
      append({
        pilgrim_name: "",
        age: "",
        aadhaar_number: "",
        seva: "",
        phone_number: "",
        booked_datetime: date
      });
    }
  };

  const toggleEdit = (index) => {
 
    const updatedPilgrims = [...fields];
    console.log("Updated",updatedPilgrims)
    updatedPilgrims[index].editable = !updatedPilgrims[index].editable;
    updatedPilgrims[index].clicked = true
    reset({
      pilgrims: updatedPilgrims
    });
  };

  const parseDate = (date) => {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return format(parsedDate, 'd-MM-yy');
    }
    return 'Invalid Date';
  };

  return (
    <div className="overflow-y-auto h-full">
      <div className="flex justify-between m-2">
        {date && <span className="font-mono text-sm">Booking Date: {parseDate(date)}</span>}
        {fields.length < initialBookings && (
          <button
            type="button"
            onClick={addPilgrim}
            className="flex items-center ml-3  text-black p-2 rounded font-mono border border-gray-200 hover:bg-gray-200"
          >
            <IoPersonAddSharp className="text-xl mr-1 text-lime-500" />
            Avl:{bookingsLeft}-Add {fields.length + 1} Pilgrim
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 w-full max-w-8xl">
        {/* {bookedPilgrimDetails.length > 0 && <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-mono">Pilgrim Details</h2>
        </div>} */}

        {fields.map((field, index) => (
          <div key={field.id} className="grid sm:grid-cols-12 gap-2 mb-4">
            <div className=" col-span-12 md:col-span-3">
              <input
                placeholder={`Name ${index + 1}`}
                type="text"
                {...register(`pilgrims.${index}.pilgrim_name`)}
                className={`border border-gray-300 rounded p-2 w-full ${field.editable?"bg-slate-200":''}`}
                disabled={field.editable} // Disable input based on editable flag
              />
              {errors?.pilgrims?.[index]?.pilgrim_name && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].pilgrim_name.message}
                </p>
              )}
            </div>
            <div className="md:col-span-1 col-span-6">
              <input
                placeholder={`Age ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.age`)}
                className={`border border-gray-300 rounded p-2 w-full ${field.editable?"bg-slate-200":''}`}
                disabled={field.editable} // Disable input based on editable flag
              />
              {errors?.pilgrims?.[index]?.age && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].age.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 col-span-6">
              <input
                placeholder={`Phone ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.phone_number`)}
                className={`border border-gray-300 rounded p-2 w-full ${field.editable?"bg-slate-200":''}`}
                disabled={field.editable} // Disable input based on editable flag
              />
              {errors?.pilgrims?.[index]?.phone_number && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].phone_number.message}
                </p>
              )}
            </div>
            <div className="md:col-span-3 col-span-6">
              <input
                placeholder={`Adhaar ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.aadhaar_number`)}
                className={`border border-gray-300 rounded p-2 w-full ${field.editable?"bg-slate-200":''}`}
                disabled={field.editable} // Disable input based on editable flag
              />
              {errors?.pilgrims?.[index]?.aadhaar_number && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].aadhaar_number.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 col-span-6">
              <select
                {...register(`pilgrims.${index}.seva`)}
                className={`border border-gray-300 rounded p-2 w-full ${field.editable?"bg-slate-200":''}`}
                disabled={field.editable} // Disable input based on editable flag
              >
                <option value="">Select Seva</option>
                <option value="seva1">Seva 1</option>
                <option value="seva2">Seva 2</option>
                <option value="seva3">Seva 3</option>
              </select>
              {errors?.pilgrims?.[index]?.seva && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].seva.message}
                </p>
              )}
            </div>
           {(Object.prototype.hasOwnProperty.call(field, "editable")) && <div className="col-span-1 flex items-center">
              <button
                type="button"
                className="bg-lime-500 text-white p-2 rounded hover:bg-lime-700"
                onClick={() => toggleEdit(index)} // Toggle edit mode on click
              >
                <Pencil />
              </button>
            </div>}
            {/* <hr className="lg:mx-24" /> */}
          </div>
        ))}

        <div className="flex justify-center">
          <button type="submit" className="bg-lime-500 text-white py-2 w-20 px-2 rounded hover:bg-lime-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

AddEditForm.propTypes = {
  bookingsObject: PropTypes.object,
  date: PropTypes.string,
  bookingsLeft: PropTypes.number,
  setIsModalOpen: PropTypes.func,
  setToastMessage: PropTypes.func,
  isModalOpen: PropTypes.bool,
  bookedPilgrimDetails: PropTypes.array
};

export default AddEditForm;
