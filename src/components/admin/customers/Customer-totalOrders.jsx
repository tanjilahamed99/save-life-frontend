"use client";

import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";

const CustomerTotalOrders = ({ email, type }) => {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Fetch customer orders
        const customerOrders = await axiosInstance.get(
          `/orders/customer/${email}`
        );
        setOrders(customerOrders?.data?.data || []);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
      }
    };

    fetchCustomerData();
  }, [email]);
  
  return (
    <>
      {type === "orders" ? (
        <>{orders?.length}</>
      ) : (
        <>
          € 
          {orders?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0)?.toFixed(2)}
        </>
      )}
    </>
  );
};

export default CustomerTotalOrders;
