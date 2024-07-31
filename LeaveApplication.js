// src/components/Employee/LeaveApplication.js
import React, { useState, useContext } from 'react';
import emailjs from 'emailjs-com';
import './leave.css';
import { LeaveRequestContext } from '../LeaveRequestContext';

const LeaveApplication = () => {
  const { addLeaveRequest } = useContext(LeaveRequestContext);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: '',
    reason: '',
  });

  const [leaveData, setLeaveData] = useState([]);
  const [remainingLeaves, setRemainingLeaves] = useState({
    sick: 10,
    casual: 10,
  });
  const totalLeaves = {
    sick: 10,
    casual: 10,
  };
  const [showMore, setShowMore] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const leaveDays = calculateLeaveDays(formData.startDate, formData.endDate);
    if (leaveDays <= 0) {
      alert("Invalid leave period");
      return;
    }

    addLeaveRequest({ ...formData, status: 'Pending' });
    setLeaveData([...leaveData, { ...formData, leaveDays, status: 'Pending' }]);

    if (formData.leaveType === 'sick') {
      setRemainingLeaves((prevLeaves) => ({
        ...prevLeaves,
        sick: prevLeaves.sick - leaveDays,
      }));
    } else if (formData.leaveType === 'casual') {
      setRemainingLeaves((prevLeaves) => ({
        ...prevLeaves,
        casual: prevLeaves.casual - leaveDays,
      }));
    }
    const emailParams = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      leaveType: formData.leaveType,
      reason: formData.reason,
      leaveDays,
    };

    try {
      const response = await emailjs.send('service_dcvi1ze', 'template_zmk7nic', emailParams, 'M1e-o7dm-0Y4Tivrc');
      alert('Leave request sent to manager.');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send leave request email.');
    }

    setFormData({
      startDate: '',
      endDate: '',
      leaveType: '',
      reason: '',
    });
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1;
  };

  return (
    <div className="leave-application">
      <div className="leave-form-container">
        <h2>Leave Application</h2>
        <form className="leave-form" onSubmit={handleSubmit}>
          <label>
            Type of leave
            <select name="leaveType" value={formData.leaveType} onChange={handleInputChange}>
              <option value="" disabled>Select leave type</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
            </select>
          </label>
          <label>
            Leave from date
            <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
          </label>
          <label>
            Leave to date
            <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
          </label>
          <label>
            Reason of leave
            <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} />
          </label>
          <button type="submit" className="apply-leave-button">Apply Leave</button>
        </form>
      </div>
      <div className="leave-info-container">
        <div className="remaining-leaves">
          <h2>Your Overview</h2>
          <div className="leave-overview">
            <div className="leave-entitlement">
              <h3>Total Leaves</h3>
              <p className="leave-days">{totalLeaves.sick + totalLeaves.casual}</p>
            </div>
            <div className="leave-entitlement">
              <h3>Remaining Leaves</h3>
              <p className="leave-days">{remainingLeaves.sick + remainingLeaves.casual}</p>
            </div>
          </div>
          <button className="view-more-btn" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'View Less' : 'View More'}
          </button>
        </div>
        {showMore && (
          <div className="leave-availability">
            <h2>Leave Availability</h2>
            <div className="leave-types">
              <div className="leave-type">
                <h3>Sick Leaves</h3>
                <p className="leave-total">Total: {totalLeaves.sick}</p>
                <p className="leave-remaining">Remaining: {remainingLeaves.sick}</p>
              </div>
              <div className="leave-type">
                <h3>Casual Leaves</h3>
                <p className="leave-total">Total: {totalLeaves.casual}</p>
                <p className="leave-remaining">Remaining: {remainingLeaves.casual}</p>
              </div>
            </div>
          </div>
        )}
        <div className="leave-info">
          <h2>Leave Information</h2>
          <table>
            <thead>
              <tr>
                <th>Type of leave</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.leaveType}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;
