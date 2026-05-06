'use client';

import { useEffect, useState } from "react";
import OrdersMember from "@/app/components/member/MyOrders";

export default function Page() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 20;

  const fetchOrders = async (page = currentPage) => {
    try {
      setLoading(true);
      const offset = page * limit;
      
      console.log(`Fetching orders with limit=${limit}, offset=${offset}`);
      const res = await fetch(`/api/portal/member/orders?limit=${limit}&offset=${offset}`);
      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setOrders(data.orders || []);
        setPagination(data.pagination || null);
        console.log('Orders loaded successfully:', data.orders?.length || 0);
      } else {
        console.error('API returned error:', data.message);
        setOrders([]);
        setPagination(null);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchOrders(newPage);
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
    fetchOrders(0);
    fetchProducts();
  }, []);

  if (loading && orders.length === 0) {
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
      <OrdersMember 
        orders={orders} 
        products={products}
        onRefresh={() => fetchOrders(currentPage)}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
}