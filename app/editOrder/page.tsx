import React, { useState, ChangeEvent, useEffect } from 'react';
import { EditFormData, UpdateOrderFormProps } from '../UpdateOrderForm/page';

const UpdateOrderForm: React.FC<UpdateOrderFormProps> = ({ orderId, onUpdate, editFormData }) => {
  const [formData, setFormData] = useState<EditFormData>({
    customer_email: '',
    product_name: '',
    quantity: 0,
  });

  useEffect(() => {
    if (editFormData) {
      setFormData(editFormData);
    }
  }, [editFormData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData, orderId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="customer_email">
        Customer Email:
        <input
          type="text"
          id="customer_email"
          name="customer_email"
          value={formData.customer_email || ''}
          onChange={handleInputChange}
          placeholder="Enter customer email"
        />
      </label>

      <label htmlFor="product_name">
        Product Name:
        <input
          type="text"
          id="product_name"
          name="product_name"
          value={formData.product_name || ''}
          onChange={handleInputChange}
          placeholder="Enter product name"
        />
      </label>

      <label htmlFor="quantity">
        Quantity:
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity || 0}
          onChange={handleInputChange}
          placeholder="Enter quantity"
        />
      </label>
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateOrderForm;
