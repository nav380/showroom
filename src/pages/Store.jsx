import React, { useState, useEffect } from "react";
import BackButton from "../components/Backbutton";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, Box, Download, Eye, Tag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import removeItemFromCart from "../redux/features/Cart/thunks/removeItemFromCart";
import DjangoConfig from "../config/config";
import fetchCartItems from "../redux/features/Cart/thunks/fetchCartItems";


const Store = () => {
  const dispatch = useDispatch(); // Use Redux dispatch function
  const cart = useSelector(state => state.cart.items); // Get the cart items from Redux state
  const [ShowNotification, setShowNotification] = useState(false);// to show notifications
  const [notification, setNotification] = useState({ message: "", type: "success" });// notifications content and type
  const [error, setError] = useState(false); // Error state
  const [isvisible, setIsvisible] = useState(false);



  useEffect(() => {
    const fatch = async () => {
      try {
        await dispatch(fetchCartItems()).unwrap();
        setError(false);
      } catch (err) {
        setError(true);
      }
    };
    fatch();
    setInterval(() => {
      setIsvisible(true)
    }, 200);

  }, []);

  const handleremove = async (item) => {
    try {
      await dispatch(removeItemFromCart(item)).unwrap();
      setNotification({ message: "item removed successfully", type: "success" });
      setShowNotification(true)
    } catch (err) {
      setNotification({ message: "failed to remove item from cart ", type: "error" });
      setShowNotification(true)
    }
    setTimeout(() => {
      setShowNotification(false); // Hide the notification after  some time
    }, 900);

  };

  const card = (item, index) => {
    return (
      <div key={index} className="w-full  border-gray-200 rounded-lg m-2">
        <div className="max-w-3xl mx-auto">
          <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ">

            <div className="flex flex-row ">
              {/* Image Section */}
              <div className="md:w-2/5 w-3/5 p-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
                  <img
                    src={`${DjangoConfig.apiUrl}${item.main_image}`}
                    alt={item.product_code || "Product"}
                    className="w-full h-full object-cover bg-slate-100 transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  /> 
                </div>
              </div>

              {/* Details Section */}
              <div className=" sm:p-6  p-2 flex flex-col justify-between">
                <div className="">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-900">{item.style_no}</h3>
                    <p className="text-[10px] sm:text-[14px] text-gray-500">Product Reference</p>
                  </div>

                  <div className="space-y divide-y divide-gray-100">
                    <DetailRow icon={<Tag size={14} />} label="Style" value={item.style_no} />
                    <DetailRow icon={<Box size={14} />} label="Type" value={item.product_type} />
                    <DetailRow icon={<Tag size={14} />} label="Code" value={item.product_code} />
                    <DetailRow icon={<Bookmark size={14} />} label="Category" value={item.category} />
                  </div>
                </div>

              </div>
              {/* Action Buttons */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <ActionButton onClick={() => handleremove(item)} icon={<Trash2 size={18} />} color="red" />
                      <Link to={`/product-detail/${item.id}`} >
                        <ActionButton  icon={<Eye size={18} />} color="slate" />
                      </Link>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
    )

  }


  return (
    <div className="md:p-6 sm:p-2 sm:ml-[50px]  h-auto min-h-full bg-[#f0ebe7] " >
      <div className="flex justify-between">
        <div><BackButton /></div>
        <h1 className="ml-2 my-4">Store</h1>
        <div><Link to={"/export"} className="hover:bg-[#00000077] p-4 rounded-lg flex gap-2">Export:  <Download size={24} color="#f39c12" /></Link></div>
      </div>
      {/* Toast Notification */}
      {ShowNotification ? (
        <div className={`fixed top-20 right-5  text-white px-4 py-2 rounded-lg shadow-lg ${notification.type === "success" ? "success" : "danger"}`}>
          {notification.message}
        </div>
      ) : null}
      {cart.length > 0 ? (
        <div
          className={`transform transition-all duration-700 ease-out h-full 
        ${isvisible ? "translate-y-0 opacity-100" : "translate-y-96 opacity-0"} 
        text-white p-6 rounded-lg`}
        >
          <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-8 mt-12 ">

            {cart.map((item, index) => (// replace result with cart.item
              card(item, index) // Render each card with item details and remove button

            ))}
          </div>
        </div>
      ) : (
        <h2 className="text-center mt-8 animate-bounce" style={{color:"blue"}}>! Your cart is empty !</h2>
      )}
    </div>
  );
};

function ActionButton({ onClick, icon, color }) {
  const colorClasses = {
    red: 'hover:bg-red-500',
    slate: 'hover:bg-slate-800',
  }[color];

  return (
    <button
      onClick={onClick}
      className={`p-2 bg-white/90 ${colorClasses} rounded-full  transition-all duration-300 group/btn hover:scale-110`}
    >
      <div className="group-hover/btn:text-white text-black transition-colors">
        {icon}
      </div>
    </button>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 pt-1">
        <span className="text-gray-400 sm:text-[14px] text-[10px]">{icon || "N/A"}</span>
        <span className="text-gray-800 sm:text-[14px] text-[10px]">{label || "N/A"}</span>
        <span className="text-gray-800 sm:text-[14px] text-[10px]">{value || "N/A"}</span>
      </div>
    </div>
  );
}



export default Store;
