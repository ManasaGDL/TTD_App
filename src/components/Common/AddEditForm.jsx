import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { Pencil } from "lucide-react";
import { IoPersonAddSharp } from "react-icons/io5";
import { format ,parseISO,isValid} from "date-fns";

import apis from "../../api/apis";
const schema = yup.object({
  pilgrims: yup.array().of(
    yup.object({
      pilgrim_name: yup.string().required("Name is required"),
      age: yup
        .number()
        .typeError("Age must be a number")
        .positive()
        .integer()
        .required("Age is required"),
        phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
        aadhaar_number: yup
        .number()
        .typeError("Adhaar number must be a number")
        .required("Adhaar is required"),
      seva: yup.string(),
      booked_datetime:yup.string()
     
    })
  ),
});

const AddEditForm = ({ bookingsObject, date, bookingsLeft,setIsModalOpen ,setToastMessage,isModalOpen}) => {
 
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pilgrims: [
        {
          pilgrim_name: "",
          age: "",
          aadhaar_number: "",
          seva: "",
          phone_number: "",
          booked_datetime:date
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "pilgrims",
  });

  useEffect(() => {
    reset({
      pilgrims: [
        {
          pilgrim_name: "",
          age: "",
          aadhaar_number: "",
          seva: "",
          phone_number: "",
          booked_datetime:date
        },
      
      ],
    });
  }, [date, reset]);
  useEffect(()=>{
if(!isModalOpen)
  reset()
  },[isModalOpen])

  const onSubmit =async (data) => {
console.log(data)
  try{
  const response = await apis.addPilgrims(Object.values(data).flat())
  if(response.status===201)
    {setIsModalOpen(false)
      setToastMessage({type:'success','message':"Booked Successfully"})
      reset()
    }

  }catch(e)
  {
if(e.response.status === 400)
  {
    setToastMessage({type:'error','message':"Something went wrong!"})
    console.log(e.response.data)
  }
  else{
    setToastMessage({type:'error','message':'Something went wrong!'})
    reset()
  }
  }finally
  {
    // setToastMessage({type:'',message:''})
  }
    // reset();
  };

  const addPilgrim = () => {
   
    if (fields.length < bookingsLeft) {
      append({
        pilgrim_name: "",
        age: "",
        aadhaar_number: "",
        seva: "",
        phone_number: "",
        booked_datetime:date
      });
    }
  };
  const parseDate = (date) => {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return format(parsedDate, 'd-MMMM-yyyy');
    }
    return 'Invalid Date';
  };
  return (
    <div>

        <div className="flex justify-between m-2">
        {date && <span className="font-mono text-sm">Booking Date: {parseDate(date)}</span>}
       {fields.length < bookingsLeft &&  <button
          type="button"
          onClick={addPilgrim}
          className="flex items-center text-black p-2 rounded font-mono border border-gray-200 hover:bg-gray-200"
        >
          <IoPersonAddSharp className="text-xl mr-1 text-lime-500" />
          Add {fields.length + 1} Pilgrim - {bookingsLeft} available
        </button>}
        </div>
   
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 w-full max-w-8xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-mono">Pilgrim Details</h2>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid sm:grid-cols-12 gap-2 mb-4">
            <div className="col-span-3">
              <input
                placeholder={`Name ${index + 1}`}
                type="text"
                {...register(`pilgrims.${index}.pilgrim_name`)}
                className="border border-gray-300 rounded p-2 w-full"
              />
              {errors?.pilgrims?.[index]?.pilgrim_name && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].pilgrim_name.message}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <input
                placeholder={`Age ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.age`)}
                className="border border-gray-300 rounded p-2 w-full"
              />
              {errors?.pilgrims?.[index]?.age && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].age.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <input
                placeholder={`Phone ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.phone_number`)}
                className="border border-gray-300 rounded p-2 w-full"
              />
              {errors?.pilgrims?.[index]?.phone_number && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].phone_number.message}
                </p>
              )}
            </div>
            <div className="col-span-3">
              <input
                placeholder={`Adhaar ${index + 1}`}
                type="number"
                {...register(`pilgrims.${index}.aadhaar_number`)}
                className="border border-gray-300 rounded p-2 w-full"
              />
              {errors?.pilgrims?.[index]?.aadhaar_number && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].aadhaar_number.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <select
                {...register(`pilgrims.${index}.seva`)}
                className="border border-gray-300 rounded p-2 w-full"
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
            <div className="col-span-1 flex items-center">
              <button
                type="button"
                className="bg-lime-500 text-white p-2 rounded hover:bg-lime-700"
                onClick={() => console.log("Edit pilgrim", index)}
              >
                <Pencil />
              </button>
            </div>
            <hr className="lg:mx-24" />
          </div>
        ))}

        <div className="flex justify-center">
          <button type="submit" className="bg-lime-500 text-white py-2 px-4 rounded hover:bg-lime-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditForm;
