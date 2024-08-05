import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addDays, subMonths, addMonths, isSameDay,getDay, getDaysInMonth,isBefore,startOfToday } from 'date-fns';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { FaTicketAlt } from 'react-icons/fa';
import Modal from './Modal';

import { constants } from '../../constant';
import apis from '../../api/apis';
import { useLoading } from '../../context/LoadingContext';
import { Toaster, toast } from 'sonner';


import AddEditFormNewLayout from './AddEditFormNewLayout';

const Calendar = () => {
  const [currentPageStart, setCurrentPageStart] = useState(startOfMonth(new Date()));
  const [bookings, setBookings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [initialBookings, setInitialBookings] = useState(localStorage.getItem('is_mla')==='true' ? constants.Mla : constants.Mp);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const mid_bookings = localStorage.getItem('is_mla') ? 3 : 5;
  const [ bookedPilgrimDetails , setBookedPilgrimDetails] = useState([])
   const { setIsLoading} = useLoading()


  useEffect(() => {

    fetchBlockedDatesAndAvailability();
  }, [currentPageStart]);
  const fetchBlockedDatesAndAvailability = async () => {
    setIsLoading(true)
    try {
      await getBlockedDates()

      await getMonthSlotAvailability(); // Call availability function after blockedDates is updated
    } catch (error) {
      console.error('Error fetching blocked dates and availability:', error);
    }finally{
      setIsLoading(false)
    }
  };
useEffect(()=>{

if(blockedDates.length>0)
  getMonthSlotAvailability()
},[blockedDates])
  useEffect(() => {
    const endDate = endOfMonth(currentPageStart);

    const days = eachDayOfInterval({
      start: currentPageStart,
      end: endDate,
    }).reduce((acc, day) => {
      acc[format(day, 'yyyy-MM-dd')] = null;
      return acc;
    }, {});
    setBookings(days);
  }, [currentPageStart]);
  const getPilgrimDetails=async(date)=>{
    try{

     const res = await apis.getPilgrimDetails(format(date,'yyyy-MM-dd'))
    setBookedPilgrimDetails(res?.data || [])
    }catch(e)
    {toast.error("Something went wrong!")
    console.log(e)
    }

  }
  useEffect(()=>{
    if(selectedDate)
   getPilgrimDetails(selectedDate)
  },[selectedDate])
  const isDayBeforeToday = (day) => {
    const today = startOfToday();
   
    return isBefore(day, today)|| isSameDay(day, today);
  };
 const getBlockedDates=async()=>{
try{
  const blockedDatesResponse = await apis.getBlockedDates();
  const dates = blockedDatesResponse?.data?.map(item => format(new Date(item.blockdate), 'yyyy-MM-dd'));
  setBlockedDates(dates);
}catch(e)
{toast.error("Something went wrong!")
console.log(e)
}
 }

 const isCurrentMonth = () =>{
  const today = startOfToday();
  return (currentPageStart.getFullYear() === today.getFullYear() && currentPageStart.getMonth() === today.getMonth())
 }
  useEffect(() => {
    if (toastMessage.type === 'success') {
      toast.success(toastMessage.message);
      getMonthSlotAvailability();
    }
    if (toastMessage.type === 'error') {
      toast.error(toastMessage.message);
    }
  }, [toastMessage]);

  const getMonthSlotAvailability = async () => {
    try {
      const res = await apis.getMonthSlotAvailability(currentPageStart.getMonth() + 1, currentPageStart.getFullYear());
     if(res?.data)
     {
const transformedObject = blockedDates.reduce((acc,blockdate)=>{
  acc[blockdate]=0
  return acc;
},{})
res?.data.forEach(({booked_datetime,pilgrim_count})=>{
  if(!blockedDates.includes(booked_datetime))
    {
      transformedObject[booked_datetime]= pilgrim_count
    }
})
      setBookings(prev => {
        const updatedBookings = { ...prev };
        Object.keys(updatedBookings).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(transformedObject, key)) {
            
            updatedBookings[key] = transformedObject[key];
          }
          else updatedBookings[key]= null
        });

        return updatedBookings;
      });
      setIsLoading(false)
   } } catch (e) {
      console.log(e);
    }
  };

  const handleBooking = day => {
 if(day)
   { setIsModalOpen(true);
    setSelectedDate(day);
    getPilgrimDetails(format(day,'yyyy-MM-dd'))
   }
  };

  const getDayClass = day => {
    const bookingsDone = bookings[format(day, 'yyyy-MM-dd')]>0?true:false;

    if(bookingsDone)
    {
      return 'text-red-500'
    }
    else return 'text-lime-500'
    // console.log("bl",bookingsLeft)
    // if (bookingsLeft === initialBookings) return 'text-lime-500';
    // if (bookingsLeft > mid_bookings) return 'text-yellow-500';
    // if (bookingsLeft > 0) return 'text-orange-500';
    // return 'text-red-500';
  };
