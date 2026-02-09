import React from 'react';

const checkout = {
  _id: '12323',
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: '1',
      name: 'Jacket',
      color: 'red',
      size: 'M',
      price: 20,
      quantity: 1,
      image: 'https://picsum.photos/id/1/200?random=1',
    },
    {
      productId: '2',
      name: 'tshirt',
      color: 'red',
      size: 'M',
      price: 10,
      quantity: 2,
      image: 'https://picsum.photos/id/2/200?random=2',
    },
  ],
  shippingAddress: {
    address: '123 Main St',
    city: 'New York',

    country: 'USA',
  },
};

const OrderConfirmationPage = () => {
  const calculatedEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 5 days for estimated delivery
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank you for your order!
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="mb-20 flex justify-between">
            {/* order id and date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* estimated delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{''}
                {calculatedEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* order-items */}
          <div className='mb-20'>
            {checkout.checkoutItems.map((item) => (
                <div key={item._id} className="flex mb-4">
                    <img src={item.image}
                     alt={item.name} 
                     className="w-20 h-20 object-cover rounded-md mr-4" />
                     <div>
                        <h4 className="text-md font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.color} | {item.size}</p>

                     </div>
                        <div className="ml-auto">
                            <p className="text-lg font-semibold">${item.price}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                    </div>
            )
            )}

          </div>
          {/* payment and delivery details */}
          <div className=" grid grid-cols-2 gap-8">
            {/* payment infor */}
            <div>
                <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                <p className=' text-gray-500'>Payment method: PayPal</p>
            </div>
            {/* delivery information */}
            <div>
                <h4 className='text-lg font-semibold mb-2'>Delivery</h4>
                <p className='text-gray-600'>
                    {checkout.shippingAddress.address}
                </p>
                <p className=' text-gray-600'> 
                 {checkout.shippingAddress.city}, {""}, {checkout.shippingAddress.country}</p>
                
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
