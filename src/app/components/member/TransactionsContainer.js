'use client';

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Transactions from "@/app/components/member/Transactions";

export default function TransactionsContainer({
  transactions = [],
  onRefresh
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
    const doc = new jsPDF();

    const filtered = txns.filter(t => {
      const date = new Date(t.created_at);
      const f = from ? new Date(from) : new Date(0);
      const tt = to ? new Date(to) : new Date();
      return date >= f && date <= tt;
    });

    doc.setFontSize(20);
    doc.text('Transaction History', 20, 20);

    doc.setFontSize(12);
    doc.text(`Period: ${from || 'All time'} to ${to || 'All time'}`, 20, 35);
    doc.text(`${filtered.length} transactions`, 20, 45);

    let y = 60;
    const colX = [10, 30, 50, 75, 102, 132, 165];

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    ['Date', 'Type', 'Amount', 'Method', 'Txn ID', 'Ref No', 'Status'].forEach((h, i) => {
      doc.text(h, colX[i], y);
    });

    doc.setFont(undefined, 'normal');
    doc.line(20, y + 2, 190, y + 2);
    y += 8;

    filtered.forEach(t => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(9);
      doc.text(new Date(t.created_at).toLocaleDateString(), colX[0], y);
      doc.text(t.type || 'N/A', colX[1], y);
      doc.text(`₱${t.amount || 0}`, colX[2], y);
      doc.text(t.payment_method || 'N/A', colX[3], y);
      doc.text((t.transaction_id || `TXN-${t.id || "-"}`).toString().slice(0, 12), colX[4], y);
      doc.text((t.reference_number || 'N/A').toString().slice(0, 10), colX[5], y);
      doc.text(t.status || 'unknown', colX[6], y);

      doc.line(20, y + 2, 190, y + 2);
      y += 6;
    });

    doc.save('transactions.pdf');
  }, []);

  return (
    <div className="py-4 sm:py-6">

      {/* TOP CONTROLS */}
      <div className="mb-6 flex justify-between">
        <div className="flex flex-wrap gap-2">

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      <Transactions transactions={transactions} />
    </div>
  );
}