const getDayClassforSmallScreens = day =>{
  const bookingsDone = bookings[format(day, 'yyyy-MM-dd')]>0?true:false;
  if(bookingsDone)
    {
      return 'bg-red-500'
    }
    else return 'bg-lime-500'
  // const bookingsLeft = bookings[format(day, 'yyyy-MM-dd')];
  // if (bookingsLeft === initialBookings) return 'bg-lime-500';
  // if (bookingsLeft > mid_bookings) return 'bg-yellow-500';
  // if (bookingsLeft > 0) return 'bg-orange-500';
  // return 'bg-red-500';

}
  const goToPreviousPage = () => {
   
    setCurrentPageStart(subMonths(currentPageStart, 1));
  };

  const goToNextPage = () => {
    setCurrentPageStart(addMonths(currentPageStart, 1));
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentPageStart);
    const startDayIndex = getDay(startOfMonth(currentPageStart));
    const totalDays = daysInMonth + startDayIndex;
    const paddedDays = [...Array(totalDays > 0 ? totalDays : 7).fill(null)];

    return paddedDays.map((_, index) => {
      const day = index - startDayIndex + 1;
      if (index < startDayIndex || day > daysInMonth) {
        return null;
      }
      return addDays(startOfMonth(currentPageStart), day - 1);
    });
  };

  return (
    <div className="w-full mx-auto sm:max-w-4xl md:max-w-4xl mb-4">
      {/* <Toaster richColors position="top-center" /> */}
      <div className={`flex justify-center mb-4`}>
        {!isCurrentMonth() && <button onClick={goToPreviousPage} className="text-3xl text-black px-4 py-2 rounded hover:text-4xl">
          <FiArrowLeft />
        </button>}
        <h2 className={`text-xl mt-2`}>{format(currentPageStart, 'MMMM yyyy')}</h2>
        <button onClick={goToNextPage} className="text-3xl text-black px-4 py-2 rounded hover:text-4xl">
          <FiArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4 md:gap-4">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <div key={day} className={`text-center font-mono md:bg-gray-200 
          p-2 rounded-lg mb-2 md:mb-0 md:p-2
       
          `}>
            <span className="hidden md:inline">{day}</span>
            <span className="md:hidden">{'Sun Mon Tue Wed Thu Fri Sat'.split(' ')[index]}</span>
          </div>
        ))}
        {generateCalendarDays().map((day, index) => (
          <div key={index} className="text-center">
            {day && (
              <div
                className={`w-18 h-14 sm:h-16 sm:w-18 text-center rounded-lg text-black border    ${isDayBeforeToday(day) ?'bg-slate-500 sm:bg-slate-300 sm:hover:bg-gray-400'  : 'hover:bg-slate-200'}
               
                   ${window.innerWidth <= 768 ? (isDayBeforeToday(day) ? 'bg-gray-400 hover:bg-gray-400' : getDayClassforSmallScreens(day)):''}
                   border-gray-300 mb-2 md:grid md:grid-cols-12 items-center `}
                onClick={() => !isDayBeforeToday(day) && handleBooking(format(day, 'yyyy-MM-dd'))}
                style={{
                  width: 'auto',
             
                  margin: 'auto',
                  ...(window.innerWidth <= 768 && {
                    height: '40px',
                    width: '50px',
                    margin: 'auto',
                  }),
                }}
              >
                <span className="font-bold flex text-xs text-center justify-center md:text-sm block md:col-span-2 pr-1 sm:pl-5">{format(day, 'd')}</span>
                <div className="text-xs md:text-base block md:col-span-8 flex flex-col items-center justify-center">
                  {bookings[format(day, 'yyyy-MM-dd')] === 0 ? (
                    <div className="grid pl-4">
                     {<div className="hidden sm:block"><FaTicketAlt size={25}className={`text-red-500 `} /></div>}
                      {/* <div className='sm:text-red-500 sm:text-base font-mono pr-5 text-xs text-white'>NA</div> */}
                    </div>
                  ) : (
                    <>
                      {/* <span className="md:hidden">{bookings[format(day, 'yyyy-MM-dd')]}/6</span> */}
                      <div className="grid  text-center justify-center pl-6">
                       { <div className="hidden sm:block"><FaTicketAlt  size={25} className={`${getDayClass(day)} text-base  `} /></div>}
                        {/* <div className="pr-5 text-white sm:text-black">Avl:{bookings[format(day, 'yyyy-MM-dd')]}</div> */}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
           {/* Legend */}
           <div className="flex justify-center mt-4 space-x-6 font-mono">
        <div className="flex items-center ">
          <FaTicketAlt className="text-red-500" />
          <span className="ml-2">Booked</span>
        </div>
        <div className="flex items-center">
          <FaTicketAlt className="text-lime-500" />
          <span className="ml-2">Available</span>
        </div>
      </div>
      {
      // bookings[selectedDate] > 0 && 
      (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddEditFormNewLayout
            getPilgrimDetails={getPilgrimDetails}
            bookingsObject={bookings}
            date={selectedDate}
            bookingsCount={bookings[selectedDate]}
            setIsModalOpen={setIsModalOpen}
            setToastMessage={setToastMessage}
            isModalOpen={isModalOpen}
            getMonthSlotAvailability={getMonthSlotAvailability}
            bookedPilgrimDetails={bookedPilgrimDetails}
            
          />
        </Modal>
      )}
    </div>
  );
};

export default Calendar;
