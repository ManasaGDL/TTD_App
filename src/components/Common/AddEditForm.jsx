import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { IoPersonAddSharp } from "react-icons/io5";
import { format, parseISO, isValid ,differenceInHours} from "date-fns";
import PropTypes from 'prop-types';
import apis from "../../api/apis";
import { constants } from "../../constant";
import {  MdDeleteOutline } from "react-icons/md";
import { Toaster, toast } from 'sonner'
import MyModal from "./MyModal";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa6";
import { MdOutlineEditOff } from "react-icons/md";
import { IoPrint } from "react-icons/io5";
import PDFViewer from "../PDFViewer";

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

const AddEditForm = ({ bookingsObject,getPilgrimDetails, date, bookingsLeft, setIsModalOpen, setToastMessage, isModalOpen, bookedPilgrimDetails }) => {
  const [initialBookings, setInitialBookings] = useState(localStorage.getItem('is_mla')==='true' ? constants.Mla : constants.Mp);
  const [ deleteIndex, setDeleteIndex] = useState(null)
  const [ openModal , setOpenModal] = useState(false)
  const mid_bookings = localStorage.getItem('is_mla') ? 3 : 5;
  const [ selectedPilgrims, setSelectedPilgrims] = useState([])
  const [ masterPilgrim ,setMasterPilgrim] = useState(null)
  const [ showMaster , setShowMaster] = useState(false)
  const [payloadForDownload , setPayloadForDownload] = useState({})
  const [ startPreviewDownload , setStartPreviewDownload] = useState(false)
  const { register, control, handleSubmit, formState: { errors }, reset ,setValue} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pilgrims: bookedPilgrimDetails.map(pilgrim => ({
        ...pilgrim,
        editable: true,
        clicked:false ,
        booked_datetime:pilgrim.booked_datetime// All initially booked pilgrims are editable
      }))
    },
  });

  const { fields, append ,remove,update} = useFieldArray({
    control,
    name: "pilgrims",
  });

  useEffect(() => {
    
    reset({
      pilgrims: bookedPilgrimDetails.map(pilgrim => ({
        ...pilgrim,
        editable: true,
        clicked:false ,
        booked_datetime:pilgrim.booked_datetime// Ensure editable flag is set to true for booked pilgrims on reset
      }))
    });
  }, [date, bookedPilgrimDetails, reset]);

  useEffect(() => {
    if (!isModalOpen) reset();
  }, [isModalOpen, reset]);
