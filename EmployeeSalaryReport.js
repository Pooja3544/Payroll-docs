import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../assets/image (2).png';
import './EmployeeSalaryReport.css';

const EmployeeSalaryReport = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [month, setMonth] = useState('');
  const [salary, setSalary] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [showPreview, setShowPreview] = useState(false); 

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Salary Report Added:', { employeeName, month, salary });

    const doc = new jsPDF('p', 'mm', 'a4');

    const logoWidth = 35;
    const logoHeight = 40;
    doc.addImage(logo, 'JPEG', 5, 3, logoWidth, logoHeight);

    // Add company details
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Syliqon Software', 40, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Bhive workspace, Kuvempu nagara TTMC bus stop', 40, 27);
    doc.text('Bangalore, 560076 India', 40, 33);

    // Add "Payslip For the Month" and details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Payslip For the Month', 153, 28);
    doc.setFontSize(14);

    // Format the month to "Month YYYY"
    doc.setFont('helvetica', 'bold');
    const formattedMonth = new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' });
    doc.text(formattedMonth, 174, 34, { align: 'center' });

    // Draw a line below the logo and text
    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);

    // Employee summary labels and values
    doc.setFontSize(14);
    const labels = ['Employee Name', 'Employee ID', 'Pay Date', 'Paid Days', 'LOP Days'];
    const values = [employeeName, 'EMP 0092', '15/04/2024', '31', '0'];

    // Calculate the maximum width of the labels to align colons
    let maxLabelWidth = 0;
    labels.forEach(label => {
      const labelWidth = doc.getTextWidth(label);
      if (labelWidth > maxLabelWidth) {
        maxLabelWidth = labelWidth;
      }
    });

    // Set the initial positions
    const startX = 20;
    let startY = 75;
    const lineHeight = 10;
    const colonOffset = 2;

    // Add the labels, colons, and values
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLOYEE SUMMARY', startX, startY - lineHeight);
    doc.setFont('helvetica', 'normal');

    labels.forEach((label, index) => {
      const value = values[index];
      const labelX = startX;
      const colonX = startX + maxLabelWidth + colonOffset;
      const valueX = colonX + colonOffset;

      doc.text(label, labelX, startY);
      doc.text(':', colonX, startY);
      doc.text(value, valueX, startY);

      startY += lineHeight;
    });

    // Add a box with light green background for net payable amount
    const netPayableBoxTopY = 55;
    doc.setFillColor(224, 255, 224); // Light green color
    doc.rect(130, netPayableBoxTopY, 60, 20, 'F'); // Adjust the position and size as needed

    // Calculate net payable amount
    const userEnteredSalary = parseFloat(salary) || 0;
    const deductions = 2700.00; // Assuming static deductions for now
    const netPayable = userEnteredSalary - deductions;

   
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const netPayableText = `${netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const netPayableTextWidth = doc.getTextWidth(netPayableText);
    doc.text(netPayableText, 160 - netPayableTextWidth / 2, netPayableBoxTopY + 15);

    doc.autoTable({
      startY: 145,
      head: [['EARNINGS', 'AMOUNT', 'DEDUCTIONS', 'AMOUNT']],
      body: [
        ['Basic', '28,000.00', 'Income Tax', '0.00'],
        ['House Rent Allowance', '8,000.00', 'Provident Fund', '2,700.00'],
        ['Gross Earnings', '36,000.00', 'Total Deductions:', '2,700.00'],
      ],
      theme: 'grid',
      styles: {
        font: 'helvetica',
        halign: 'center',
        fillColor: [224, 255, 224],
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 10,
      },
      columnStyles: {
        0: { halign: 'left' },
        2: { halign: 'left' },
        1: { halign: '50' },
        3: { halign: '50' },
      },
    });

    const boxTopY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(224, 255, 224);
    doc.rect(16, boxTopY, 180, 20, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL NET PAYABLE', 26, boxTopY + 8);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Gross Earnings - Total Deductions', 26, boxTopY + 14);

    // Set total net payable amount to the right side with big and bold font
    const totalNetPayable = netPayable; 
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const totalNetPayableText = `${totalNetPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const totalNetPayableTextWidth = doc.getTextWidth(totalNetPayableText);
    doc.text(totalNetPayableText, 190 - totalNetPayableTextWidth, boxTopY + 13);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(': Amount In Words Indian Rupee Thirty-Three Thousand Three Hundred Only', 20, boxTopY + 25);

    doc.text('-- This is a system-generated document. --', 105, 280, { align: 'center' });

    const generatedPdfData = doc.output('blob');
    setPdfData(generatedPdfData);

   
    setShowPreview(true);
  };

  const handleDownload = () => {
    if (!pdfData) return;

    const url = URL.createObjectURL(pdfData);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary_slip.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setPdfData(null);
    setShowPreview(false); // Hide preview after download
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    const currentDate = new Date();
    const selectedDate = new Date(selectedMonth);
    if (selectedDate > currentDate) {
      alert('Please select a month from the past or the current month.');
    } else {
      setMonth(selectedMonth);
    }
  };

  
  const isSubmitDisabled = !employeeName || !month || !salary;

  

  return (
    <div className="pay-slip-container">
      <h2 className='h0'>Salary Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <input
            type="text"
            id="employeeName"
            className="pay-slip-input"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />
          <label htmlFor="employeeName" className="pay-slip-label">Employee Name</label>
        </div>
        <div className="form-section">
          <input
            type="month"
            id="month"
            className="pay-slip-input"
            value={month}
            onChange={handleMonthChange}
            required
          />
          <label htmlFor="month" className="pay-slip-label">Month</label>
        </div>
        <div className="form-section">
          <input
            type="number"
            id="salary"
            className="pay-slip-input"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
          <label htmlFor="salary" className="pay-slip-label">Salary</label>
        </div>
        <button className='submit-btn' type="submit" disabled={isSubmitDisabled}>Submit Report</button>
      </form>


      
      {pdfData && (
      <div className={`pdf-container slide-effect ${showPreview ? 'slide-active' : ''}`}>
        <div className="pdf-preview">
          <embed src={URL.createObjectURL(pdfData)} type="application/pdf" className='pdf-content' width="100%" height="450px" />
          <button className="download-btn" onClick={handleDownload}>Download PDF</button>
        </div>
      </div>
    )}
  </div>
);
};

export default EmployeeSalaryReport;
