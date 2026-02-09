import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    color: '',
    size: [],
    material: [],
    brand: [],
    minprice: 0,
    maxprice: 100,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);
  const categories = ['Top Wear', 'Bottom Wear'];

  const colors = [
    'Red',
    'Blue',
    'Black',
    'White',
    'Grey',
    'Yellow',
    'Green',
    'Pink',
    'Beige',
    'Navy',
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const materials = [
    'Cotton',
    'Polyester',
    'Linen',
    'Silk',
    'Wool',
    'Denim',
    'Viscose',
    'Fleece',
  ];
  const brands = [
    'Urban Threads',
    'Modern Fit',
    'Street Style',
    'Beech Breeze',
    'Fashionista',
    'ChicStyle',
  ];
  const genders = ['Men', 'Women'];
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || '',
      gender: params.gender || '',
      color: params.color || '',
      size: params.size ? params.size.split(',') : [],
      material: params.material ? params.material.split(',') : [],
      brand: params.brand ? params.brand.split(',') : [],
      minprice: params.minprice || 0,
      maxprice: params.maxprice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters};
  
    if (type === 'checkbox') {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
  
    setFilters(newFilters);
    console.log(newFilters);
    updateURLParams(newFilters);
  };
  const updateURLParams= (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length >0) {
        
          params.append(key, newFilters[key].join(','));
      } else if(newFilters[key]) {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };
  
  const handlePriceChange = (e) => {
    const newprice = e.target.value;
    setPriceRange([0,newprice]);
    updateURLParams({...filters, minprice: 0, maxprice: newprice });
    setFilters(filters);
    updateURLParams(filters)
    
  }
  


  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>
      {/* category-filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className="mr-2 h-3 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
        {/* gender-filter */}
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className="mr-2 h-3 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
        {/* color-filter */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                name="color"
                value={color}
                onClick={handleFilterChange}


                className={`w-6 h-6 rounded-full border border-gray-300 cursor-pointer transition
                      hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-500":""}`}
                style={{ backgroundColor: color.toLowerCase() }}></button>
            ))}
          </div>
        </div>
        {/* size filter */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">Size</label>
          {sizes.map((size) => (
            <div key={size} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleFilterChange}
                checked={filters.size.includes(size)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span className="text-gray-700">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* material filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* brand filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>
      {/* price range filter */}
      <div className='mb-8'>
        <label className="block text-gray-600 font-medium mb-2">Price Range</label>
        <input
          type="range"
          name='priceRange'
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'/>
          <div className='flex justify-between text-gray-600 mt-2'>
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>












      </div>
    </div>
  );
};

export default FilterSidebar;
