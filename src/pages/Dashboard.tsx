import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Star,
  Target,
  Plus,
  Zap,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [studyHours, setStudyHours] = useState(0);

  // Get data from localStorage to show real user data
  const assignments = JSON.parse(localStorage.getItem('schoolApp_assignments') || '[]');
  const scheduleItems = JSON.parse(localStorage.getItem('schoolApp_schedule') || '[]');
  const notes = JSON.parse(localStorage.getItem('schoolApp_notes') || '[]');
  const courses = JSON.parse(localStorage.getItem('schoolApp_courses') || '[]');

  // Load study hours from localStorage or initialize to 0
  useEffect(() => {
    const savedStudyHours = localStorage.getItem('schoolApp_studyHours');
    if (savedStudyHours) {
      setStudyHours(parseInt(savedStudyHours));
    } else {
      setStudyHours(0);
      localStorage.setItem('schoolApp_studyHours', '0');
    }
  }, []);

  const upcomingAssignments = assignments
    .filter((assignment: any) => assignment.status !== 'completed')
    .slice(0, 3);

  const todaySchedule = scheduleItems.filter((item: any) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return item.day === today;
  });

  const completedAssignments = assignments.filter((assignment: any) => assignment.status === 'completed').length;
  const currentGPA = courses.length > 0 ? 
    (courses.reduce((sum: number, course: any) => sum + (course.gradePoints * course.credits), 0) / 
     courses.reduce((sum: number, course: any) => sum + course.credits, 0)).toFixed(2) : '0.00';

  const stats = [
    {
      name: 'Assignments Due',
      value: upcomingAssignments.length.toString(),
      icon: BookOpen,
      color: 'from-blue-400 to-blue-600',
      change: assignments.length > 0 ? `${assignments.length} total` : 'No assignments yet',
      bgPattern: 'bg-blue-500/10'
    },
    {
      name: 'Study Hours',
      value: studyHours.toString(),
      icon: Clock,
      color: 'from-purple-400 to-purple-600',
      change: 'This semester',
      bgPattern: 'bg-purple-500/10'
    },
    {
      name: 'Current GPA',
      value: currentGPA,
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      change: courses.length > 0 ? `${courses.length} courses` : 'No courses yet',
      bgPattern: 'bg-green-500/10'
    },
    {
      name: 'Completed Tasks',
      value: completedAssignments.toString(),
      icon: CheckCircle,
      color: 'from-orange-400 to-orange-600',
      change: assignments.length > 0 ? `${assignments.length - completedAssignments} remaining` : 'No tasks yet',
      bgPattern: 'bg-orange-500/10'
    }
  ];

  const recentActivity = [
    ...(assignments.length > 0 ? [{ action: 'Added', item: `${assignments.length} assignments`, time: 'Recently', icon: BookOpen }] : []),
    ...(notes.length > 0 ? [{ action: 'Created', item: `${notes.length} study notes`, time: 'Recently', icon: FileText }] : []),
    ...(scheduleItems.length > 0 ? [{ action: 'Updated', item: 'Class schedule', time: 'Recently', icon: Calendar }] : []),
  ].slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-400/30 relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
        />
        <div className="flex items-center space-x-6 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </motion.div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Welcome, {user.name}!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-lg"
            >
              {user.school} • Grade {user.grade} • Ready to organize your school life?
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 relative overflow-hidden group ${stat.bgPattern}`}
            >
              <motion.div
                animate={{ 
                  x: [0, 100, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.name}</p>
                  <motion.p 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    className="text-3xl font-bold text-white mt-2"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-green-400 text-sm mt-3 flex items-center space-x-1"
              >
                <Zap className="w-3 h-3" />
                <span>{stat.change}</span>
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Assignments */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl"
          />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center"
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white">Upcoming Assignments</h2>
            </div>
          </div>
          
          {upcomingAssignments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAssignments.map((assignment: any, index: number) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className={`w-4 h-4 rounded-full ${
                        assignment.priority === 'high' ? 'bg-red-400' :
                        assignment.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      } shadow-lg`} 
                    />
                    <div>
                      <p className="text-white font-medium group-hover:text-purple-300 transition-colors">{assignment.title}</p>
                      <p className="text-white/60 text-sm">{assignment.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    <div className="flex items-center space-x-1 justify-end">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-white/50 capitalize">{assignment.priority}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
              </motion.div>
              <p className="text-white/60 mb-3 text-lg">No assignments yet</p>
              <Link 
                to="/assignments"
                className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm font-medium hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add your first assignment</span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 relative overflow-hidden"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl"
          />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center"
              >
                <Target className="w-5 h-5 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            </div>
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                  <div>
                    <p className="text-white text-sm group-hover:text-purple-300 transition-colors">
                      <span className="font-medium">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-white/50 text-xs mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
              </motion.div>
              <p className="text-white/60 text-sm">No activity yet</p>
              <p className="text-white/40 text-xs mt-1">Start adding content to see your activity</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            x: [-100, 100, -100],
            opacity: [0, 0.3, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent"
        />
        <div className="flex items-center space-x-3 mb-6 relative z-10">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {[
            { name: 'Add Assignment', icon: BookOpen, color: 'from-blue-500 to-blue-600', link: '/assignments' },
            { name: 'Start Timer', icon: Clock, color: 'from-purple-500 to-purple-600', link: '/timer' },
            { name: 'Take Notes', icon: 'FileText', color: 'from-green-500 to-green-600', link: '/notes' },
            { name: 'Check Schedule', icon: Calendar, color: 'from-orange-500 to-orange-600', link: '/schedule' }
          ].map((action, index) => (
            <Link key={action.name} to={action.link}>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`w-full p-6 bg-gradient-to-r ${action.color} rounded-xl text-white font-medium hover:shadow-xl transition-all relative overflow-hidden group`}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                  className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="relative z-10"
                >
                  <action.icon className="w-8 h-8 mx-auto mb-3" />
                  <span className="text-sm">{action.name}</span>
                </motion.div>
              </motion.button>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Today's Schedule Preview */}
      {todaySchedule.length > 0 && (
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 relative overflow-hidden"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 text-white" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Today's Classes</h2>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaySchedule.map((item: any, index: number) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
              >
                <h3 className="font-medium text-white mb-1">{item.subject}</h3>
                <p className="text-white/70 text-sm mb-1">{item.teacher}</p>
                <p className="text-white/60 text-xs">{item.time} • {item.room}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;