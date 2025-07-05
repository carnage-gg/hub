import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Coffee, BookOpen } from 'lucide-react';

const StudyTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    studyTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isRunning && minutes === 0 && seconds === 0) {
      // Timer finished
      setIsRunning(false);
      if (!isBreak) {
        setSessions(sessions + 1);
        const nextSessionsCount = sessions + 1;
        if (nextSessionsCount % settings.sessionsUntilLongBreak === 0) {
          setMinutes(settings.longBreak);
        } else {
          setMinutes(settings.shortBreak);
        }
        setIsBreak(true);
      } else {
        setMinutes(settings.studyTime);
        setIsBreak(false);
      }
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isBreak, sessions, settings]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(isBreak ? (sessions % settings.sessionsUntilLongBreak === 0 ? settings.longBreak : settings.shortBreak) : settings.studyTime);
    setSeconds(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak 
      ? (sessions % settings.sessionsUntilLongBreak === 0 ? settings.longBreak : settings.shortBreak) * 60
      : settings.studyTime * 60;
    const currentTime = minutes * 60 + seconds;
    return ((totalTime - currentTime) / totalTime) * 100;
  };

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    setShowSettings(false);
    if (!isRunning) {
      setMinutes(newSettings.studyTime);
      setSeconds(0);
      setIsBreak(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Study Timer</h1>
          <p className="text-white/70 mt-1">Pomodoro technique for focused learning</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </motion.button>
      </div>

      {/* Main Timer */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-4 border-white/20 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {isBreak ? (
                  <Coffee className="w-8 h-8 text-green-400" />
                ) : (
                  <BookOpen className="w-8 h-8 text-purple-400" />
                )}
                <span className="text-white/70 text-lg">
                  {isBreak ? 'Break Time' : 'Study Time'}
                </span>
              </div>
              <div className="text-6xl font-bold text-white mb-4">
                {formatTime(minutes, seconds)}
              </div>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTimer}
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetTimer}
                  className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="w-8 h-8" />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-80 h-80 -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="152"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="160"
              cy="160"
              r="152"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 152}`}
              strokeDashoffset={`${2 * Math.PI * 152 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Sessions Completed</p>
              <p className="text-2xl font-bold text-white">{sessions}</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Next Break</p>
              <p className="text-2xl font-bold text-white">
                {sessions % settings.sessionsUntilLongBreak === 0 ? 'Long' : 'Short'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{Math.floor(getProgress())}%</span>
            </div>
            <div>
              <p className="text-white/70 text-sm">Progress</p>
              <p className="text-2xl font-bold text-white">
                {isRunning ? 'Running' : 'Paused'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
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
            <h2 className="text-xl font-semibold text-white mb-4">Timer Settings</h2>
            <TimerSettings
              settings={settings}
              onSave={updateSettings}
              onCancel={() => setShowSettings(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Timer Settings Component
const TimerSettings: React.FC<{
  settings: any;
  onSave: (settings: any) => void;
  onCancel: () => void;
}> = ({ settings, onSave, onCancel }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Study Time (minutes)</label>
        <input
          type="number"
          min="1"
          max="60"
          value={formData.studyTime}
          onChange={(e) => setFormData(prev => ({ ...prev, studyTime: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Short Break (minutes)</label>
        <input
          type="number"
          min="1"
          max="30"
          value={formData.shortBreak}
          onChange={(e) => setFormData(prev => ({ ...prev, shortBreak: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Long Break (minutes)</label>
        <input
          type="number"
          min="1"
          max="60"
          value={formData.longBreak}
          onChange={(e) => setFormData(prev => ({ ...prev, longBreak: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Sessions until Long Break</label>
        <input
          type="number"
          min="2"
          max="10"
          value={formData.sessionsUntilLongBreak}
          onChange={(e) => setFormData(prev => ({ ...prev, sessionsUntilLongBreak: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default StudyTimer;