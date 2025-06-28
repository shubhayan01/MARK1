import React, { createContext, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './Homepage'
import LoginPage from './Loginpage'
import EmployeeTaskPage from './EmployeeTaskPage'

// Create context for user authentication and tasks
export const AuthContext = createContext(null);
export const TaskContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Welcome! This is a sample task.",
      createdBy: "system",
      createdAt: new Date().toISOString(),
      status: "pending"
    }
  ]);

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={user.role === 'employee' ? '/employee-tasks' : '/'} replace />;
    }

    return children;
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <TaskContext.Provider value={{ tasks, setTasks }}>
        <Router>
          <Routes>
            <Route path="/login" element={
              user ? (
                <Navigate to={user.role === 'employee' ? '/employee-tasks' : '/'} replace />
              ) : (
                <LoginPage />
              )
            } />
            
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['client']}>
                <Homepage />
              </ProtectedRoute>
            } />
            
            <Route path="/employee-tasks" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeTaskPage />
              </ProtectedRoute>
            } />
            
          </Routes>
        </Router>
      </TaskContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
