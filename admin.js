import React, { useState } from 'react';
import './admin.css';
import NavBar from './Navbar';
import SideBar from './sidebar';
import AddEmployee from './addEmployee'; 
import SalaryReport from './SalaryReport.js'; 
import LeaveRequests from './LeaveRequests.js'; 
import ImageSlider from './ImageSlider.js';

const Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleButtonClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  return (
    <main>
      <NavBar />
      <ImageSlider/>
      <div className="home-page">
        <SideBar onButtonClick={handleButtonClick} />
        <div className="content">
          <div className={`component ${selectedComponent === 'addEmployee' ? 'slide slide-in' : 'slide'}`}>
            {selectedComponent === 'addEmployee' && <AddEmployee />}
          </div>
          <div className={`component ${selectedComponent === 'viewLeaveRequest' ? 'slide slide-in' : 'slide'}`}>
            {selectedComponent === 'viewLeaveRequest' && <LeaveRequests/>}
          </div>
          <div className={`component ${selectedComponent === 'salaryReports' ? 'slide slide-in' : 'slide'}`}>
            {selectedComponent === 'salaryReports' && <SalaryReport/>}
          </div>
        </div>
      </div>
      
    </main>
  );
};

export default Admin;