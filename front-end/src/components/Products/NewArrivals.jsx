import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);

 useEffect(() => {
  // Fetch new arrivals from the backend
  const fetchNewArrivals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
      );
      setNewArrivals(response.data);
      } catch (error) {
      console.error(error);
    }
  };
  fetchNewArrivals();
}, []);

  

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    e.preventDefault(); // Prevent text selection
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    e.preventDefault(); // Prevent text selection
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const updateScrollButton = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
      setScrollLeft(leftScroll);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButton);
      updateScrollButton();
    
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollButton);
      }
    };
  }, [newArrivals]);

  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4"> Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8 tracking-tighter">
          Discover the latest trends and styles in our new arrivals collection.
          From chic dresses to trendy accessories, find your perfect look today.
        </p>
        {/* scroll-button */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? 'bg-white text-black'
                : 'bg-gray-300 text-gray-500'
            }`}>
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? 'bg-white text-black'
                : 'bg-gray-300 text-gray-500'
            }`}>
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      {/* SCROLLABLE CONTENT */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}>
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="relative min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] rounded-lg overflow-hidden">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              draggable="false"
              className="rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md p-4 rounded-b-lg text-white">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;