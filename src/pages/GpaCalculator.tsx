import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calculator, TrendingUp } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const gradeScale = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  // Load courses from localStorage on component mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('schoolApp_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Save courses to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem('schoolApp_courses', JSON.stringify(courses));
  }, [courses]);

  const calculateGPA = () => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  };

  const addCourse = (newCourse: Omit<Course, 'id'>) => {
    const course = {
      ...newCourse,
      id: Date.now().toString()
    };
    setCourses([...courses, course]);
    setShowAddForm(false);
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const getGradeColor = (grade: string) => {
    const gradePoint = gradeScale[grade as keyof typeof gradeScale];
    if (gradePoint >= 3.7) return 'text-green-400';
    if (gradePoint >= 3.0) return 'text-yellow-400';
    if (gradePoint >= 2.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const currentGPA = calculateGPA();
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">GPA Calculator</h1>
          <p className="text-white/70 mt-1">Track your academic performance</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Course</span>
        </motion.button>
      </div>

      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 max-w-md mx-auto">
            <Calculator className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses added yet</h3>
            <p className="text-white/60 text-sm mb-6">Add your courses with grades to calculate your GPA and track your academic progress.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Course</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* GPA Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30"
            >
              <div className="flex items-center space-x-3">
                <Calculator className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-white/70 text-sm">Current GPA</p>
                  <p className="text-2xl font-bold text-white">{currentGPA}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-white/70 text-sm">Total Credits</p>
                  <p className="text-2xl font-bold text-white">{totalCredits}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{courses.length}</span>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold text-white">{courses.length}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Courses Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-semibold text-white">Course Breakdown</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Grade Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {courses.map((course, index) => (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{course.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/70">{course.credits}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getGradeColor(course.grade)}`}>
                          {course.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/70">{course.gradePoints.toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* Add Course Modal */}
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
            <h2 className="text-xl font-semibold text-white mb-4">Add New Course</h2>
            <CourseForm
              onSubmit={addCourse}
              onCancel={() => setShowAddForm(false)}
              gradeScale={gradeScale}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Course Form Component
const CourseForm: React.FC<{
  onSubmit: (course: Omit<Course, 'id'>) => void;
  onCancel: () => void;
  gradeScale: Record<string, number>;
}> = ({ onSubmit, onCancel, gradeScale }) => {
  const [formData, setFormData] = useState({
    name: '',
    credits: 3,
    grade: 'A'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      gradePoints: gradeScale[formData.grade as keyof typeof gradeScale]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Course Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="e.g., Mathematics"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Credits</label>
        <input
          type="number"
          min="1"
          max="6"
          value={formData.credits}
          onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Grade</label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        >
          {Object.keys(gradeScale).map(grade => (
            <option key={grade} value={grade} className="bg-slate-800">
              {grade} ({gradeScale[grade as keyof typeof gradeScale].toFixed(1)})
            </option>
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
          Add Course
        </button>
      </div>
    </form>
  );
};

export default GpaCalculator;