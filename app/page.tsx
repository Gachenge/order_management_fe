'use client'
import React, { useState, useEffect } from 'react';
import OrderForm from './OrderForm/page';
import OrderLineGraph from './components/OrderLineGraph';
import PurchaseHistory from './PurchaseHistory/page';
import AllOrders from './AllOrders/page';
// import OrderBarChart from './components/barchart'
// import handleShowChart from './AllOrders/page'

interface Customer {
  id: number;
  customer_id: number,
  email: string;
}

interface Product {
  id: number;
  product_id: number,
  name: string;
}

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
  
        const responseData = await response.json();
  
        if (!Array.isArray(responseData.data)) {
          throw new Error('Unexpected format: data is not an array');
        }
  
        const mappedCustomers = responseData.data.map((customer: Customer) => ({
          id: customer.customer_id,
          email: customer.email,
        }));
  
        setCustomers(mappedCustomers);
      } catch (error) {
        setCustomerError('Failed to fetch customers. Please try again later.');
      } finally {
        setCustomerLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const responseProducts = await fetch('https://gachenge.pythonanywhere.com/products');
        console.log(responseProducts)
        if (!responseProducts.ok) {
          throw new Error('Failed to fetch products');
        }

        const dataProducts = await responseProducts.json();
        if (!Array.isArray(dataProducts.data)) {
          throw new Error('Unexpected format: data is not an array');
        }
        const mappedProducts = dataProducts.data.map((product: Product) => ({
          id: product.product_id,
          name: product.name,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      }
    };


    fetchOrders();
    fetchCustomers();

  }, []);


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
