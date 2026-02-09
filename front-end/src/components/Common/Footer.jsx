import React from 'react'
import { Link } from 'react-router-dom';
import { IoLogoInstagram} from 'react-icons/io';
import { IoLogoAmazon, IoLogoFacebook } from 'react-icons/io5';
import { FiPhoneCall } from 'react-icons/fi';


const Footer = () => {
  return (
   <footer className='border-t py-12 mx-10'>
    <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap:8 px-4 lg:px-0'>
        <div>
        <h3 className='text-lg text-gray-800 mb-4 font-medium'>NewsLetter</h3>
        <p className='text-gray-600 mb-4'>Be the first to hear about new products,
         exclusive events and new offers.</p>
         <p className='font-medium text-sm text-gray-800 mb-6'>sign up and get 10% off in your first order. </p>

         {/* newsletter form */}
         <form className='flex '>
            <input type="email" placeholder="Enter your email" className="w-full p-3 text-sm border-t border-l border-b border-gray-300 rounded-l-md  focus:outline-none focus:ring-2 ring-gray-500 transition-all"
            required />
            <button className='bg-black text-white px-6 py-3 text-sm rounded-md hover:bg-gray-800 transition-all'>subscribe</button>
         </form>
         </div>
         {/* shop-links */}
         <div className='ml-7'>
            <h3 className='text-lg text-gray-800 mb-4 font-medium'>Shop</h3>
            <ul className='space-y-2 text-gray-500'>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                Men's Top Wear
                    </Link>
                </li>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                Women's Top Wear
                    </Link>
                </li>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                Men's Bottom Wear
                    </Link>
                </li>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                Women's Bottom Wear
                    </Link>
                </li>
            </ul>
         </div>
         {/* support-links */}
         <div className='ml-7'>
            <h3 className='text-lg text-gray-800 mb-4 font-medium'>Support</h3>
            <ul className='space-y-2 text-gray-500'>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                Contact Us
                    </Link>
                </li>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                About Us
                    </Link>
                </li>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                FAQs
                    </Link>
                </li>
                <li>
                    <Link href="#" className='hover:text-gray transition-colors'>
                Features
                    </Link>
                </li>
            </ul>
         </div>
         {/* FOLLOW US */}
         <div>
            <h3 className='text-lg text-gray-800 mb-4'>Follow Us</h3>
            <div className='flex items-center space-x-4 mb-6'>
                <a href="http://www.instgram.com" target="_blank" 
                rel="noopener noreferrer" className='hover:text-gray-500 transition-colors'>
                <IoLogoInstagram className='h-6 w-6 text-gray-500' />
                </a>
                <a href="http://www.facebook.com" target="_blank" 
                rel="noopener noreferrer" className='hover:text-gray-500 transition-colors'>
                <IoLogoFacebook className='h-6 w-6 text-gray-500' />
                </a>
                <a href="http://www.amazon.com" target="_blank" 
                rel="noopener noreferrer" className='hover:text-gray-500 transition-colors'>
                <IoLogoAmazon className='h-6 w-6 text-gray-500' />
                </a>
            </div>
            <p className='text-gray-500'>Calls Up</p>
            <p>
                <FiPhoneCall className='inline-block mr-2'/>
                +123-456-7890 
            </p>
         </div>
    </div>
    <div className='container mx-auto mt-12 text-center px-4 lg:px-0 border-t pt-6 border-gray-200'>
        <p className='text-gray-500 text-sm tracking-tighter mt-0'>© 2023 Rabbit Fashion. All rights reserved.</p>
        </div>
   </footer>
  )
}

export default Footer