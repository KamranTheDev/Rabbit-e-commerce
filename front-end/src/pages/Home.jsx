import React, { useState, useEffect } from 'react';
import Hero from '../components/Layout/Hero';
import Gendercollection from '../components/Products/Gendercollection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturedSection from '../components/Products/FeaturedSection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({
      gender: "women",
      category: "top-wear",
      limit: 10,
    }));

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api//best-sellers`
        );
        setBestSellerProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller();
  },[dispatch]);

  return (
    <div>
      <Hero />
      <Gendercollection />
      <NewArrivals />

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
      {bestSellerProducts.length > 0 ? (
        <ProductGrid products={bestSellerProducts} />
      ) : (
        <p className='text-center'>Loading best seller products...</p>
      )}

      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeaturedSection />
    </div>
  );
};

export default Home;