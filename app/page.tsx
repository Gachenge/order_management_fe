'use client'
import React, { useState, useEffect } from 'react';
import OrderForm from './OrderForm/page';
import OrderLineGraph from './components/OrderLineGraph';
import PurchaseHistory from './PurchaseHistory/page';
import AllOrders from './AllOrders/page';
import OrderBarChart from './components/barchart'
import handleShowChart from './AllOrders/page'


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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://gachenge.pythonanywhere.com/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrderError('Failed to fetch orders. Please try again later.');
      } finally {
        setOrderLoading(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://gachenge.pythonanywhere.com/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }

        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        setCustomerError('Failed to fetch customers. Please try again later.');
      } finally {
        setCustomerLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const responseProducts = await fetch('https://gachenge.pythonanywhere.com/products');
        if (!responseProducts.ok) {
          throw new Error('Failed to fetch products');
        }

        const dataProducts = await responseProducts.json();
        const productNames = dataProducts.products || [];
        const formattedProducts = productNames.map((name: string, index: number) => ({
          id: index + 1,
          name,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setProductsLoading(false);
      }
    };


    fetchOrders();
    fetchCustomers();

  }, []);

  console.log(orders)

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
