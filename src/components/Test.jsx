import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addDays, subMonths, addMonths, getDay, getDaysInMonth } from 'date-fns';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { FaTicketAlt } from "react-icons/fa";
import Modal from './Modal';
import AddEditForm from './AddEditForm';
import { constants } from '../../constant';
import apis from '../../api/apis';
import { Toaster, toast } from 'sonner'
const Calendar = () => {
  const [currentPageStart, setCurrentPageStart] = useState(startOfMonth(new Date()));
  const [bookings, setBookings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [initialBookings, setInitialBookings] = useState(localStorage.getItem('is_mla') ? constants.Mla : constants.Mp);
  const [toastMessage , setToastMessage] = useState({type:'','message':''})
  const mid_bookings = localStorage.getItem('is_mla') ? 3 : 5;

  useEffect(() => {
  
    const endDate = endOfMonth(currentPageStart); // Get the end date of the current month

    const days = eachDayOfInterval({
      start: currentPageStart,
      end: endDate,
    }).reduce((acc, day) => {
      acc[format(day, 'yyyy-MM-dd')] = initialBookings; // Initialize with 6 slots per day
      return acc;
    }, {});
    setBookings(days);
  }, [currentPageStart, initialBookings]);

  useEffect(() => {
    const getMonthSlotAvailability = async () => {
     
      try {
        const res = await apis.getMonthSlotAvailability(currentPageStart.getMonth() + 1, currentPageStart.getFullYear());
       const transformedObject = res?.data.reduce((acc,{booked_datetime,vacant_count})=>{
                     acc[booked_datetime]=vacant_count;
                     return acc
       },{})
      
       setBookings(prev => {
        const updatedBookings = { ...prev };
        Object.keys(updatedBookings).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(transformedObject, key)) {
            console.log("key",key,transformedObject[key])
            updatedBookings[key] = transformedObject[key];
          }
        });
    
        return updatedBookings;
      });

      } catch (e) {
        console.log(e);
      }
    };

    getMonthSlotAvailability();
    if(toastMessage.type==="success")

     {
       getMonthSlotAvailability();
     }
  }, [currentPageStart.getMonth(),currentPageStart.getFullYear(),toastMessage.type]); // Empty dependency array to ensure this runs only once when the component mounts

  useEffect(() => {
    console.log("bookings", bookings);
  }, [bookings]);

  const handleBooking = (day) => {
    // setBookings((prev) => ({
    //     ...prev,
    //     [day]: prev[day] > 0 ? prev[day] - 1 : 0,
    //   }));
     setIsModalOpen(true);
    setSelectedDate(day);
  };

  const getDayClass = (day) => {
    const bookingsLeft = bookings[format(day, 'yyyy-MM-dd')];
    if (bookingsLeft === initialBookings) return 'bg-lime-500';
    if (bookingsLeft > mid_bookings) return 'bg-yellow-500';
    if (bookingsLeft > 0) return 'bg-orange-500';
    return 'bg-red-500';
  };
useEffect(()=>{

if(toastMessage.type==="success")
  {toast.success(toastMessage.message)
    
  }
  if(toastMessage.type==="error")
    toast.error(toastMessage.message)
},[toastMessage?.type])
  const goToPreviousPage = () => 
    {setCurrentPageStart(subMonths(currentPageStart, 1)); // Move back 1 month
  };

  const goToNextPage = () => {
    setCurrentPageStart(addMonths(currentPageStart, 1)); // Move forward 1 month
  };

  // Function to generate days for the calendar grid, starting with Sunday
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentPageStart); // Get number of days in current month

    const startDayIndex = getDay(startOfMonth(currentPageStart)); // Day index of the first day of the month
    const endDayIndex = getDay(endOfMonth(currentPageStart)); // Day index of the last day of the month

    // Calculate the number of days to display, including padding for the start of the week
    const totalDays = daysInMonth + startDayIndex;
    const paddedDays = [...Array(totalDays > 0 ? totalDays : 7).fill(null)];

    return paddedDays.map((_, index) => {
      const day = index - startDayIndex + 1; // Calculate the day of the month

      if (index < startDayIndex || day > daysInMonth) {
        return null; // Render null for days outside the current month
      }

      return addDays(startOfMonth(currentPageStart), day - 1); // Return the date object for the day
    });
  };

  return (
    <div className="p-4">
      <Toaster richColors position="top-center"/>
      <div className="flex justify-between mb-4">
        <button
          onClick={goToPreviousPage}
          className="text-3xl text-black px-4 py-2 rounded hover:text-4xl"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-xl">{format(currentPageStart, 'MMMM yyyy')}</h2>
        <button
          onClick={goToNextPage}
          className="text-3xl text-black px-4 py-2 rounded hover:text-4xl"
        >
          <FiArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4 md:gap-4">
        {/* Render days of the week header */}
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <div key={day} className="text-center font-mono md:bg-gray-200 p-2 rounded-lg mb-2 md:mb-0 md:p-2">
            <span className="hidden md:inline">{day}</span>
            <span className="md:hidden">{'Sun Mon Tue Wed Thu Fri Sat'.split(' ')[index]}</span>
          </div>
        ))}
        {/* Render calendar days */}
        {generateCalendarDays().map((day, index) => (
          <div key={index} className="text-center">
            {day && (
              <div
                className={`p-2 text-center rounded-lg text-white ${getDayClass(day)} mb-2 md:grid md:grid-cols-12 items-center hover:bg-lime-700`}
                onClick={() => handleBooking(format(day, 'yyyy-MM-dd'))}
                style={{
                  height: 'auto',
                  width: 'auto',
                  margin: 'auto', // Default style for large screens
                  // Conditional style for small screens
                  ...(window.innerWidth <= 768 && {
                    height: '40px',
                    width: '30px',
                    margin: 'auto',
                  }),
                }}
              >
                <span className="font-bold text-xs md:text-sm block md:col-span-2">{format(day, 'd')}</span>
                <div className="text-xs md:text-base block md:col-span-10">
                  {bookings[format(day, 'yyyy-MM-dd')] === 0 ? (
                    <span className="text-white font-bold">NA</span>
                  ) : (
                    <>
                      <span className="block md:hidden">{/* Empty block for small devices */}</span>
                      <span className="md:hidden">{bookings[format(day, 'yyyy-MM-dd')]}/6</span>
                      <span className="hidden md:inline">Tickets: {bookings[format(day, 'yyyy-MM-dd')]} / {initialBookings} </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {bookings[selectedDate] > 0 && <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddEditForm bookingsObject={bookings} date={selectedDate} bookingsLeft={bookings[selectedDate]} setIsModalOpen={setIsModalOpen} setToastMessage={setToastMessage} isModalOpen={isModalOpen}/>
      </Modal>}
    </div>
  );
};

export default Calendar;
