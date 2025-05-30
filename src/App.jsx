import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home"; // Home page
import ProductMaster from "./pages/Product"; // Product Master page
import Store from "./pages/Store"; // Store page
import ProductDetail from "./pages/ProductDetail"; // Product Detail page
import Layout from "./Layout/Layout"; // Layout wrapper for nested routes
import { Export } from "./pages/Export";
import "./custom.css";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/* Home page as default */}
          <Route path="/product-master" element={<ProductMaster />} /> {/* Product Master page */}
          <Route path="/store" element={<Store />} /> {/* Store page */}
          <Route path="/product-detail/:id" element={<ProductDetail />} /> {/* Product Detail page */}
          <Route path="/export" element={<Export />} /> {/* Export page */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
