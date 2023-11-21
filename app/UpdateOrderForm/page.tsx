interface EditFormData {
    customer_email: string;
    product_name: string;
    quantity: number;
    order_id?: number;
  }
  
  interface UpdateOrderFormProps {
    orderId: number;
    onUpdate: (updatedFormData: EditFormData, orderId: number) => Promise<void>;
    editFormData?: EditFormData;
  }
  
  export type { EditFormData, UpdateOrderFormProps };
  