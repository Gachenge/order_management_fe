'use client'
import React, { useState, useEffect } from 'react';
import OrderForm from './OrderForm/page';
import OrderLineGraph from './components/OrderLineGraph';
import PurchaseHistory from './PurchaseHistory/page';
import AllOrders from './AllOrders/page';
import OrderBarChart from './components/barchart';

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [customers, setCustomers] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false); // Move this line inside the component

  useEffect(() => {
    const fetchOrders = async () => {
      // ... (existing fetchOrders code)
    };

    const fetchCustomers = async () => {
      // ... (existing fetchCustomers code)
    };

    const fetchProducts = async () => {
      // ... (existing fetchProducts code)
    };

    fetchOrders();
    fetchCustomers();
    fetchProducts();

  }, []);

  const handleShowChart = () => {
    setShowChart(true);
  };

  return (
    <main>
      <header>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Order Management</h1>
      </header>
      <br />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, textAlign: 'left' }}>
          {orderLoading ? (
            <p>Loading Order Form...</p>
          ) : (
            <OrderForm />
          )}
          {orderError && <p style={{ color: 'red' }}>{orderError}</p>}
          {showAllOrders && <OrderBarChart orders={orders} products={products} customers={customers} />}
          {showAllOrders && (
            <button type="button" onClick={handleShowChart}>
              Show Chart
            </button>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <button onClick={() => setShowAllOrders(!showAllOrders)}>Orders</button>
        </div>
        <div style={{ flex: 1, textAlign: 'right', marginRight: 20 }}>
          {customerLoading ? (
            <p>Loading Purchase History...</p>
          ) : (
            showAllOrders ? <AllOrders /> : <PurchaseHistory customers={customers} />
          )}
          {customerError && <p style={{ color: 'red' }}>{customerError}</p>}
        </div>
      </div>
      <br />
      <div>
        {orderLoading ? (
          <p>Loading Order Line Graph...</p>
        ) : (
          <OrderLineGraph orders={orders} />
        )}
      </div>
    </main>
  );
}
