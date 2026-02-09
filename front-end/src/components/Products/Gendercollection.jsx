import React from 'react';
import menscollection from '../../assets/mens-collection.webp';
import womenscollection from '../../assets/womens-collection.webp';
import { Link } from 'react-router-dom';

const Gendercollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* womenscollection  */}
        <div className="relative flex-1">
          <img
            src={womenscollection}
            alt="womens collection"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-8 bg-white left-8 p-4 bg-opacity-90 ">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=women"
              className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>
        {/* mens-collection */}
        <div className="relative flex-1">
          <img
            src={menscollection}
            alt="Mens collection"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-8 left-8 p-4 bg-white bg-opacity-90 ">
            <h2 className="text-2xl font-bold  text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=men"
              className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Gendercollection;
