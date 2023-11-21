'use client'
import React, { useState, useEffect } from 'react';

interface Customer {
  id: number;
  email: string;
}

interface Product {
  id: number;
  name: string;
}

const OrderForm: React.FC = () => {
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('https://gachenge.pythonanywhere.com/customers').then((response) => response.json()),
      fetch('https://gachenge.pythonanywhere.com/products').then((response) => response.json()),
    ])
      .then(([customersData, productsData]) => {
        console.log('Customers data:', customersData);
        console.log('Products data:', productsData);
  
        const customersArray = customersData.customers;
  
        const mappedCustomers = customersArray.map((email: string, index: number) => ({
          id: index + 1,
          email,
        }));
  
        const mappedProducts = productsData.products.map((name: string, index: number) => ({
          id: index + 1,
          name,
        }));
  
        setCustomers(mappedCustomers);
        setProducts(mappedProducts);
        setProductId(mappedProducts[0]?.id || '');
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => setLoading(false));
  }, []);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!customerEmail || !productId || !quantity) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const selectedCustomer = customers.find((customer) => customer.email === customerEmail);

      const response = await fetch('https://gachenge.pythonanywhere.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: selectedCustomer?.id,
          product_id: productId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create the order. Please try again.');
      }

      setSuccessMessage('Order created successfully!');
      setErrorMessage(null);

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
      setSuccessMessage(null);
    }
  };  

  return (
    <div style={{ flex: 1, textAlign: 'left' }}>
      <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Make Order</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Customer Name:
            <select
              id="customerEmail"
              name="customerEmail"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            >
              <option key="" value="">
                Select a customer
              </option>
              {Array.isArray(customers) &&
                customers.map((customer) => (
                  <option key={customer.id} value={customer.email}>
                    {customer.email}
                  </option>
                ))}
            </select>
          </label>
          <br />
  
          <label>
            Product:
            <select
              id="productId"
              name="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option key="" value="">
                Select a product
              </option>
              {Array.isArray(products) &&
                products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </label>
          <br />
  
          <label>
            Quantity:
            <input
              id="quantityId"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <br />
  
          <button type="submit">Create Order</button>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
    )}
  </div>
  );
};

export default OrderForm;
