
// src/components/LeaveRequestContext.js
import React, { createContext, useState } from 'react';

export const LeaveRequestContext = createContext();

export const LeaveRequestProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const addLeaveRequest = (request) => {
    setLeaveRequests([...leaveRequests, { ...request, status: 'Pending', id: leaveRequests.length + 1 }]);
  };

  const updateLeaveStatus = (id, status) => {
    setLeaveRequests(leaveRequests.map(request =>
      request.id === id ? { ...request, status } : request
    ));
  };

  return (
    <LeaveRequestContext.Provider value={{ leaveRequests, addLeaveRequest, updateLeaveStatus }}>
      {children}
    </LeaveRequestContext.Provider>
  );
};
