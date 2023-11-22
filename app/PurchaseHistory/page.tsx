import React, { useState, useEffect } from 'react';
import moment from 'moment';

interface Order {
  product_name: string;
  order_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
}

interface Customer {
  id: number,
  customer_id: number;
  email: string;
}

interface Product {
  id: number,
  product_id: number;
  name: string;
}

interface PurchaseHistoryProps {
  customers: Customer[];
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ customers }) => {
  const [purchaseHistory, setPurchaseHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
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
  
        setLocalCustomers(mappedCustomers);
      } catch (error) {
        setError('Failed to fetch customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const responseProducts = await fetch('https://gachenge.pythonanywhere.com/products');
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

    fetchCustomers();
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        if (!selectedCustomer) {
          setPurchaseHistory([]);
          return;
        }

        const response = await fetch(`https://gachenge.pythonanywhere.com/customers/${selectedCustomer}/purchase-history`);
        console.log('Backend response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch purchase history');
        }

        const data = await response.json();
        setPurchaseHistory(data.purchase_history || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [selectedCustomer]);

  return (
    <div>
      <h2>Purchase History</h2>
      <label>
        Select a customer:
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select a customer</option>
          {Array.isArray(localCustomers) &&
            localCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.email}
              </option>
            ))}
        </select>
      </label>

      {loading ? (
        <p>Loading purchase history...</p>
      ) : (
        <div>
          {error ? (
            <p>Error: {error}</p>
          ) : purchaseHistory.length === 0 ? (
            <p>No purchase history available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Ordered on</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory
                  .slice()
                  .sort((a, b) => b.quantity - a.quantity)
                  .map((order) => (
                    <tr key={order.order_id}>
                      <td>
                        {order.product_name ? order.product_name : 'Unknown Product'}
                      </td>
                      <td>{order.quantity}</td>
                      <td>{moment(order.created_at).format('LLL')}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
