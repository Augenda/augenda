import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Home/Login';
import Dashboard from './components/Panel/Dashboard';
import {Menu} from './components/Panel/Menu';
import Workers from './components/Screens/Workers';
import Services from './components/Screens/Services';
import Pets from './components/Screens/Pets';
import Customers from './components/Screens/Customers';
import Appointments from './components/Screens/Appointments';
import AddWorker from './components/Templates/AddWorker';
import AddPet from './components/Templates/AddPet';
import AddCustomer from './components/Templates/AddCustomer';
import AddService from './components/Templates/AddService';
import AddAppointment from './components/Templates/AddAppointment';
import SearchWorkers from './components/Templates/SearchWorkers';
import SearchCustomers from './components/Templates/SearchCustomers';
import SearchPets from './components/Templates/SearchPets';
import SearchAppointments from './components/Templates/SearchAppointments';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu"  element={<Menu />} />
        <Route path="/appointments"  element={<Appointments />} />
        <Route path="/customers"  element={<Customers />} />
        <Route path="/workers"  element={<Workers />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/pets"  element={<Pets />} />
        <Route path="/addworker"  element={<AddWorker />} />
        <Route path="/addpet"  element={<AddPet />} />
        <Route path="/addcustomer"  element={<AddCustomer />} />
        <Route path="/addservice"  element={<AddService />} />
        <Route path="/addappointment"  element={<AddAppointment />} />
        <Route path="/searchcustomers"  element={<SearchCustomers />} />
        <Route path="/searchpets"  element={<SearchPets />} />
        <Route path="/searchappointments"  element={<SearchAppointments />} />
      </Routes>
    </Router>
  );
}

export default App;
