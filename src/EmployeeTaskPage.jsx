import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, LogOut, Circle } from 'lucide-react';

const EmployeeTaskPage = () => {
  const [user, setUser] = useState({ name: '', email: 'john.doe@company.com' });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNameForm, setShowNameForm] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    taskId: null,
    taskName: '',
    newStatus: '',
    updatedBy: '',
    showForm: false
  });

  // Fetch tasks from n8n webhook
  const fetchTasks = async (employeeName) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5678/webhook-test/70de41be-6955-42b5-9cda-eca71606a9a6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeName })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Tasks received:', data);
      
      // Handle both single task and array of tasks
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data && typeof data === 'object') {
        setTasks([data]);
      } else {
        setTasks([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const handleNameSubmit = async () => {
    if (nameInput.trim()) {
      setUser(prev => ({ ...prev, name: nameInput.trim() }));
      setShowNameForm(false);
      await fetchTasks(nameInput.trim());
    } else {
      alert('Please enter your name');
    }
  };

  const handleStatusChangeRequest = (taskId, taskName, newStatus) => {
    setStatusUpdateForm({
      taskId,
      taskName,
      newStatus,
      updatedBy: '',
      showForm: true
    });
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdateForm.updatedBy.trim()) {
      alert('Please enter the name of the employee updating this task');
      return;
    }

    const currentDate = new Date().toISOString();
    
    // Update local state
    const updatedTasks = tasks.map(task =>
      task.id === statusUpdateForm.taskId 
        ? { 
            ...task, 
            status: statusUpdateForm.newStatus,
            lastUpdatedBy: statusUpdateForm.updatedBy,
            lastUpdated: currentDate
          } 
        : task
    );
    setTasks(updatedTasks);

    // Send data to n8n webhook
    try {
      const response = await fetch('http://localhost:5678/webhook-test/05c1e19a-d24a-4dc0-8002-a0a234fe4456', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskName: statusUpdateForm.taskName,
          updatedBy: statusUpdateForm.updatedBy,
          date: currentDate,
          newStatus: statusUpdateForm.newStatus
        })
      });

      if (response.ok) {
        alert('Task status updated successfully!');
      } else {
        alert('Failed to update task status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error occurred while updating task status.');
    }

    // Close the form
    setStatusUpdateForm({
      taskId: null,
      taskName: '',
      newStatus: '',
      updatedBy: '',
      showForm: false
    });
  };

  const handleLogout = () => {
    setShowNameForm(true);
    setUser({ name: '', email: 'john.doe@company.com' });
    setTasks([]);
    setNameInput('');
  };

  if (showNameForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-md mx-4">
          <h2 className="text-2xl font-light text-center mb-6 tracking-wide">ENTER YOUR NAME</h2>
          <div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="w-full bg-gray-800/30 backdrop-blur-sm border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400/70 focus:outline-none focus:border-white/40 focus:bg-gray-800/40 transition-all duration-500 font-light mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            <button
              onClick={handleNameSubmit}
              className="w-full bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-500/80 hover:to-blue-400/80 text-white px-4 py-3 rounded-xl transition-all duration-300 font-light shadow-lg shadow-blue-500/20"
            >
              Show Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-12 h-12 flex items-center justify-center">
            <Circle className="w-full h-full text-white/30 animate-spin" />
          </div>
          <p className="text-gray-300">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gray-200/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Top Navigation */}
      <div className="relative z-20 flex justify-between items-center p-4 md:p-6 pt-6 md:pt-8">
        <div className="animate-fade-in">
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            NOVUS
          </h2>
        </div>

        <button
          onClick={handleLogout}
          className="group relative bg-gray-900/30 hover:bg-red-900/40 backdrop-blur-sm border border-gray-600/30 hover:border-red-400/50 text-gray-300 hover:text-red-200 font-light px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-black/20 hover:shadow-red-500/20"
        >
          <div className="flex items-center space-x-1 md:space-x-2">
            <LogOut className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm">Logout</span>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mx-auto mb-6 w-12 h-12 flex items-center justify-center">
            <div className="absolute w-full h-full">
              <Circle className="w-full h-full text-white/30 animate-spin-slow" />
            </div>
            <div className="absolute w-8 h-8">
              <Circle className="w-full h-full text-gray-300/40 animate-spin-reverse" />
            </div>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-white to-gray-200 rounded-full animate-pulse shadow-lg shadow-white/50"></div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight mb-4 tracking-[0.2em]">
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              MY ASSIGNMENTS
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200/90 font-light tracking-[0.1em]">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Tasks Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task, index) => (
            <div
              key={task.row_number || index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm text-white/50">
                  Assigned to: {task["Assigned to"] || 'Not specified'}
                </div>
                <div className="text-xs text-white/30">
                  #{task.row_number}
                </div>
              </div>
              
              <p className="text-white/90 mb-4 font-medium">
                {task["Task Name"] || 'No task name available'}
              </p>

              <div className="text-sm text-white/60 mb-4">
                <span className="inline-flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Due: {task.Date || 'No date specified'}
                </span>
              </div>

              {task.lastUpdated && (
                <div className="text-xs text-white/30 mb-4">
                  Last Updated: {new Date(task.lastUpdated).toLocaleString()} by {task.lastUpdatedBy}
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  task.status === 'pending' 
                    ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                    : task.status === 'completed'
                    ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                    : task.status === 'failed'
                    ? 'bg-red-500/20 text-red-200 border border-red-400/30'
                    : 'bg-gray-500/20 text-gray-200 border border-gray-400/30'
                }`}>
                  {task.status?.charAt(0).toUpperCase() + task.status?.slice(1) || 'Pending'}
                </span>
              </div>

              {/* Update Status Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusChangeRequest(task.row_number || index, task["Task Name"], 'pending')}
                  className="flex items-center justify-center p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-400/30 hover:border-yellow-400/50 text-yellow-200 transition-all duration-300"
                  title="Mark as Pending"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs">Pending</span>
                </button>
                
                <button
                  onClick={() => handleStatusChangeRequest(task.row_number || index, task["Task Name"], 'completed')}
                  className="flex items-center justify-center p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-400/30 hover:border-green-400/50 text-green-200 transition-all duration-300"
                  title="Mark as Completed"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Done</span>
                </button>
                
                <button
                  onClick={() => handleStatusChangeRequest(task.row_number || index, task["Task Name"], 'failed')}
                  className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 hover:border-red-400/50 text-red-200 transition-all duration-300"
                  title="Mark as Failed"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Failed</span>
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="col-span-full text-center text-white/50 py-12">
              No tasks available for {user.name}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Form Modal */}
      {statusUpdateForm.showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-black/50">
            <h3 className="text-xl font-light text-white mb-6 text-center tracking-wide">UPDATE TASK STATUS</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-light text-gray-300/90 mb-2 tracking-wide">
                  TASK NAME
                </label>
                <div className="text-white bg-gray-800/30 px-4 py-3 rounded-xl border border-gray-600/30">
                  {statusUpdateForm.taskName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300/90 mb-2 tracking-wide">
                  NEW STATUS
                </label>
                <div className="text-white bg-gray-800/30 px-4 py-3 rounded-xl border border-gray-600/30 flex items-center">
                  {statusUpdateForm.newStatus === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                  {statusUpdateForm.newStatus === 'completed' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {statusUpdateForm.newStatus === 'failed' && <XCircle className="w-4 h-4 mr-2" />}
                  {statusUpdateForm.newStatus.charAt(0).toUpperCase() + statusUpdateForm.newStatus.slice(1)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-light text-gray-300/90 mb-2 tracking-wide">
                  EMPLOYEE NAME (WHO IS UPDATING?) *
                </label>
                <input
                  type="text"
                  value={statusUpdateForm.updatedBy}
                  onChange={(e) => setStatusUpdateForm(prev => ({ ...prev, updatedBy: e.target.value }))}
                  placeholder="Enter the employee name"
                  className="w-full bg-gray-800/30 backdrop-blur-sm border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400/70 focus:outline-none focus:border-white/40 focus:bg-gray-800/40 transition-all duration-500 font-light"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setStatusUpdateForm({ taskId: null, taskName: '', newStatus: '', updatedBy: '', showForm: false })}
                className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-3 rounded-xl transition-all duration-300 font-light"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-500/80 hover:to-blue-400/80 text-white px-4 py-3 rounded-xl transition-all duration-300 font-light shadow-lg shadow-blue-500/20"
              >
                Submit Update
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-fade-in { animation: fade-in 1.2s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 25s linear infinite; }
      `}</style>
    </div>
  );
};

export default EmployeeTaskPage;