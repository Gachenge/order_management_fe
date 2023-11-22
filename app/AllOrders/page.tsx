import React, { useState, useEffect } from 'react';
import moment from 'moment';
import UpdateOrderForm from '../editOrder/page';
import { EditFormData } from '../UpdateOrderForm/page';
import OrderBarChart from '../components/barchart';

interface Order {
  created_at: string;
  customer_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

interface Customer {
  id: number;
  customer_id: number;
  email: string;
}

interface Product {
  id: number;
  product_id: number;
  name: string;
}

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderLoading, setOrderLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customersLoading, setCustomersLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [editFormDataArray, setEditFormDataArray] = useState<EditFormData[]>([]);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showChart, setShowChart] = useState(false);

  const fetchData = async () => {
    try {
      const ordersResponse = await fetch('https://gachenge.pythonanywhere.com/orders');
      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders');
      }

      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders?.orders || ordersData.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setOrderLoading(false);
    }
  };

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

        setCustomers(mappedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customers. Please try again later.');
      } finally {
        setCustomersLoading(false);
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
      } finally {
        setProductsLoading(false);
        setLoading(false);
      }
    };

    fetchCustomers();
    fetchProducts();
    fetchData();
  }, []);

  const handleEditClick = (orderId: number) => {
    const orderToEdit: Order | undefined = orders.find((order) => order.order_id === orderId);

    if (orderToEdit) {
      const { customer_id, product_id, quantity } = orderToEdit;
      const editFormDataItem: EditFormData = {
        customer_email: customers.find((customer) => customer.id === customer_id)?.email || '',
        product_name: products.find((product) => product.id === product_id)?.name || '',
        quantity,
      };

      setEditFormDataArray((prevEditFormDataArray: EditFormData[]) => [...prevEditFormDataArray, editFormDataItem]);
    }

    setIsEditing(true);
    setEditingOrderId(orderId);
  };

  const EditRow: React.FC<{ isEditing: boolean; order: Order; editFormData?: EditFormData }> = ({ isEditing, order, editFormData = {} }) => {
    return (
      <>
        {isEditing ? (
          <div>
            <button
              type="button"
              onClick={() =>
                handleUpdateOrderWrapper({
                  ...editFormData,
                  order_id: order.order_id,
                  customer_email: editFormData.customer_email,
                  product_name: editFormData.product_name,
                  quantity: editFormData.quantity,
                })
              }
            >
              Update Order
            </button>

            <UpdateOrderForm
              orderId={order.order_id}
              onUpdate={(updatedData: EditFormData) => handleUpdateOrderWrapper(order.order_id, updatedData)}
              editFormData={editingOrderId === order.order_id ? editFormDataArray.find((data) => data.order_id === order.order_id) || {} : undefined}
            />
          </div>
        ) : (
          <button type="button" onClick={() => handleEditClick(order.order_id)}>
            Edit
          </button>
        )}
      </>
    );
  };

  const handleShowChart = () => {
    setShowChart(true);
  };

  const handleUpdateOrderWrapper = async (updatedFormData: EditFormData, orderId: number): Promise<void> => {
    try {
      setUpdateLoading(true);

      const response = await fetch(`https://gachenge.pythonanywhere.com/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update order: ${response.status} - ${errorText}`);
      }

      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      setUpdateError(error.message || 'Failed to update order. Please try again later.');
    } finally {
      setUpdateLoading(false);
      setEditingOrderId(null);
    }
  };

  const handleDeleteClick = async (orderId: number) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this order?');

    if (shouldDelete) {
      try {
        const response = await fetch(`https://gachenge.pythonanywhere.com/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete order: ${response.statusText}`);
        }

        fetchData();
      } catch (error) {
        console.error('Error deleting order:', error);
        setError('Failed to delete order. Please try again later.');
      }
    }
  };

  const sortedOrders = [...orders].sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>All Orders</h2>
      <button type="button" onClick={handleShowChart}>
        Show Chart
      </button>

      {showChart && <OrderBarChart orders={orders} products={products} customers={customers} />}

      {loading || customersLoading || productsLoading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Created At</th>
              <th>Customer Email</th>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{moment(order.created_at).format('LLL')}</td>
                <td>{customers.find((customer) => customer.id === order.customer_id)?.email || 'Unknown Customer'}</td>
                <td>{order.order_id}</td>
                <td>{products.find((product) => product.id === order.product_id)?.name || 'Unknown Product'}</td>
                <td>{order.quantity}</td>
                <td>
                  {isEditing && editingOrderId === order.order_id ? (
                    <EditRow isEditing={true} order={order} />
                  ) : (
                    <button type="button" onClick={() => handleEditClick(order.order_id)}>
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  <button type="button" onClick={() => handleDeleteClick(order.order_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllOrders;