const shouldDisableEditDeleteIn38hrs=(bookingDate)=>{
  const currentDate = new Date();
  const parsedBookingDate = parseISO(bookingDate);
  return differenceInHours(parsedBookingDate,currentDate)<38


}
useEffect(()=>{
if(!isModalOpen)
{
  setSelectedPilgrims([])
  setMasterPilgrim(null)
}
},[isModalOpen])
  const onSubmit = async (data) => {
   
    try {
      // Filter out pilgrims that are already booked and should not be added again
      // const newPilgrims = data.pilgrims.filter(pilgrim => !bookedPilgrimDetails.some(bookedPilgrim => bookedPilgrim.aadhaar_number === pilgrim.aadhaar_number));
  const editPilgrims =[]
  const newPilgrims =[]
  data.pilgrims.forEach(pilgrim=>{
    
    if( pilgrim.clicked && pilgrim.editable==false)
      {
        editPilgrims.push(pilgrim)
      }
 if(!Object.prototype.hasOwnProperty.call(pilgrim, 'editable'))
     newPilgrims.push(pilgrim)
  })

  // Object.values(data).flat()
  if(newPilgrims.length>0)
     { const response = await apis.addPilgrims(newPilgrims);
      if (response.status === 201) {
        setIsModalOpen(false);
        setToastMessage({ type: 'success', message: "Booked Successfully" });
        reset();
      }
    }
    if(editPilgrims.length>0)
      {
        const response = await apis.updatePilgrims(editPilgrims);
        if (response.status === 200) {
          setIsModalOpen(false);
          setToastMessage({ type: 'success', message: "Booked/Edited Successfully" });
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
   
    updatedPilgrims[index].editable = !updatedPilgrims[index].editable;
    updatedPilgrims[index].clicked = true
    update(index, updatedPilgrims[index]);
    // reset({
    //   pilgrims: updatedPilgrims
    // });
  };

  const parseDate = (date) => {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return format(parsedDate, 'd-MMMM-yyyy');
    }
    return 'Invalid Date';
  };
  const handleDelete=(index)=>{
    setDeleteIndex(index)
      if(Object.prototype.hasOwnProperty.call(fields[index], "editable"))
      {
      
      setOpenModal(true)
    
      }
      else remove(index)
    
    }
    useEffect(()=>{
if(selectedPilgrims.length>0 && masterPilgrim !== null && masterPilgrim !== undefined && masterPilgrim >= 0)
 { 
const master_id= bookedPilgrimDetails[masterPilgrim].pilgrim_id;
const exists = selectedPilgrims.some(pilgrim=>pilgrim.pilgrim_id===master_id)

if(exists)
  {setStartPreviewDownload(true)
  
  const ids=selectedPilgrims.map(pilgrim => pilgrim.pilgrim_id)

   setPayloadForDownload({"pilgrim_id":ids,is_master:true,"accommodation_date":format(parseISO(bookedPilgrimDetails[masterPilgrim]?.booked_datetime),"yyyy-MM-dd"),"darshan_date":format(parseISO(bookedPilgrimDetails[masterPilgrim]?.booked_datetime),'yyyy-MM-dd'),"email":bookedPilgrimDetails[masterPilgrim]?.email,"contact":bookedPilgrimDetails[masterPilgrim]?.phone_number})
  }
  else{
    toast.error("Master Pilgrim not checked for print. Please check!")
    setStartPreviewDownload(false)
  }
  }
    },[masterPilgrim ,selectedPilgrims])
    const handleCheckboxChange = (index, checked) => {
      const updatedPilgrims = [...fields];
      updatedPilgrims[index].selected = checked;
      update(index, updatedPilgrims[index]);
  
      if (checked) {
        
        setSelectedPilgrims([...selectedPilgrims, updatedPilgrims[index]]);
 
      } else {
      
       
        setSelectedPilgrims(selectedPilgrims.filter(pilgrim=>!(pilgrim.pilgrim_id === updatedPilgrims[index].pilgrim_id && !updatedPilgrims[index].selected)));
      }
    };
    const handlePilgrimDelete=async()=>{

      try{
      const res = await apis.deletePilgrim(fields[deleteIndex].pilgrim_id)
      if(res.status==204)
        {  setToastMessage({ type: 'success', message: "Successfully deleted" });
          setOpenModal(false)
          getPilgrimDetails(date)
        }
      }catch(e)
      {toast.error("Something went wrong!")
      console.log(e)
      }
      
      }
      
    //  P
      const handlePreviewOrDownload = () => {
       
       if(selectedPilgrims.length<=0)
       {
        toast.error("Select the Checkboxes for print")
       }
       
        else if (masterPilgrim === null) {
          setShowMaster(true)
          toast.error('Please select a master pilgrim before previewing or downloading.');
          return;

        }
      
  //  if(selectedPilgrims.length>0 && masterPilgrim >=0)
    
  //     {  
        
      
  //       // const ids=selectedPilgrims.map(pilgrim => pilgrim.pilgrim_id)
  //       // setPayloadForDownload({"pilgrim_id":ids,"accommodation_date":format(bookedPilgrimDetails[masterPilgrim]?.booked_datetime,"yyyy-MM-dd"),"darshan_date":format(bookedPilgrimDetails[masterPilgrim]?.booked_datetime,'yyyy-MM-dd'),"email":bookedPilgrimDetails[masterPilgrim]?.email,"contact":bookedPilgrimDetails[masterPilgrim]?.phone_number})
    
  //     }
        // Proceed with your preview or download logic here
      };
      const getTicketClass = bookingsLeft => {
 
        if (bookingsLeft === initialBookings) return 'text-lime-500';
        if (bookingsLeft > mid_bookings) return 'text-yellow-500';
        if (bookingsLeft > 0) return 'text-orange-500';
        return 'text-red-500';
      };
  return (
    <div className="overflow-y-auto h-full max-h-screen">
      <MyModal isOpen={openModal} handlePilgrimDelete = { handlePilgrimDelete} setIsModalOpen={setOpenModal} title="Delete?" message="Are you sure to Delete the Booked Pilgrim"/>
       <div className="flex justify-between ">
       <span>{date && <span className="font-mono text-sm">Date: {parseDate(date)} </span>}</span> 
     
       {
       bookedPilgrimDetails.length>0 
       &&
        <div >
        {/* <span>{"Edit is disabled before 38hrs of darshan"}</span> */}
        <div>
          <button className=" px-4 py-2 rounded" onClick={()=>{
            handlePreviewOrDownload()
          }}>
            <PDFViewer payloadForDownload={payloadForDownload} download={startPreviewDownload} setSelectedPilgrims={setSelectedPilgrims} setMasterPilgrim={setMasterPilgrim}/>
            {/* <IoPrint size={25}></IoPrint><span className="font-mono text-xs text-lime-700">{selectedPilgrims.length>0?"Pilgrims selected for print":""} </span> */}
          </button>
          </div>
          { <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Print 
            <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
              <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
            </svg>
          </div>}
        {date && <span className={`font-mono ml-4 text-base mr-5 text-black font-bold ${getTicketClass(bookingsLeft)} `}> Available:{bookingsLeft}</span>}
        </div>
}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 w-full max-w-8xl">
        {/* {bookedPilgrimDetails.length > 0 && <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-mono">Pilgrim Details</h2>
        </div>} */}

{fields.map((field, index) =>(
  <div key={field.id} className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}>
 
     
    
     {bookedPilgrimDetails.some(pilgrim => pilgrim.aadhaar_number === field.aadhaar_number) && (
      <div className="flex flex-col items-center col-span-1">
        <label htmlFor="master" className="text-sm font-medium text-gray-700">
          Master
        </label>
        <input
          type="radio"
          id={`pilgrims.${index}.is_master`}
          name="is_master"
          value={index}
          checked={masterPilgrim === index}
          onChange={() => setMasterPilgrim(index)}
          className="mt-1 focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
        />
      </div>
    )}
    
    <div className="col-span-12 md:col-span-3 relative ml-2">
      <input
        placeholder={`Name ${index + 1}`}
        type="text"
        title={field.pilgrim_name}
        {...register(`pilgrims.${index}.pilgrim_name`)}
        className={`border pl-6 border-gray-300 rounded p-2 w-full  ${field.editable ? "bg-slate-200" : ''}`}
        disabled={field.editable} // Disable input based on editable flag
      />
      <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none h-9">
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
      title={field.phone_number}
        {...register(`pilgrims.${index}.phone_number`)}
        className={`border pl-6 border-gray-300 rounded p-2 w-full relative ${field.editable ? "bg-slate-200" : ''}`}
        disabled={field.editable} // Disable input based on editable flag
      />
      {/* <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2"> */}
      <div className="flex absolute items-center inset-y-0 left-0 h-9 space-x-2">
        <FaPhoneAlt className="text-gray-400" />
        </div>
      {errors?.pilgrims?.[index]?.phone_number && (
        <p className="text-red-600 text-sm mt-2">
          {errors.pilgrims[index].phone_number.message}
        </p>
      )}
  
    </div>
    <div className="md:col-span-3 col-span-6 relative">
      <input
        placeholder={`Adhaar ${index + 1}`}
        type="number"
        title={field.aadhaar_number}
        {...register(`pilgrims.${index}.aadhaar_number`)}
        className={`border border-gray-300 rounded p-2 pl-7 w-full ${field.editable ? "bg-slate-200" : ''}`}
        disabled={field.editable} // Disable input based on editable flag
      />
      <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none h-9">
        <FaAddressCard className="text-gray-400" />
      </div>
      {errors?.pilgrims?.[index]?.aadhaar_number && (
        <p className="text-red-600 text-sm">
          {errors.pilgrims[index].aadhaar_number.message}
        </p>
      )}
    </div>
    
    <div className="md:col-span-1 col-span-2 relative">
      <input
        placeholder={`Age ${index + 1}`}
        type="number"
        {...register(`pilgrims.${index}.age`)}
        className={`border border-gray-300 rounded p-2 w-full disable-spinner ${field.editable ? "bg-slate-200" : ''}`}
        disabled={field.editable} // Disable input based on editable flag
      />
      <div className="absolute pl-8 inset-y-0 left-0 flex items-center pointer-events-none h-9">

      </div>
      {errors?.pilgrims?.[index]?.age && (
        <p className="text-red-600 text-sm">
          {errors.pilgrims[index].age.message}
        </p>
      )}
    </div>
    
    <div className="md:col-span-2 col-span-4">
      <select
        {...register(`pilgrims.${index}.seva`)}
        className={`border border-gray-300 rounded p-2 w-full ${field.editable ? "bg-slate-200" : ''}`}
        disabled={field.editable} // Disable input based on editable flag
        defaultValue={"VIP Break"}
        title={field.seva}
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
    

    {<div className="col-span-2 flex items-center h-9">
      {bookedPilgrimDetails.some(pilgrim => pilgrim.aadhaar_number === field.aadhaar_number) &&<div>{ field.editable ? (
                <button
                  type="button"
                  className="text-black"
                  onClick={() => toggleEdit(index)}
                  disabled={shouldDisableEditDeleteIn38hrs(field.booked_datetime)}
                >
                  <MdOutlineEditOff className="mx-auto" />
                </button>
              ) : (
                <button
                  type="button"
                  className="text-black"
                  onClick={() => toggleEdit(index)}
                >
                  <Pencil className="mx-auto" />
                </button>
              )}
      </div>}
      { <button
        type="button"
        className="text-red-500 rounded hover:bg-red-700 ml-2"
        onClick={() => handleDelete(index)} // Handle delete action
      >
        <MdDeleteOutline size={24} />
      </button>}
<div>
             {bookedPilgrimDetails.some(pilgrim => pilgrim.aadhaar_number === field.aadhaar_number) &&<input
                type="checkbox"
                id={`pilgrims.${index}.select`}
                name={`pilgrims.${index}.select`}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const updatedPilgrims = [...fields];
                  updatedPilgrims[index].selected = checked;
                  update(index, updatedPilgrims[index]);
                  handleCheckboxChange(index,e.target.checked)
                }}
                checked={field.selected||false}
              />}
              </div>
          
    </div>}
  </div>
))}

    

<div className={`grid grid-cols-2 gap-2`}>
    <div className="flex justify-end">
    { fields.length < initialBookings &&(
          <button
            type="button"
            onClick={addPilgrim}
        
            className="flex items-center ml-3  text-black p-2 rounded font-mono border border-lime-500 hover:bg-gray-200 sm:text-lg
             text-xs"
          
          >
            <IoPersonAddSharp className="sm:text-l mr-1 text-lime-500 text-sm " />
            Add {fields.length + 1} Pilgrim
          </button>
        )}
   </div>
        <div className={`flex justify-start `}>
          {!bookingsLeft==0 &&<button type="submit" className="bg-lime-500 text-white py-2 w-20 px-2 rounded hover:bg-lime-700" >
            Submit
          </button>}
        </div>
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