import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: 'class' | 'assignment' | 'exam' | 'event';
  color: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('schoolApp_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('schoolApp_events', JSON.stringify(events));
  }, [events]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDateString = (date: Date, day: number) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const getEventsForDate = (dateString: string) => {
    return events.filter(event => event.date === dateString);
  };

  const addEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event = {
      ...newEvent,
      id: Date.now().toString()
    };
    setEvents([...events, event]);
    setShowAddForm(false);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(currentDate, day);
      const dayEvents = getEventsForDate(dateString);
      const isToday = new Date().toDateString() === new Date(dateString).toDateString();

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          className={`p-2 min-h-[80px] border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${
            isToday ? 'bg-purple-500/20 border-purple-400' : ''
          }`}
          onClick={() => setSelectedDate(dateString)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-purple-400' : 'text-white'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded text-white ${event.color} truncate`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-white/60">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <p className="text-white/70 mt-1">Manage your academic schedule</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </motion.button>
      </div>

      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 max-w-md mx-auto">
            <CalendarIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No events scheduled</h3>
            <p className="text-white/60 text-sm mb-6">Start adding events to keep track of important dates, exams, and deadlines.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Event</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
            >
              {/* Calendar Header */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-white/70 font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendarDays()}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Today's Events</h3>
              <div className="space-y-3">
                {getEventsForDate(new Date().toISOString().split('T')[0]).map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full ${event.color} flex-shrink-0 mt-1`} />
                    <div>
                      <p className="text-white font-medium text-sm">{event.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-white/60 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                        {event.location && (
                          <>
                            <MapPin className="w-3 h-3 ml-2" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {getEventsForDate(new Date().toISOString().split('T')[0]).length === 0 && (
                  <p className="text-white/60 text-sm">No events scheduled for today</p>
                )}
              </div>
            </motion.div>

            {/* Selected Date Events */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {new Date(selectedDate).toLocaleDateString()}
                </h3>
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full ${event.color} flex-shrink-0 mt-1`} />
                      <div>
                        <p className="text-white font-medium text-sm">{event.title}</p>
                        <div className="flex items-center space-x-2 text-xs text-white/60 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                          {event.location && (
                            <>
                              <MapPin className="w-3 h-3 ml-2" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedDateEvents.length === 0 && (
                    <p className="text-white/60 text-sm">No events scheduled</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Add New Event</h2>
            <EventForm
              onSubmit={addEvent}
              onCancel={() => setShowAddForm(false)}
              selectedDate={selectedDate}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Event Form Component
const EventForm: React.FC<{
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
  selectedDate: string | null;
}> = ({ onSubmit, onCancel, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    type: 'event' as CalendarEvent['type']
  });

  const typeColors = {
    class: 'bg-blue-500',
    assignment: 'bg-yellow-500',
    exam: 'bg-red-500',
    event: 'bg-green-500'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      color: typeColors[formData.type]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Event title"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Time</label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Location (Optional)</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Event location"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        >
          <option value="event" className="bg-slate-800">Event</option>
          <option value="class" className="bg-slate-800">Class</option>
          <option value="assignment" className="bg-slate-800">Assignment</option>
          <option value="exam" className="bg-slate-800">Exam</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          Add Event
        </button>
      </div>
    </form>
  );
};

export default Calendar;