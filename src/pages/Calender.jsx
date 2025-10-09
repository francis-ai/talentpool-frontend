import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa'; // Import the trash icon

const EVENT_INPUT_STORAGE_KEY = 'newEventInput';
const UPCOMING_EVENTS_STORAGE_KEY = 'upcomingEventsToday';

const EventCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const storedUpcomingEvents = localStorage.getItem(UPCOMING_EVENTS_STORAGE_KEY);
        if (storedUpcomingEvents) {
            try {
                setUpcomingEvents(JSON.parse(storedUpcomingEvents));
            } catch (error) {
                console.error('Error parsing upcoming events from local storage:', error);
                setUpcomingEvents([]);
            }
        } else {
            setUpcomingEvents([]);
        }

        const storedNewEventInput = localStorage.getItem(EVENT_INPUT_STORAGE_KEY);
        if (storedNewEventInput) {
            try {
                setNewEvent(JSON.parse(storedNewEventInput));
            } catch (error) {
                console.error('Error parsing new event input from local storage:', error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(UPCOMING_EVENTS_STORAGE_KEY, JSON.stringify(upcomingEvents));
    }, [upcomingEvents]);

    useEffect(() => {
        if (isModalOpen) {
            localStorage.setItem(EVENT_INPUT_STORAGE_KEY, JSON.stringify(newEvent));
        } else {
            localStorage.removeItem(EVENT_INPUT_STORAGE_KEY);
        }
    }, [isModalOpen, newEvent]);

    const getDaysInMonth = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    console.log(setEvents);

    const handlePrevMonth = () => {
        const prevMonth = currentMonth.getMonth() - 1;
        setCurrentMonth(new Date(currentMonth.setMonth(prevMonth)));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        const nextMonth = currentMonth.getMonth() + 1;
        setCurrentMonth(new Date(currentMonth.setMonth(nextMonth)));
        setSelectedDate(null);
    };

    const daysInMonth = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    const openModal = (day) => {
        if (day) {
            const formattedDate = `${year}-${currentMonth.getMonth() + 1}-${String(day).padStart(2, '0')}`;
            setNewEvent(prevState => ({ ...prevState, date: formattedDate }));
            setSelectedDate(formattedDate);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
        localStorage.removeItem(EVENT_INPUT_STORAGE_KEY);
        setNewEvent({ title: '', description: '', date: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddUpcomingEvent = () => {
        if (newEvent.title && newEvent.date) {
            setUpcomingEvents(prevEvents => [...prevEvents, newEvent]);
            closeModal();
        } else {
            alert('Please fill in the event title and date.');
        }
    };

    const handleDeleteUpcomingEvent = (indexToDelete) => {
        const updatedEvents = upcomingEvents.filter((_, index) => index !== indexToDelete);
        setUpcomingEvents(updatedEvents);
    };

    const handleEventClick = (date) => {
        const event = events.find(e => e.date === date);
        if (event) {
            alert(`Event: ${event.title}\nDescription: ${event.description}`);
        }
    };

    console.log(handleEventClick);

    const renderDays = () => {
        return daysInMonth.map((day, index) => {
            const dateStr = day ? `${year}-${currentMonth.getMonth() + 1}-${String(day).padStart(2, '0')}` : '';
            const hasUpcomingEvent = upcomingEvents.some(e => e.date === dateStr);

            return (
                <div
                    key={index}
                    className={`text-center p-2 cursor-pointer ${day ? 'text-gray-800' : 'text-transparent'} ${hasUpcomingEvent ? 'bg-green-200' : ''} ${selectedDate === dateStr ? 'bg-blue-300' : ''}`}
                    onClick={() => day && openModal(day)}
                >
                    {day}
                    {hasUpcomingEvent && (
                        <div className="text-xs text-green-800">Event</div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="date bg-white p-6 rounded shadow-lg w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevMonth} className="text-2xl text-gray-700">
                    <FaChevronLeft />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">{monthName} {year}</h2>
                <button onClick={handleNextMonth} className="text-2xl text-gray-700">
                    <FaChevronRight />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-4 mb-6">
                <div className="text-center font-bold text-gray-700">Sun</div>
                <div className="text-center font-bold text-gray-700">Mon</div>
                <div className="text-center font-bold text-gray-700">Tue</div>
                <div className="text-center font-bold text-gray-700">Wed</div>
                <div className="text-center font-bold text-gray-700">Thu</div>
                <div className="text-center font-bold text-gray-700">Fri</div>
                <div className="text-center font-bold text-gray-700">Sat</div>
                {renderDays()}
            </div>

            {upcomingEvents.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Events</h2>
                    <ul>
                        {upcomingEvents.map((event, index) => (
                            <li key={index} className="mb-2 p-3 bg-gray-100 rounded flex items-center justify-between">
                                <div>
                                    <strong className="text-blue-900">{event.title}</strong> ({event.date})
                                    {event.description && <p className="text-gray-700 text-sm">{event.description}</p>}
                                </div>
                                <button
                                    onClick={() => handleDeleteUpcomingEvent(index)}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isModalOpen && (
                <div className=" fixed inset-0 bg-gray-50 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Add Upcoming Event</h2>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={newEvent.date}
                                readOnly
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={newEvent.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUpcomingEvent}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Add Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCalendar;