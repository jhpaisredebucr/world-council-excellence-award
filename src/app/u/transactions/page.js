'use client';

import { useEffect, useState } from "react";
import TransactionsContainer from "@/app/components/member/TransactionsContainer";

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 20;

  const fetchTransactions = async (page = currentPage) => {
    try {
      setLoading(true);
      const offset = page * limit;
      
      const res = await fetch(`/api/transaction?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      
      if (data.success) {
        setTransactions(data.transactions || []);
        setPagination(data.pagination || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchTransactions(newPage);
  };

  const handleNextPage = () => {
    if (pagination?.hasMore) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchTransactions(0);
  }, []);

  if (loading && transactions.length === 0) {
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
      <TransactionsContainer
        transactions={transactions}
        onRefresh={() => fetchTransactions(currentPage)}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
}