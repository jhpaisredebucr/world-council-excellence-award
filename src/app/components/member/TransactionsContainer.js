'use client';

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Transactions from "@/app/components/member/Transactions";

export default function TransactionsContainer({
  transactions = [],
  onRefresh,
  pagination,
  currentPage,
  onPageChange,
  onNextPage,
  onPrevPage
}) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const router = useRouter();

  const handleRefresh = () => {
    // refresh server components / re-fetch data
    router.refresh();

    // optional: still allow parent refresh if passed
    if (onRefresh) {
      onRefresh();
    }
  };

  const downloadPDF = useCallback((txns, from, to) => {
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF('portrait', 'mm', 'a4');

    const filtered = txns.filter(t => {
      const date = new Date(t.created_at);
      const f = from ? new Date(from) : new Date(0);
      const tt = to ? new Date(to) : new Date();
      return date >= f && date <= tt;
    });

    // Legal document header
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    // Company header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('WCEA', pageWidth / 2, 15, { align: 'center' });
    
    // Document title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL TRANSACTION RECORD', pageWidth / 2, 22, { align: 'center' });
    
    // Document control information
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Document No: WCEA-TXN-${Date.now().toString().slice(-6)}`, margin, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth - margin, 30, { align: 'right' });
    
    // Report period
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT PERIOD', margin, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`${from ? new Date(from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Beginning'} to ${to ? new Date(to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Present'}`, margin, 45);
    
    doc.text(`Total Transactions: ${filtered.length}`, pageWidth - margin, 45, { align: 'right' });
    
    // Formal line separator
    doc.setLineWidth(0.5);
    doc.line(margin, 52, pageWidth - margin, 52);

    // Table setup with better spacing for portrait
    const tableWidth = pageWidth - (margin * 2);
    
    // Column widths (percentage of table width) - reduced txn ID and method, increased ref no
    const colWidths = [0.15, 0.15, 0.12, 0.12, 0.15, 0.21, 0.10];
    const colX = [];
    let currentX = margin;
    
    colWidths.forEach(width => {
      colX.push(currentX);
      currentX += tableWidth * width;
    });

    let y = 60;

    // Table headers
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const headers = ['Date', 'Type', 'Amount', 'Method', 'Txn ID', 'Ref No.', 'Status'];
    
    headers.forEach((header, i) => {
      doc.text(header, colX[i], y);
    });

    // Header line
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, pageWidth - margin, y + 3);
    y += 8;

    // Table data
    doc.setFont('helvetica', 'normal');
    filtered.forEach((t, index) => {
      // Check if we need a new page
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
        
        // Repeat headers on new page
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        headers.forEach((header, i) => {
          doc.text(header, colX[i], y);
        });
        doc.line(margin, y + 3, pageWidth - margin, y + 3);
        y += 8;
        doc.setFont('helvetica', 'normal');
      }

      doc.setFontSize(8);
      
      // Format and truncate data for better portrait fit
      const dateStr = new Date(t.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      doc.text(dateStr, colX[0], y);
      
      doc.text((t.type || 'N/A').toString().slice(0, 12), colX[1], y);
      
      // Format amount with proper alignment
      const amount = `₱${(t.amount || 0).toLocaleString()}`;
      doc.text(amount, colX[2], y);
      
      doc.text((t.payment_method || 'N/A').toString().slice(0, 8), colX[3], y);
      doc.text((t.transaction_id || `TXN-${t.id || "-"}`).toString().slice(0, 15), colX[4], y);
      // Reference number with smaller font to fit full text
      const refNo = t.reference_number || 'N/A';
      doc.setFontSize(7); // Smaller font for reference number
      doc.text(refNo.toString(), colX[5], y);
      doc.setFontSize(8); // Reset to normal data font size
      
      // Status with color coding
      const status = (t.status || 'unknown').toString().slice(0, 8);
      if (t.status === 'approved') {
        doc.setTextColor(0, 128, 0); // Green for approved
      } else if (t.status === 'pending') {
        doc.setTextColor(255, 128, 0); // Orange for pending
      } else if (t.status === 'rejected') {
        doc.setTextColor(255, 0, 0); // Red for rejected
      }
      doc.text(status, colX[6], y);
      doc.setTextColor(0, 0, 0); // Reset color

      // Row separator (lighter line)
      doc.setLineWidth(0.2);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 7;
    });

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page 1 of 1`, pageWidth / 2, footerY, { align: 'center' });

    doc.save(`WCEA-Transaction-Record-${new Date().toISOString().split('T')[0]}.pdf`);
  }, []);

  return (
    <div className="py-4 sm:py-6">

      {/* TOP CONTROLS */}
      <div className="mb-6 flex justify-between">
        <div className="flex flex-wrap gap-2">

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-(--primary) text-white rounded hover:bg-(--secondary)"
          >
            Refresh
          </button>

          <input
            type="date"
            className="px-2 py-1 border rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            className="px-2 py-1 border rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => downloadPDF(transactions, fromDate, toDate)}
          >
            Download PDF
          </button>

        </div>
      </div>

      {/* TABLE */}
      <Transactions transactions={transactions} pagination={pagination} />
      
      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500 pb-6">
          <div className="flex items-center gap-2">
            <span>Page {currentPage + 1} of {Math.ceil(pagination.total / pagination.limit)}</span>
            <span className="text-gray-400">({pagination.total} total transactions)</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={onNextPage}
              disabled={!pagination.hasMore}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}