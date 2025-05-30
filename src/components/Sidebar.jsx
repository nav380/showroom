import { FileDown, LayoutDashboard, LogOut, Package, ShoppingBag } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const user = "user";
  const username = "usernames";

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`bg-white h-full shadow-xl fixed left-0 z-50 transition-all duration-300 ease-in-out transform overflow-x-auto border-r border-gray-100
        ${isOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-0 sm:w-[70px] sm:translate-x-0"}`}
    >
      {isOpen ? (
        <div className="flex flex-col h-full overflow-x-hidden">
          <div className="flex-none">
            <span className="flex items-center h-16 px-6 border-b border-gray-100">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                NAVTECH
              </div>
            </span>
            <div className="p-4 space-y-1">
              <Link
                to="/"
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActiveRoute('/')
                    ? 'bg-orange-50 text-orange-600 scale-110'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <LayoutDashboard
                  size={20}
                  className={`mr-3 ${isActiveRoute('/') ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <span className="font-medium overflow-x-hidden">Dashboard</span>
              </Link>
              <Link
                to="/product-master"
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActiveRoute('/product-master')
                    ? 'bg-orange-50 text-orange-600 scale-110'
                    : 'text-gray-600 hover:bg-indigo-100 hover:text-gray-900'}`}
              >
                <Package
                  size={20}
                  className={`mr-3 ${isActiveRoute('/product-master') ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <span className="font-medium overflow-x-hidden">Product Master</span>
              </Link>
              <Link
                to="/store"
                className={`flex items-center  px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActiveRoute('/store')
                    ? 'bg-orange-50 text-orange-600 scale-110'
                    : 'text-gray-600 hover:bg-indigo-100 hover:text-gray-900'}`}
              >
                <ShoppingBag
                  size={20}
                  className={`mr-3 ${isActiveRoute('/product-master') ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <span className="font-medium overflow-x-hidden">Store</span>
              </Link>
              <Link
                to="/export"
                className={`flex items-center  px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActiveRoute('/export')
                    ? 'bg-orange-50 text-orange-600 scale-110'
                    : 'text-gray-600 hover:bg-indigo-100 hover:text-gray-900'}`}
              >
                <FileDown
                  size={20}
                  className={`mr-3 ${isActiveRoute('/product-master') ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <span className="font-medium overflow-x-hidden">Export</span>
              </Link>
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="flex-none border-t border-gray-100">
            <div className="p-4">
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-medium text-gray-900">{user}</p>
                <p className="text-xs text-gray-500">{username}</p>
              </div>
              <button className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                <LogOut size={20} className="mr-3 text-gray-400" />
                <span className="font-medium">Log out</span>
              </button>
            </div>
            <div className="px-4 py-3 bg-gray-50">
              <p className="text-xs text-center text-gray-500">
                © 2025 NAVTECH. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 space-y-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <Link
            to="/"
            className={`p-2 rounded-lg transition-colors duration-200
              ${isActiveRoute('/')
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          >
            <LayoutDashboard size={24} />
          </Link>
          <Link
            to="/product-master"
            className={`p-2 rounded-lg transition-colors duration-200
              ${isActiveRoute('/product-master')
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          >
            <Package size={24} />
          </Link>
          <Link
            to="/store"
            className={`p-2 rounded-lg transition-colors duration-200
              ${isActiveRoute('/store')
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          >
            <ShoppingBag size={24} />
          </Link>
          <Link
            to="/export"
            className={`p-2 rounded-lg transition-colors duration-200
              ${isActiveRoute('/export')
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          >
            <FileDown size={24} />

          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
