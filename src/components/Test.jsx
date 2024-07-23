import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addDays, subMonths, addMonths, getDay, getDaysInMonth } from 'date-fns';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { FaTicketAlt } from "react-icons/fa";
import Modal from './Modal';
import AddEditForm from './AddEditForm';
import { constants } from '../../constant';
import apis from '../../api/apis';
import { Toaster, toast } from 'sonner';

const Calendar = () => {
  const [currentPageStart, setCurrentPageStart] = useState(startOfMonth(new Date()));
  const [bookings, setBookings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [initialBookings, setInitialBookings] = useState(localStorage.getItem('bookings') ? JSON.parse(localStorage.getItem('bookings')) : {});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const from_date = format(currentPageStart, 'yyyy-MM-dd');
      const to_date = format(endOfMonth(currentPageStart), 'yyyy-MM-dd');
      try {
        const response = await apis.getBookings(from_date, to_date);
        if (response?.status === 200) {
          const bookingsData = response.data.reduce((acc, booking) => {
            acc[format(new Date(booking.date), 'yyyy-MM-dd')] = booking.bookings_left;
            return acc;
          }, {});
          setBookings(bookingsData);
          localStorage.setItem('bookings', JSON.stringify(bookingsData));
        }
      } catch (e) {
        console.error("Error fetching bookings", e);
        toast.error('Failed to fetch bookings. Please try again.');
      }
    };

    fetchBookings();
  }, [currentPageStart]);

  useEffect(() => {
    if (toastMessage) {
      const { type, message } = toastMessage;
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      setToastMessage(null);
    }
  }, [toastMessage]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePreviousMonth = () => {
    setCurrentPageStart(subMonths(currentPageStart, 1));
  };

  const handleNextMonth = () => {
    setCurrentPageStart(addMonths(currentPageStart, 1));
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const renderCalendarCells = () => {
    const startDate = startOfMonth(currentPageStart);
    const endDate = endOfMonth(currentPageStart);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    const firstDayOfMonth = getDay(startDate);
    const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const calendarCells = paddingDays.map((_, i) => (
      <div key={`pad-${i}`} className="p-2 border border-gray-300 bg-gray-100" />
    ));

    daysInMonth.forEach((day) => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const bookingsLeft = bookings[formattedDate] || constants.BOOKINGS_PER_DAY;
      const isFull = bookingsLeft === 0;

      calendarCells.push(
        <div
          key={formattedDate}
          className={`p-2 border border-gray-300 cursor-pointer ${isFull ? 'bg-red-200' : 'bg-white'}`}
          onClick={() => handleDayClick(formattedDate)}
        >
          <div className="flex justify-between">
            <span>{format(day, 'd')}</span>
            <FaTicketAlt className="text-gray-500" />
          </div>
          <div className="text-xs text-right">
            {isFull ? 'Full' : `${bookingsLeft} left`}
          </div>
        </div>
      );
    });

    return calendarCells;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Toaster richColors />
      <div className="flex justify-between mb-4">
        <button onClick={handlePreviousMonth} className="p-2 border rounded">
          <FiArrowLeft />
        </button>
        <div className="text-lg font-bold">
          {format(currentPageStart, 'MMMM yyyy')}
        </div>
        <button onClick={handleNextMonth} className="p-2 border rounded">
          <FiArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-bold p-2 border border-gray-300 bg-gray-200">
            {day}
          </div>
        ))}
        {renderCalendarCells()}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddEditForm
          bookingsObject={bookings}
          date={selectedDate}
          bookingsLeft={bookings[selectedDate]}
          setIsModalOpen={setIsModalOpen}
          setToastMessage={setToastMessage}
          isModalOpen={isModalOpen}
        />
      </Modal>
    </div>
  );
};

export default Calendar;
