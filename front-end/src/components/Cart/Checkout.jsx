import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';


const Cart = {
  product: [
    {
      name: 'Stylish Jacket',
      size: 'M',
      color: 'Red',
      price: 20,
      image: 'https://picsum.photos/id/1/200?random=1',
    },
    {
      name: 'Casual sneakers',
      size: '42',
      color: 'white',
      price: 75,

      image: 'https://picsum.photos/id/2/200?random=2',
    },
  ],
  totalPrice: 195,
};

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingaddress, setShippingAddress] = useState({
    fname: '',
    lname: '',
    address: '',
    city: '',
    postalcode: '',
    country: '',
    phone: '',
  });

  const handleCreateCheckout = (e) => {
    e.preventDefault(); // Create a new checkout in the backend, and store the checkout ID
    setCheckoutId('12345'); // Replace with actual checkout ID
  };
   const handlePaymentSuccess = (Details) => {
    console.log('Payment successful:', Details);
    navigate('/order-confirmation');
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl ms-auto py-10 px-6 tracking-tighter ">
      {/* left-section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value="user@example.com"
              className=" w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingaddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingaddress,
                    firstName: e.target.value,
                  })
                }
                className=" w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingaddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingaddress,
                    lastName: e.target.value,
                  })
                }
                className=" w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingaddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingaddress,
                  address: e.target.value,
                })
              }
              className=" w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingaddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingaddress,
                    city: e.target.value,
                  })
                }
                className=" w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingaddress.postalcode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingaddress,
                    postalcode: e.target.value,
                  })
                }
                className=" w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingaddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingaddress,
                  country: e.target.value,
                })
              }
              className=" w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700"> Phone</label>
            <input
              type="tel"
              value={shippingaddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingaddress,
                  phone: e.target.value,
                })
              }
              className=" w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded">
                Continue to payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with PayPal</h3>
                < PayPalButton amount={100} onSuccess={handlePaymentSuccess} 
                onError={(err)=>alert("Payment failed.try again")}/>
              </div>
            )}
          </div>
        </form>
      </div>
      {/* right-section */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {Cart.product.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b">
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-sm text-gray-500">size: {product.size}</p>
                  <p className="text-sm text-gray-500">
                    color: {product.color}
                  </p>
                </div>
              </div>
              <p className='text-xl'> ${product.price?.toLocaleString()} </p>
            </div>
          ))}
        </div>
        <div className='flex justify-between items-center text-lg mb-4'>
          <p>Subtotal</p>
          <p >${Cart.totalPrice?.toLocaleString()}</p> 
        </div>
        <div className='flex justify-between items-center text-lg mb-4'>
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className='flex justify-between items-center text-lg mb-4'>
          <p>Total</p>
          <p>${Cart.totalPrice?.toLocaleString()}</p>
          </div>
  
      </div>
    </div>
  );
};

export default Checkout;

