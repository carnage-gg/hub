import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Clock, MapPin, Calendar } from 'lucide-react';

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  day: string;
}

const Schedule: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Load schedule from localStorage on component mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('schoolApp_schedule');
    if (savedSchedule) {
      setScheduleItems(JSON.parse(savedSchedule));
    }
  }, []);

  // Save schedule to localStorage whenever scheduleItems change
  useEffect(() => {
    localStorage.setItem('schoolApp_schedule', JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  const getItemsForDay = (day: string) => {
    return scheduleItems.filter(item => item.day === day);
  };

  const handleAddItem = (newItem: Omit<ScheduleItem, 'id'>) => {
    const item = {
      ...newItem,
      id: Date.now().toString()
    };
    setScheduleItems([...scheduleItems, item]);
    setShowAddForm(false);
  };

  const handleEditItem = (updatedItem: ScheduleItem) => {
    setScheduleItems(scheduleItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Class Schedule</h1>
          <p className="text-white/70 mt-1">Manage your weekly class schedule</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Class</span>
        </motion.button>
      </div>

      {scheduleItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 max-w-md mx-auto">
            <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No schedule yet</h3>
            <p className="text-white/60 text-sm mb-6">Create your weekly class schedule to stay organized and never miss a class.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your Schedule</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Schedule Grid */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {days.map((day, dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 border-b border-white/20">
                <h2 className="text-lg font-semibold text-white">{day}</h2>
              </div>
              
              <div className="p-4 space-y-3">
                {getItemsForDay(day).map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (dayIndex * 0.1) + (itemIndex * 0.05) }}
                    className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white text-sm">{item.subject}</h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-white/60 hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-white/60 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-white/70 text-xs">{item.teacher}</p>
                      <div className="flex items-center space-x-2 text-xs text-white/60">
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-white/60">
                        <MapPin className="w-3 h-3" />
                        <span>{item.room}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {getItemsForDay(day).length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    <p className="text-sm">No classes scheduled</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddForm || editingItem) && (
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
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingItem ? 'Edit Class' : 'Add New Class'}
            </h2>
            
            <ScheduleForm
              item={editingItem}
              onSubmit={editingItem ? handleEditItem : handleAddItem}
              onCancel={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Schedule Form Component
const ScheduleForm: React.FC<{
  item?: ScheduleItem | null;
  onSubmit: (item: any) => void;
  onCancel: () => void;
}> = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: item?.subject || '',
    teacher: item?.teacher || '',
    time: item?.time || '',
    room: item?.room || '',
    day: item?.day || 'Monday'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onSubmit({ ...item, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="e.g., Mathematics"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Teacher</label>
        <input
          type="text"
          value={formData.teacher}
          onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="e.g., Mr. Johnson"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Time</label>
        <input
          type="text"
          value={formData.time}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="e.g., 08:00 - 09:00"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Room</label>
        <input
          type="text"
          value={formData.room}
          onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="e.g., Room 101"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Day</label>
        <select
          value={formData.day}
          onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          required
        >
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
            <option key={day} value={day} className="bg-slate-800">{day}</option>
          ))}
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
          {item ? 'Update' : 'Add'} Class
        </button>
      </div>
    </form>
  );
};

export default Schedule;