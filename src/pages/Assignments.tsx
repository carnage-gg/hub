import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Circle, Clock, AlertTriangle, Filter } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load assignments from localStorage on component mount
  useEffect(() => {
    const savedAssignments = localStorage.getItem('schoolApp_assignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  // Save assignments to localStorage whenever assignments change
  useEffect(() => {
    localStorage.setItem('schoolApp_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const filteredAssignments = assignments.filter(assignment => 
    filter === 'all' || assignment.status === filter
  );

  const toggleStatus = (id: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === id) {
        const statusOrder = ['pending', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(assignment.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...assignment, status: statusOrder[nextIndex] as Assignment['status'] };
      }
      return assignment;
    }));
  };

  const addAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const assignment = {
      ...newAssignment,
      id: Date.now().toString()
    };
    setAssignments([...assignments, assignment]);
    setShowAddForm(false);
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return <Circle className="w-5 h-5 text-white/60" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Assignments</h1>
          <p className="text-white/70 mt-1">Track your homework and projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Assignment</span>
        </motion.button>
      </div>

      {assignments.length > 0 && (
        <>
          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/60" />
            <div className="flex space-x-2">
              {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as typeof filter)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Assignment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(assignment.priority)}`} />
                    <div>
                      <h3 className="font-semibold text-white">{assignment.title}</h3>
                      <p className="text-white/60 text-sm">{assignment.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStatus(assignment.id)}
                      className="hover:scale-110 transition-transform"
                    >
                      {getStatusIcon(assignment.status)}
                    </button>
                    <button
                      onClick={() => deleteAssignment(assignment.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{assignment.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-white/60">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'completed' ? 'bg-green-400/20 text-green-400' :
                    assignment.status === 'in-progress' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-white/10 text-white/70'
                  }`}>
                    {assignment.status.replace('-', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {assignments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 max-w-md mx-auto">
            <Circle className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No assignments yet</h3>
            <p className="text-white/60 text-sm mb-6">Start by adding your first assignment to keep track of your homework and projects.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Assignment</span>
            </button>
          </div>
        </motion.div>
      )}

      {filteredAssignments.length === 0 && assignments.length > 0 && (
        <div className="text-center py-12">
          <Circle className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No assignments found</p>
          <p className="text-white/40 text-sm">Try adjusting your filter</p>
        </div>
      )}

      {/* Add Assignment Modal */}
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
            <h2 className="text-xl font-semibold text-white mb-4">Add New Assignment</h2>
            <AssignmentForm
              onSubmit={addAssignment}
              onCancel={() => setShowAddForm(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Assignment Form Component
const AssignmentForm: React.FC<{
  onSubmit: (assignment: Omit<Assignment, 'id'>) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium' as Assignment['priority'],
    status: 'pending' as Assignment['status'],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          placeholder="Assignment title"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Subject name"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Assignment['priority'] }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        >
          <option value="low" className="bg-slate-800">Low</option>
          <option value="medium" className="bg-slate-800">Medium</option>
          <option value="high" className="bg-slate-800">High</option>
        </select>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Assignment description"
          rows={3}
          required
        />
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
          Add Assignment
        </button>
      </div>
    </form>
  );
};

export default Assignments;