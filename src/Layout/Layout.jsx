import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AlignJustify, CircleUserRound, LogOut, Settings, ShoppingBag, User, X } from "lucide-react";
import { useSelector } from "react-redux";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const cart = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="flex h-screen font-sans">


      {/* Content Area */}
      <div
        className={`flex-1 transition-all duration-300 "
          } bg-gray-100 overflow-auto`}
      >
        {/* Navbar */}
        <div className="flex justify-between h-[50px] items-center sticky top-0 z-[100] bg-white text-gray-800 shadow-md px-4 py-2">
          {/* Sidebar Toggle Button */}
          <button
            className="p-2 rounded-md hover:bg-gray-200 text-[#f39c12] transition-all duration-900 ease-in-out"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X className="lg:text-lg text-sm" /> : <AlignJustify size={25} />}
          </button>

          {/* Right-side Buttons */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart */}
            <Link to="/store" className="relative">
              <button className="p-2 flex items-center rounded-md hover:bg-gray-200 text-[#f39c12]">
                <ShoppingBag />
                {cart.items.length > 0 && (
                  <sup className="text-sm">
                    {cart.items.length}
                  </sup>

                )}
              </button>
            </Link>

            {/* User Profile */}
            <button className="p-2 rounded-full hover:bg-gray-200 text-[#f39c12]" onClick={() => setIsMenuOpen(true)}>
              <CircleUserRound />
            </button>
            {!isOnline ? <p className="md:px-3 px-1 py-1 rounded-full  font-medium  'bg-red-100 text-red-800">
              Offline
            </p> : ""}


          </div>
        </div>
        {/*  user menu*/}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 mr-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => console.log('Profile clicked')}
              >
                <User className="w-4 h-4 mr-3" />
                Profile
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => console.log('Settings clicked')}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => console.log('Logout clicked')}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </>
        )}

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />
        {/* Routing for the pages */}
        <div className="h-full">
          <Outlet />
        </div>


      </div>
    </div>
  );
};

export default Layout;
