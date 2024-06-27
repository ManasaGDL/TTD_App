import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import apis from '../api/apis';
import { Toaster, toast } from 'sonner'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import ".././index.css"
export default function BlockDateSelector() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [startMonth, setStartMonth] = useState(new Date().getMonth());
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [ blockedDates , setBlockedDates] = useState([])
  useEffect(()=>{
    getBlockedDates()
  },[])
  useEffect(() => {
    console.log(selectedDates);
    
  }, [selectedDates]);
 const getBlockedDates = async()=>{
  try{
   const res = await apis.getBlockedDates()
   const dates = res.data.map(item=>new Date(item.blockdate))
  setBlockedDates(dates)
  }catch(e)
  {
    console.log(e)
  }
 }
  const handleDateClick = (value) => {
    const dateIndex = selectedDates.findIndex((date) =>
      isSameDay(date, value)
    );

    if (dateIndex === -1) {
      setSelectedDates([...selectedDates, value]);
    } else {
      setSelectedDates(selectedDates.filter((date) =>
        !isSameDay(date, value)
      ));
    }
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const renderCalendar = (monthOffset) => {
    const date = new Date(startYear, startMonth + monthOffset, 1);
    return (
      <Calendar
        key={monthOffset}
        activeStartDate={date}
       className="font-mono rounded-lg"
      prev2Label={null}
      next2Label={null}
      prevLabel={null}
      nextLabel={null}
      
        onClickDay={handleDateClick}
        tileClassName={({ date }) =>{
          const isSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, date));
          const isBlocked = blockedDates.some((blockedDate) => isSameDay(blockedDate, date));
          if (isSelected) {
            return 'bg-blue-500 text-white rounded-full selected-full';
          } else if (isBlocked) {
            return 'bg-red-500 text-white rounded-full';
          } else {
            return ''; // No additional classes if not selected or blocked
          }
        }}
      />
    );
  };

  const handleNext = () => {
    const newStartMonth = startMonth + 4;
    if (newStartMonth > 11) {
      setStartYear(startYear + 1);
      setStartMonth(newStartMonth - 12);
    } else {
      setStartMonth(newStartMonth);
    }
  };
  const handlePrevious = () => {
    const newStartMonth = startMonth - 4;
    if (newStartMonth < 0) {
      setStartYear(startYear - 1);
      setStartMonth(12 + newStartMonth);
    } else {
      setStartMonth(newStartMonth);
    }
  };
const handleBlock=async()=>{
let transformedDates = selectedDates.map(date=>{
  return format(date,'yyyy-MM-dd')
})

try{
const res = await apis.blockDates({"dates":transformedDates})
if(res.status === 201)
  {
    toast.success(`${transformedDates.join(',')}  blocked successfully`)
    getBlockedDates()
    setSelectedDates([])
  }

}catch(e)
{
  toast.error("Something went wrong!")
  console.log(e)
}
console.log(transformedDates)
}
const handleUnBlock=async()=>{
  if(selectedDates.length!==0)
  
  {
    let transformedDates = selectedDates.map(date=>{
    return format(date,'yyyy-MM-dd')
  })
  
  try{
  const res = await apis.unBlockDates({"dates":transformedDates})
  if(res.status === 200)
    {
      toast.success(`${transformedDates.join(',')}  unblocked Successfully`)
      
      setSelectedDates([])
      getBlockedDates()
    }
  
  }
catch(e)
  {
    console.log(e)
  }
  console.log(transformedDates)
  
} else{
 toast.warning("Please select dates to unblock")
}
}
  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePrevious}
          className="text-3xl text-black px-4 py-2 rounded hover:text-4xl"
        >
          <FiArrowLeft />
        </button>

        <button
          onClick={handleNext}
          className="text-3xl text-black px-4 py-2 rounded hover:text-4xl"
        >
          <FiArrowRight />
        </button>
      </div>
        <Toaster richColors position="top-center"/>
      <div className="flex justify-center mt-4">
      {/* <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-lime-500 text-white rounded"
        >
         Previous
        </button> */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => renderCalendar(i))}
      </div>
      {/* <button
          onClick={handleNext}
          className="px-4 py-2 bg-lime-500 text-white rounded"
        >
          Next
        </button> */}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleBlock}
          className="px-4 py-2 bg-lime-500 text-black font-mono rounded"
        >
         Block 
        </button>
        <button
          onClick={handleUnBlock}
          className="px-4 py-2 ml-2 bg-lime-500 text-black font-mono rounded"
        >
         Unblock 
        </button>
        
      </div>
    </div>
  );
}
