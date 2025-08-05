import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/Backbutton";
import Loading from "../components/Loading";
import getItemById from "../components/fatchoneproduct";
import { Box, ClipboardCheck, Calendar, User, Tag, ToyBrick as Fabric, Leaf, MessageCircle, Image as ImageIcon, History } from 'lucide-react';
import DjangoConfig from "../config/config";



const Product = () => {
  const { id } = useParams(); // Get the product ID from the URL parameter
  const [product, setProduct] = useState(); // State to hold product details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [checkImage, setCheckImage] = useState(); // State to manage main image display
  const [imagefields, setImageFields] = useState([])

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getItemById(id);

      // Check if response is valid
      if (!data || !data.product_code) {
        throw new Error("Invalid data received from API");
      }

      // Use real product data
      setProduct(data);
      setCheckImage(data.main_image);
      setImageFields([
        { src: data.front_image, label: "Front" },
        { src: data.back_image, label: "Back" },
        { src: data.details_image, label: "Details" },
        { src: data.sleeve_image, label: "Sleeve" },
        { src: data.fabric_image, label: "Fabric" },
        { src: data.inspiration_image, label: "Inspiration" },
      ]);
    } catch (err) {
      console.warn("API failed, using dummy product:", err);

      // Fallback dummy data
      const dummyProduct = {
        product_code: "DUMMY001",
        style_no: "STYLE123",
        product_type: "Shirt",
        category: "Men",
        designer_head: "John Doe",
        entered_by: "Admin",
        season: "Summer 2025",
        fabric: "Cotton",
        value_driver: "Comfort",
        sustainable: true,
        designer_status: "Approved",
        dmm_status: "Pending",
        remarks: "Sample product for demo.",
        comment: "Awaiting buyer confirmation.",
        is_active: true,
        buyer: "Zara",
        dmm: "Jane Merchant",
        status: "Approved",
        selected_date: "2025-07-15",
        order_qty: 500,
        order_date: "2025-08-01",
        main_image: "/images/dummy/main.jpg",
        front_image: "/images/dummy/front.jpg",
        back_image: "/images/dummy/back.jpg",
        details_image: "/images/dummy/details.jpg",
        sleeve_image: "/images/dummy/sleeve.jpg",
        fabric_image: "/images/dummy/fabric.jpg",
        inspiration_image: "/images/dummy/inspiration.jpg",
      };

      setProduct(dummyProduct);
      setCheckImage(dummyProduct.main_image);
      setImageFields([
        { src: dummyProduct.front_image, label: "Front" },
        { src: dummyProduct.back_image, label: "Back" },
        { src: dummyProduct.details_image, label: "Details" },
        { src: dummyProduct.sleeve_image, label: "Sleeve" },
        { src: dummyProduct.fabric_image, label: "Fabric" },
        { src: dummyProduct.inspiration_image, label: "Inspiration" },
      ]);

      setError("Failed to fetch from API — dummy data loaded.");
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);



  function InfoItem({ icon, label, value, className = '' }) {
    return (
      <div className="flex items-start space-x-2">
        <span className="text-gray-400 mt-1">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`font-medium ${className || 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    );
  }

  if (loading) return <div><BackButton /><Loading /></div>;

  return (
    <div className="min-h-screen  sm:ml-[50px] p-4 bg-[#f0ebe7] "  >
      {/* Header */}
      <header >
        <div className=" mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <BackButton />
            <h1>Product Details</h1>
            {product ? <p className={`md:px-3 px-1 py-1 rounded-full  font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.is_active ? 'Active' : 'Inactive'}
            </p> : <div></div>}
          </div>
        </div>
      </header>
      {error && <h2 className="text-center mt-8 text-red-600 animate-bounce">!{error}</h2>}
      <div
        className={`transform transition-all duration-700 ease-out h-full 
        ${product ? "translate-y-0 opacity-100" : "translate-y-96 opacity-0"} 
        text-white p-6 rounded-lg`}
      >
        {product && <div>
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white mt-2 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 flex">
                <div className="bg-white rounded-lg shadow overflow-y-auto  md:w-full w-48 border border-slate-200">
                  <img
                    src={`${DjangoConfig.apiUrl}${checkImage}`}
                    alt="Main product view"
                    className="h-auto w-96 mx-auto mt-2 rounded-lg"
                  />

                </div>
                <div className="grid grid-rows-6 gap-4 ml-4 ">
                  {imagefields.map((image, index) => (
                    <div key={index} className="bg-white rounded-lg shadow overflow-hidden" onClick={() => { setCheckImage(image.src) }}>
                      <img
                        src={`${DjangoConfig.apiUrl}${image.src}`}
                        alt={`${image.label} view`}
                        onError={(e) => e.target.style.display = "none"}
                        className=" w-full h-16 "
                      />
                      <p className="text-center py-1 ">{image.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="bg-white rounded-lg shadow p-6 space-y-6 border border-slate-200">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem icon={<Box />} label="Product Code" value={product.product_code} />
                  <InfoItem icon={<Tag />} label="Style No" value={product.style_no} />
                  <InfoItem icon={<Box />} label="Product Type" value={product.product_type} />
                  <InfoItem icon={<Tag />} label="Category" value={product.category} />
                </div>

                <hr className="border-gray-200" />

                {/* Team Info */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem icon={<User />} label="Designer Head" value={product.designer_head} />
                  <InfoItem icon={<User />} label="Entered By" value={product.entered_by} />
                </div>

                <hr className="border-gray-200" />

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem icon={<Calendar />} label="Season" value={product.season} />
                  <InfoItem icon={<Fabric />} label="Fabric" value={product.fabric} />
                  <InfoItem icon={<Tag />} label="Value Driver" value={product.value_driver} />
                  <InfoItem
                    icon={<Leaf className={product.sustainable ? 'text-green-500' : ''} />}
                    label="Sustainable"
                    value={product.sustainable ? 'Yes' : 'No'}
                  />
                </div>

                <hr className="border-gray-200" />

                {/* Status */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    icon={<ClipboardCheck />}
                    label="Designer Status"
                    value={product.designer_status}
                    className={`${product.designer_status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}
                  />
                  <InfoItem
                    icon={<ClipboardCheck />}
                    label="Merchant Status"
                    value={product.dmm_status}
                    className={`${product.dmm_status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}
                  />
                </div>

                <hr className="border-gray-200" />

                {/* Comments */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Remarks</h4>
                      <p className="text-gray-600">{product.remarks}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Comments</h4>
                      <p className="text-gray-600">{product.comment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </main>
          {/* Selection History */}
          <div className="mt-8 bg-white rounded-lg shadow p-6 lg:mx-auto md:mx-2 sm:mx-2 mb-2">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-bold text-gray-900">Selection History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DMM Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.buyer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.season}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.dmm}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.comment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.selected_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.order_qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.order_date}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>}
      </div>

    </div>
  );
};

export default Product;
