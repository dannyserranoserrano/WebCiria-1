import React from 'react'
import './App.css';
import { Route, Routes, } from 'react-router-dom';
import Home from './api/Home/Home';
import Register from './api/Register/Register';
import Login from './api/Login/Login';
import User from './api/Users/User/User';
import UserAdmin from './api/Users/User/UserAdmin';
import Users from './api/Users/Users';
import UpdateUser from './api/Users/UpdateUser/UpdateUser';
import UpdateUserAdmin from './api/Users/UpdateUser/UpdateUserAdmin';
import Events from './api/Events/Events';
import AddEvent from './api/Events/AddEvent/AddEvent';
import UpdateEvent from './api/Events/UpdateEvent/UpdateEvent';
import Event from './api/Events/Event/Event';
import Activities from './api/Activities/Activities';
import AddActivity from './api/Activities/AddActivity/AddActivity';
import UpdateActivity from './api/Activities/UpdateActivity/UpdateActivity';
import Activity from './api/Activities/Activity/Activity';
import ReserveAdmin from './api/Reserves/Reserve/ReserveAdmin';
import Reserve from './api/Reserves/Reserve/Reserve';
import Reserves from './api/Reserves/Reserves';
import Files from './api/Files/Files';
import AddFile from './api/Files/AddFile/AddFile';
import UpdateFile from './api/Files/UpdateFile/UpdateFile';
import File from './api/Files/File/File';
import Logout from './api/Logout/Logout'
import Footer from './components/footer/Footer';



function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={<Home />}
          />
          <Route path="/login" element={<Login />}
          />
          <Route path="/register" element={<Register />}
          />
          <Route path="/user" element={<User />}
          />
          <Route path="/users/:userId" element={<UserAdmin />}
          />
          <Route path="/users" element={<Users />}
          />
          <Route path="/users/updateUser" element={<UpdateUser />}
          />
          <Route path="/users/updateUserAdmin/:userId" element={<UpdateUserAdmin />}
          />
          <Route path="/events" element={<Events />}
          />
          <Route path="/events/:eventId" element={<Event />}
          />
          <Route path="/events/addEvent" element={<AddEvent />}
          />
          <Route path="/events/updateEvent/:eventId" element={<UpdateEvent />}
          />
          <Route path="/activities" element={<Activities />}
          />
          <Route path="/activities/:activityId" element={<Activity />}
          />
          <Route path="/activities/addActivity" element={<AddActivity />}
          />
          <Route path="/activities/updateActivity/:activityId" element={<UpdateActivity />}
          />
          <Route path="/reserve" element={<Reserve />}
          />
          <Route path="/reserves/:reserveId" element={<ReserveAdmin />}
          />
          <Route path="/reserves" element={<Reserves />}
          />
          <Route path="/files" element={<Files />}
          />
          <Route path="/files/addFile" element={<AddFile />}
          />
          <Route path="/files/updateFile/:fileId" element={<UpdateFile />}
          />
          <Route path="/files/:fileId" element={<File />}
          />
          <Route path="/logout" element={<Logout />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

