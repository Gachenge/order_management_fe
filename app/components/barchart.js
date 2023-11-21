import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const OrderBarChart = ({ orders, products, customers }) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return <div>No orders data available.</div>;
    }
  
    const productLookup = {};
    const productColors = {
      1: 'red',
      2: 'blue',
      3: 'green',
    };
  
    products.forEach((product) => {
      productLookup[product.id] = {
        name: product.name,
        color: productColors[product.id] || 'rgba(0, 0, 0, 0.2)',
      };
    });
  
    const customerLookup = {};
    customers.forEach((customer) => {
      customerLookup[customer.id] = customer.email;
    });
  
    const data = {
      labels: Array.from(new Set(orders.map((order) => customerLookup[order.customer_id]))),
      datasets: products.map((product) => ({
        label: product.name,
        data: orders
          .filter((order) => order.product_id === product.id)
          .map((order) => order.quantity),
        backgroundColor: productLookup[product.id].color,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      })),
    };
  
    const options = {
      scales: {
        x: {
          type: 'category',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Customers',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Quantity',
          },
        },
      },
      maintainAspectRatio: true,
      responsive: true,
    };
  
    return (
      <div>
        <h2>Order Quantities by Customer and Product</h2>
        <Bar data={data} options={options} />
      </div>
    );
  };
  
  export default OrderBarChart;  
  