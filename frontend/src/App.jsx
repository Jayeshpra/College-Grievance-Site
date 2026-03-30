import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from './components/Dashboard';
import FacultyDashboard from './components/FacultyDashboard';
import FileComplaint from './components/FileComplaint';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';

import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />

        <Route
          path='/dashboard'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'STAFF']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/add-complaint'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'STAFF', 'FACULTY', 'ADMIN']}>
              <FileComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path='/fac-dashboard'
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'STAFF']}>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;