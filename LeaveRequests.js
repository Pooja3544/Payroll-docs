import React, { useState, useEffect , useContext } from 'react';
import './LeaveRequests.css'; 
import { LeaveRequestContext } from './LeaveRequestContext';
import axios from 'axios';

const LeaveRequests = () => {
  const { leaveRequests, updateLeaveStatus } = useContext(LeaveRequestContext);
  const [fetchedRequests, setFetchedRequests] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API or backend
    const requests = [
      { id: 1, employeeName: 'John Doe', leaveType: 'Sick Leave', startDate: '2024-07-01', endDate: '2024-07-05', reason: 'Flu', status: 'Pending' },
      { id: 2, employeeName: 'Jane Smith', leaveType: 'Annual Leave', startDate: '2024-07-10', endDate: '2024-07-20', reason: 'Vacation', status: 'Pending' },
      { id: 3, employeeName: 'Alice Johnson', leaveType: 'Casual Leave', startDate: '2024-07-15', endDate: '2024-07-16', reason: 'Personal', status: 'Pending' },
      { id: 4, employeeName: 'Bob Brown', leaveType: 'Sick Leave', startDate: '2024-07-18', endDate: '2024-07-20', reason: 'Back Pain', status: 'Pending' },
      { id: 5, employeeName: 'Chris Green', leaveType: 'Annual Leave', startDate: '2024-07-25', endDate: '2024-08-05', reason: 'Travel', status: 'Pending' },
    ];
    setFetchedRequests(requests);
  }, []);

  useEffect(() => {
    setFetchedRequests(leaveRequests);
  }, [leaveRequests]);

  const handleAccept = async (id) => {
    const request = fetchedRequests.find(req => req.id === id);
    if (request) {
      updateLeaveStatus(id, 'Accepted');

      try {
        await axios.post('http://localhost:3001/accept-leave', request);
        alert('Leave request accepted and email sent.');
      } catch (error) {
        console.error('Error sending acceptance email:', error);
        alert('Failed to send acceptance email.');
      }
    }
  };

  const handleReject = async (id) => {
    const request = fetchedRequests.find(req => req.id === id);
    if (request) {
      updateLeaveStatus(id, 'Rejected');
      try {
        await axios.post('http://localhost:3001/reject-leave', request);
        alert('Leave request rejected and email sent.');
      } catch (error) {
        console.error('Error sending rejection email:', error);
        alert('Failed to send rejection email.');
      }
    }
  };

  return (
    <div className="leave-requests-container">
      <h2>Leave Requests</h2>
      <ul className="leave-requests-list">
        {fetchedRequests.map(request => (
          <li key={request.id} className="leave-request-item">
            <h3>{request.employeeName}</h3>
            <p>Leave Type: {request.leaveType}</p>
            <p>Start Date: {request.startDate}</p>
            <p>End Date: {request.endDate}</p>
            <p>Reason: {request.reason}</p>
            <p>Status: {request.status}</p>
            <div className="button-group1">
              <button className="accept-button" onClick={() => handleAccept(request.id)}>Accept</button>
              <button className="reject-button" onClick={() => handleReject(request.id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequests;
