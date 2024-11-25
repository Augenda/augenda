import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Home/Login';
import Dashboard from './components/Panel/Dashboard';
import {Menu} from './components/Panel/Menu';
import Workers from './components/Screens/Workers';
import Services from './components/Screens/Services';
import Pets from './components/Screens/Pets';
import Customers from './components/Screens/Customers';
import Bookings from './components/Screens/Bookings';
import AddWorker from './components/Templates/AddWorker';
import AddPet from './components/Templates/AddPet';
import AddCustomer from './components/Templates/AddCustomer';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu"  element={<Menu />} />
        <Route path="/bookings"  element={<Bookings />} />
        <Route path="/customers"  element={<Customers />} />
        <Route path="/workers"  element={<Workers />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/pets"  element={<Pets />} />
        <Route path="/addworker"  element={<AddWorker />} />
        <Route path="/addpet"  element={<AddPet />} />
        <Route path="/addcustomer"  element={<AddCustomer />} />
      </Routes>
    </Router>
  );
}

export default App;
