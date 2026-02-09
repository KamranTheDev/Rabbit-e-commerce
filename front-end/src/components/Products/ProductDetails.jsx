import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice'; // adjust path and names as needed
import { addToCart } from '../../redux/slices/cartSlice'; // adjust the path as needed
const ProductDetails = (productId) => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const{selectedProduct, loading, error, similarProducts} = useSelector((state) => state.products);
  const {user, guestId} = useSelector((state) => state.auth);
  const [mainimage, setMainImage] = useState('');
  const [selectedsize, setSelectedSize] = useState('');
  const [selectedcolor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isbuttondisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = id || productId;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails({id: productFetchId}));
      dispatch(fetchSimilarProducts({id: productFetchId}));
      }
  }, [dispatch, productFetchId]);
  // [dispatch, productFetchId]
      

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handlequantitychange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedsize || !selectedcolor) {
      toast.error('Please select size and color before add', {
        duration: 1000,
      });
      return;
    }
    setIsButtonDisabled(true);

     dispatch(
      addToCart({
        productId: productFetchId,
       quantity,
        size: selectedsize,
        color: selectedcolor,
        userId: user?._id,
        guestId,
  })
    )
    .then(()=>{
      toast.success('Product added to cart successfully', {
        duration: 1000,
      });
    })
    .finally(() => {
      setIsButtonDisabled(false);
    });
  };
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error}</p>
  }
  return (
   
    <div className="p-6">
       {selectedProduct && (
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg ">
        <div className="flex flex-col md:flex-row">
          {/* left-thumbnails */}
          <div className=" md:flex-col space-y-4 mr-6  hidden md:flex">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail${index}`}
                className={`w-20 h-20 object-cover cursor-pointer border rounded-lg ${mainimage === image.url ? 'border-black-300' : 'border-gray-300'}`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>
          {/* main-image */}
          <div className="md:w-1/2 r">
            <div className="mb-4 ">
              <img
                src={mainimage}
                alt="main product"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
          {/* mobile-thumbnail */}
          <div className=" md:hidden flex overscroll-x-scroll space-x-4 mb-4 ">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail${index}`}
                className={`w-20 h-20 object-cover cursor-pointer border rounded-lg ${mainimage === image.url ? 'border-black-300' : 'border-gray-300'}`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>
          {/* right-side  */}
          <div className="md:w-1/2 md:ml-10">
            <h2 className="text-2xl md:font-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h2>
            <p className="text-gray-600 text-lg mb-1 line-through">
              {selectedProduct.originalPrice &&
                `$${selectedProduct.originalPrice}`}
            </p>

            <p className="text-gray-500 text-xl mb-2 ">
              ${selectedProduct.originalPrice}
            </p>
            <p className="text-gray-500 text-md mb-4">
              {selectedProduct.description}
            </p>
            {/* size and color */}
            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.color.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border border-gray-300 ${
                      selectedcolor === color
                        ? 'border-black border-4'
                        : 'border-gray-300'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: 'brightness:(0.5)',
                    }}></button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-6 h-6 rounded border ${
                      selectedsize === size
                        ? 'bg-black text-white'
                        : 'border-gray-300'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Quantity</p>
              <div className="flex items-center space-x-2 mt-2 ">
                <button
                  onClick={() => handlequantitychange('minus')}
                  className="px-2 py-1 bg-gray-200 rounded text-lg ">
                  -
                </button>
                <span className="px-1">{quantity}</span>
                <button
                  onClick={() => handlequantitychange('plus')}
                  className="px-2 py-1 bg-gray-200 rounded text-lg ">
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isbuttondisabled}
              className={`bg-black text-white px-6 py-2 rounded-full w-full mb-4 ${
                isbuttondisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover: bg-gray-900'
              }`}>
              {isbuttondisabled ? 'Adding...' : 'Add to Cart'}
            </button>
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characterstics:</h3>
              <table className="w-full text-left text-sm  text-gray-500">
                <tbody>
                  <tr>
                    <td className="py-1 px-2 ">Brand:</td>
                    <td className="py-1 px-2">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2">Material:</td>
                    <td className="py-1 px-2">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">
            You May Also Like To
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    )};
    
    
    
    </div>
  
  
  );
};

export default ProductDetails;
