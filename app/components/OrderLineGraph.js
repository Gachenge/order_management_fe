import React from "react";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Chart } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderLineGraph = ({ orders }) => {
  if (!orders || !orders.orders || !Array.isArray(orders.orders) || orders.orders.length === 0) {
    return <div>No orders data available.</div>;
  }

  const labels = orders.orders.map((order) => {
    const date = moment(order.created_at);
    return `${date.format('ddd, DD MMM YYYY')} ${date.format('HH:mm')}`;
  });

  const quantities = orders.orders.map((order) => order.quantity);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Order Quantities',
        data: quantities,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          //parser: 'DD/MM/YYYY',
          tooltipFormat: 'll HH:mm',
        },
        scaleLabel: {
          display: true,
          labelString: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        scaleLabel: {
          display: true,
          labelString: 'Quantity',
        },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
  };  

  return (
    <div>
      <h2>Order Quantities Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default OrderLineGraph;
