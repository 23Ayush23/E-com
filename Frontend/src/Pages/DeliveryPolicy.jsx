import React from 'react';

const DeliveryPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 underline">Delivery Policy</h1>
      <p className="mb-2">
        We aim to provide a seamless and efficient delivery experience for all our customers. Please review our delivery policies below:
      </p>
      
      <h2 className="text-xl font-semibold mt-4">Shipping Time & Processing</h2>
      <p className="mb-2">
        Orders are processed within 1-2 business days. Standard shipping takes 5-7 business days, while express shipping options are available at checkout.
      </p>
      
      <h2 className="text-xl font-semibold mt-4">Shipping Charges</h2>
      <p className="mb-2">
        We offer free shipping on orders above $50. A standard shipping fee applies to orders below this amount, and express shipping costs vary based on location.
      </p>
      
      <h2 className="text-xl font-semibold mt-4">Order Tracking</h2>
      <p className="mb-2">
        Once your order is shipped, you will receive a tracking number via email to monitor the delivery status.
      </p>
      
      <h2 className="text-xl font-semibold mt-4">International Shipping</h2>
      <p className="mb-2">
        We currently ship to select international locations. Additional customs duties or taxes may apply based on the destination country.
      </p>
      
      <h2 className="text-xl font-semibold mt-4">Delivery Issues</h2>
      <p className="mb-2">
        If your order is delayed or lost, please contact our support team for assistance. We will work to resolve any issues as quickly as possible.
      </p>
    </div>
  );
};

export default DeliveryPolicy;
