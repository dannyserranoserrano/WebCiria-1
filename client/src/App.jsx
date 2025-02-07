import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import User from "./pages/Users/User/User";
import UserAdmin from "./pages/Users/User/UserAdmin";
import Users from "./pages/Users/Users";
import UpdateUser from "./pages/Users/UpdateUser/UpdateUser";
import UpdateUserAdmin from "./pages/Users/UpdateUser/UpdateUserAdmin";
import Events from "./pages/Events/Events";
import AddEvent from "./pages/Events/AddEvent/AddEvent";
import UpdateEvent from "./pages/Events/UpdateEvent/UpdateEvent";
import Event from "./pages/Events/Event/Event";
import Activities from "./pages/Activities/Activities";
import AddActivity from "./pages/Activities/AddActivity/AddActivity";
import UpdateActivity from "./pages/Activities/UpdateActivity/UpdateActivity";
import Activity from "./pages/Activities/Activity/Activity";
import Reserve from "./pages/Reserves/Reserve/Reserve";
import Reserves from "./pages/Reserves/Reserves";
import Files from "./pages/Files/Files";
import AddFile from "./pages/Files/AddFile/AddFile";
import UpdateFile from "./pages/Files/UpdateFile/UpdateFile";
import File from "./pages/Files/File/File";
import Logout from "./pages/Logout/Logout";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
          <Route path="/users/:userId" element={<UserAdmin />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/updateUser" element={<UpdateUser />} />
          <Route
            path="/users/updateUserAdmin/:userId"
            element={<UpdateUserAdmin />}
          />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<Event />} />
          <Route path="/events/addEvent" element={<AddEvent />} />
          <Route
            path="/events/updateEvent/:eventId"
            element={<UpdateEvent />}
          />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:activityId" element={<Activity />} />
          <Route path="/activities/addActivity" element={<AddActivity />} />
          <Route
            path="/activities/updateActivity/:activityId"
            element={<UpdateActivity />}
          />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/reserves" element={<Reserves />} />
          <Route path="/files" element={<Files />} />
          <Route path="/files/addFile" element={<AddFile />} />
          <Route path="/files/updateFile/:fileId" element={<UpdateFile />} />
          <Route path="/files/:fileId" element={<File />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
