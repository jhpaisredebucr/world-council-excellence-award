'use client';

import { useEffect, useState } from "react";
import Transactions from "@/app/components/member/Transactions";



export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');



  const fetchTransactions = async () => {
    try {
      // TRANSACTION
      const resTx = await fetch("/api/transaction");
      const txData = await resTx.json();
      setTransactions(txData.transactions || []);

      // USER DATA
      const resUser = await fetch("/api/users");
      const userDataRes = await resUser.json();
      setUserData(userDataRes.success ? userDataRes : null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async (from, to) => {
    try {
      // Fetch all transactions from the new API endpoint
      const res = await fetch("/api/transaction/all");
      const data = await res.json();
      
      if (!data.success) {
        console.error('Failed to fetch transactions:', data.message);
        return;
      }

      const allTransactions = data.transactions || [];
      
      // Filter by date range
      const filtered = allTransactions.filter(t => {
        const date = new Date(t.created_at);
        const f = from ? new Date(from) : new Date(0);
        const tt = to ? new Date(to) : new Date();
        return date >= f && date <= tt;
      });

      // CSV headers
      const headers = ['ID', 'User ID', 'Date', 'Type', 'Amount', 'Payment Method', 'Reference Number', 'Status'];
      
      // Convert transactions to CSV rows
      const csvRows = [
        headers.join(','),
        ...filtered.map(t => [
          t.id || '',
          t.user_id || '',
          new Date(t.created_at).toLocaleDateString(),
          t.type || 'N/A',
          t.amount || 0,
          t.payment_method || 'N/A',
          t.reference_number || 'N/A',
          t.status || 'unknown'
        ].map(field => `"${field}"`).join(','))
      ];

      const csvContent = csvRows.join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin-transactions-${from || 'all'}-to-${to || 'all'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading CSV:', err);
    }
  };

  const downloadPDF = (txns, from, to) => {
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();
    let y = 55;
    
    const filtered = txns.filter(t => {
      const date = new Date(t.created_at);
      const f = from ? new Date(from) : new Date(0);
      const tt = to ? new Date(to) : new Date();
      return date >= f && date <= tt;
    });

    doc.setFontSize(20);
    doc.text('Admin Transaction History', 20, 20);
    doc.setFontSize(12);
    doc.text(`Period: ${from || 'All time'} to ${to || 'All time'}`, 20, 35);
    doc.text(`${filtered.length} transactions`, 20, 45);

    // Table with lines
    const tableHeaders = ['Date', 'Type', 'Amount', 'Method', 'Status'];
    const colX = [20, 50, 80, 110, 140];
    const colWidths = [30, 30, 30, 30, 50];
    const tableWidth = 170;
    
    // Header line
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    tableHeaders.forEach((header, i) => {
      doc.text(header, colX[i], y);
    });
    doc.setFont(undefined, 'normal');
    
    // Draw header bottom border
    doc.setLineWidth(0.5);
    doc.line(20, y+2, 20 + tableWidth, y+2);
    
    // Draw vertical lines for columns
    doc.setLineWidth(0.3);
    for (let i = 0; i <= colX.length; i++) {
      const x = i === 0 ? 20 : (i === colX.length ? 20 + tableWidth : colX[i]);
      doc.line(x, y-5, x, y+2);
    }
    
    y += 8;

    filtered.forEach(t => {
      if (y > 280) {
        doc.addPage();
        y = 20;
        // Redraw header on new page
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        tableHeaders.forEach((header, i) => {
          doc.text(header, colX[i], y);
        });
        doc.setFont(undefined, 'normal');
        doc.setLineWidth(0.5);
        doc.line(20, y+2, 20 + tableWidth, y+2);
        doc.setLineWidth(0.3);
        for (let i = 0; i <= colX.length; i++) {
          const x = i === 0 ? 20 : (i === colX.length ? 20 + tableWidth : colX[i]);
          doc.line(x, y-5, x, y+2);
        }
        y += 8;
      }
      
      doc.setFontSize(9);
      // Truncate text if too long
      const date = new Date(t.created_at).toLocaleDateString();
      const type = (t.type || 'N/A').substring(0, 8);
      const amount = `₱${t.amount || 0}`;
      const method = (t.payment_method || 'N/A').substring(0, 8);
      const status = (t.status || 'unknown').substring(0, 10);
      
      doc.text(date, colX[0], y);
      doc.text(type, colX[1], y);
      doc.text(amount, colX[2], y);
      doc.text(method, colX[3], y);
      doc.text(status, colX[4], y);
      
      // Row lines
      doc.setLineWidth(0.2);
      doc.line(20, y+2, 20 + tableWidth, y+2);
      
      // Vertical lines for each row
      doc.setLineWidth(0.1);
      for (let i = 0; i <= colX.length; i++) {
        const x = i === 0 ? 20 : (i === colX.length ? 20 + tableWidth : colX[i]);
        doc.line(x, y-3, x, y+2);
      }
      
      y += 6;
    });

    doc.save('admin-transactions.pdf');
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

if (loading) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-dashed"></div>
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    </div>
  );
}

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-bold">
                    All Transactions
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={fetchTransactions}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                  >
                    Refresh
                  </button>

                  <input type="date" className="px-2 py-1 border rounded" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  <input type="date" className="px-2 py-1 border rounded" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                  <button 
                    className="px-4 py-2 bg-(--primary) text-white rounded hover:bg-(--secondary)"
                    onClick={() => downloadCSV(fromDate, toDate)}
                  >
                    Download CSV
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => downloadPDF(transactions, fromDate, toDate)}
                  >
                    Download PDF
                  </button>
                </div>
            </div>
            <Transactions transactions={transactions} userData={userData} onRefresh={fetchTransactions} />
        </div>
    )
}