import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Changedmm from "../components/Changedmm";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Check, ExternalLink, Filter, ShoppingCart } from "lucide-react";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import fetchCartItems from "../redux/features/Cart/thunks/fetchCartItems";
import addItemToCart from "../redux/features/Cart/thunks/addItemToCart";
import fetchProducts from "../redux/features/Products/thunks/fetchProducts";
import DjangoConfig from "../config/config";



const Home = () => {
  const products = useSelector((state) => state.products.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ShowNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const dispatch = useDispatch();
  const [searcheitem, setSearcheitem] = useState();
  const cart = useSelector((state) => state.cart);
  const [isvisible, setIsvisible] = useState(false);


  const [check, setCheck] = useState("hhh");


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        dispatch(fetchCartItems());
        await dispatch(fetchProducts()).unwrap();
        //setFilteredProducts(products);
      } catch (err) {
        setError(err.error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setInterval(() => {
      setIsvisible(true)
    }, 200);
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]);
  //dmm change section
  const [dmmchangeitem, setDmmChangeitem] = useState();
  const [pop, setPop] = useState(false)//dmmpop
  const popclopse = ({message,type}) => {
    setPop(!pop)
    if (pop) {
      setNotification({ message: message, type: type });
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false); // Hide the notification after 1 seconds
      }, 900);

    }

  };//seterdmmpop

  const handleAddItemcart = async (item) => {
    try {
      await dispatch(addItemToCart(item)).unwrap();
      setNotification({ message: "item added successfully", type: "success" });
      setShowNotification(true)
    } catch (err) {
      console.error(err);
      setNotification({ message: "failed to add item to cart ", type: "error" });
      setShowNotification(true)
    }
    setTimeout(() => {
      setShowNotification(false); // Hide the notification after 1 seconds
    }, 900);

  };

  const [filters, setFilters] = useState({
    styleNo: [],
    designer: [],
    productType: [],
    category: [],
    season: [],
    fabric: [],
    valueDriver: [],
    sustainable: "",
    dmmStatus: [],
  });

  const handleFilterChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFilters({ ...filters, [name]: selectedValues });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  //filters apply
  const applyFilters = () => {
    const filteredData = products.filter((product) => {
      return (
        (filters.styleNo.length === 0 ||
          filters.styleNo.includes(product.style_no)) &&
        (filters.designer.length === 0 ||
          filters.designer.includes(product.designer_head)) &&
        (filters.productType.length === 0 ||
          filters.productType.includes(product.product_type)) &&
        (filters.category.length === 0 ||
          filters.category.includes(product.category)) &&
        (filters.fabric.length === 0 ||
          filters.fabric.includes(product.fabric)) &&
        (filters.season.length === 0 ||
          filters.season.includes(product.season)) &&
        (filters.dmmStatus.length === 0 ||
          filters.dmmStatus.includes(product.dmm_status)) &&
        (filters.valueDriver.length === 0 ||
          filters.valueDriver.includes(product.value_driver)) &&
        (filters.sustainable === "" ||
          product.sustainable.toString() === filters.sustainable)

      )

    });
    setFilteredProducts(filteredData);  // Set the filtered products
    setShowAddModal(false);  // Close modal after applying filters
  };
  // ncart button animation
  const handleClickbutton = (button) => {
    button.classList.remove("scale-animation"); // Reset the animation
    void button.offsetWidth; // Trigger reflow to restart animation
    button.classList.add("scale-animation");
    setTimeout(() => {
      button.classList.remove("scale-animation");
    }, 500); // Wait 0.5 seconds before resetting the animation
  };

  const itemincart = ({ item }) => {
    const itemincart = cart.items.find((cartitem) => cartitem.id === item.id)
    if (itemincart) {
      return true;
    }
    return false;
  }





  const CARD_WIDTH = 350; // Approximate width of a card 
  let CARD_HEIGHT = 480;
  if (window.innerWidth >= 1000) {
    CARD_HEIGHT = 490; // Large screens (Desktops)
  } else if (window.innerWidth >= 768) {
    CARD_HEIGHT = 380; // Tablets
  } else {
    CARD_HEIGHT = 320; // Mobile devices
  }
  const columnCount = Math.floor(window.innerWidth / CARD_WIDTH); // Calculate columns based on screen width
  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = filteredProducts[index];

    if (!item) return null;
    return (
      <div className=" rounded-2xl md:hover:-translate-y-2 hover:-translate-y-1 transition-all delay-200 ease-linear "
        style={{
          ...style,
          minWidth: CARD_WIDTH,
          minHeight: CARD_HEIGHT,
          padding: "10px",
        }}
      > <div className={`md:p-4 sm:p-10 p-8   overflow-x-hidden `}>
          <div className=" rounded-xl p-1 shadow-md bg-slate-200 shadow-slate-500 hover:shadow-lg hover:shadow-slate-500 transition-all delay-900 ease-linear " >
            <div className={` bg-slate-50 md:mx-0  rounded-xl  border-transparent border-4 `}>
              {/*card style start */}
              <div
                className=" rounded-t-xl group flex flex-col "
                key={index}
              >
                {/* Image Section: Full width and height */}
                <div className="w-full sm:h-36 md:h-40 lg:h-64 xl-h-64 h-36 mb-2 overflow-hidden rounded-lg border-b-2 border-gray-300 relative">
                  <Link to={`/product-detail/${item.id}`}>
                    <img
                      src={`${DjangoConfig.apiUrl}${item.main_image}`}
                      alt={`Product ${item.style_no || "N/A"}`}
                      className="w-full h-full duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 hover:bg-slate-200 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                    </div>
                  </Link>

                </div>
                {/* Data Section: Border around the data */}
                <div className="w-full mb-2">
                  <div className="px-2">
                    <p className=" lg:text-xl md:text-lg sm:text-md text-sm flex justify-between">
                      <span className="font-bold flex">Style:</span>
                      <span className="font-bold">{item.style_no || "N/A"}</span>
                    </p>
                    <p className=" px-2  flex justify-between text-slate-600 ">
                      <span >Type:</span>
                      <span>{item.product_type || "N/A"}</span>
                    </p>
                    <p className="px-2  flex justify-between text-slate-600">
                      <span >Code:</span>
                      <span>{item.product_code || "N/A"}</span>
                    </p>
                    <p className="px-2  flex justify-between text-slate-600">
                      <span>Remarks:</span>
                      <span>{item.remarks || "N/A"}</span>
                    </p>
                    <p className="px-2  flex justify-between text-slate-600">
                      <span>Merchant status:</span>
                      <span>{item.dmm_status || "N/A"}</span>
                    </p>
                    <p className="px-2  flex justify-between text-slate-600">
                      <span >Date:</span>
                      <span>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}

                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { if (!itemincart(item)) { handleAddItemcart(item); handleClickbutton(e.currentTarget); } }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2  text-white rounded-lg 
                    transition-colors duration-300 ${!itemincart({ item }) ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-500 cursor-not-allowed"}`}
                  >
                    <ShoppingCart size={18} />
                    {!itemincart({ item }) ? <span>Add to Cart</span> : <span>Item in cart</span>}
                  </button>
                  <button
                    onClick={(e) => { popclopse({message:"change",type:"success"}); setDmmChangeitem(item); handleClickbutton(e.currentTarget);setCheck("naveen") }}
                    className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    <Check size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }, [filteredProducts, columnCount]);

  return (
    <div className="md:p-6 sm:ml-[50px] w-auto h-full min-h-[100%] bg-[#f0ebe7]  overflow-y-hidden ">
      <div className="flex justify-between">
        <h1 className="mb-6 ml-4">Product Showcase</h1>
        <div className="flex justify-end mb-4 ">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 h-12 rounded-lg hover:bg-[#00000077] flex"
          >
            <p className="mt-1 pr-2">Filters:</p><Filter color="#f39c12" size={30} />
          </button>
        </div>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {/* {error && <h2 className="text-center mt-8 text-red-600 animate-bounce">!{error}</h2>} */}

      {pop ? <Changedmm product={dmmchangeitem} close={popclopse}  check={check}/> : ""}



      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 md:p-8 lg:p-16 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-h-[90vh] ">
            <div className="bg-white p-6 rounded-lg w-full mb-10 ">
              <h2 className="text-xl font-bold mb-4 lg:text-[36px] sm:text-[28px] ">Filter Products</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyFilters();
                }}
                className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1  gap-x-5 items-end"
              >
                {/* Multi-Select Fields */}
                {[
                  { label: "Style No", key: "styleNo", accessor: (p) => p.style_no },
                  { label: "Designer", key: "designer", accessor: (p) => p.designer_head },
                  { label: "Product Type", key: "productType", accessor: (p) => p.product_type },
                  { label: "Category", key: "category", accessor: (p) => p.category },
                  { label: "Season", key: "season", accessor: (p) => p.season },
                  { label: "Fabric", key: "fabric", accessor: (p) => p.fabric },
                  { label: "Value Driver", key: "valueDriver", accessor: (p) => p.value_driver },
                  { label: "Merchant Status", key: "dmmStatus", accessor: (p) => p.dmm_status },
                ].map(({ label, key, accessor }) => (
                  <div key={key} className="mb-4">
                    <label className="block mb-2 font-medium">{label}</label>
                    <div className="relative">
                      <div
                        className="w-full p-1 border border-gray-300 rounded cursor-pointer bg-white"
                        onClick={() => {
                          setSearcheitem(""),
                            setFilters((prev) => ({
                              ...prev,
                              [`${key}DropdownOpen`]: !prev[`${key}DropdownOpen`],
                            }))
                        }}
                      >
                        {filters[key].length > 0 ? (
                          <div className="flex flex-wrap gap-1 h-[26px] overflow-auto">
                            {filters[key].map((value, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-500 text-white text-sm rounded"
                              >
                                {value}{" "}
                                <span
                                  className="cursor-pointer ml-1"
                                  onClick={(e) => {
                                    e.stopPropagation(),
                                      setSearcheitem(""),
                                      setFilters((prev) => ({
                                        ...prev,
                                        [key]: prev[key].filter((v) => v !== value),
                                      }));
                                  }}
                                >
                                  ✕
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Select {label}</span>
                        )}
                      </div>

                      {filters[`${key}DropdownOpen`] && (
                        <div
                          className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-80 overflow-y-auto shadow-lg "
                        >
                          <div className="w-full flex items-center border border-slate-200 rounded p-2">
                            <input
                              className="flex-grow outline-none px-2"
                              placeholder="Search..."
                              value={searcheitem}
                              onChange={(e) => setSearcheitem(e.target.value)}
                              aria-label="Search"
                            />
                            {searcheitem && (
                              <button
                                className="ml-2 text-gray-500 hover:text-black px-2"
                                onClick={() => setSearcheitem("")}
                                aria-label="Clear search"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          <div className="">
                            {products
                              .map(accessor)
                              .filter((value, index, self) => self.indexOf(value) === index)
                              .filter(value => !searcheitem || value.toLowerCase().includes(searcheitem.toLowerCase()))
                              .map((value, index) => (
                                <div
                                  key={index}
                                  className="p-2 hover:bg-blue-100 cursor-pointer"
                                  onClick={() => {
                                    setSearcheitem("");
                                    if (!filters[key].includes(value)) {
                                      setFilters((prev) => ({
                                        ...prev,
                                        [key]: [...prev[key], value],
                                      }));
                                    }
                                  }}
                                >
                                  {value}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Single-Select for Sustainable */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Sustainable</label>
                  <select
                    name="sustainable"
                    value={filters.sustainable}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* Form Buttons */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full px-4 py-2 danger hover:bg-red-700 rounded-lg text-white"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 success text-white rounded-lg hover:bg-green-700"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      )}

      {/* Toast Notification */}
      {ShowNotification ? (
        <div className={`fixed top-20 right-5  text-white px-4 py-2 rounded-lg shadow-lg ${notification.type === "success" ? "success" : "danger"}`}>
          {notification.message}
        </div>
      ) : null}
      <div
        className={`transform transition-all duration-700 ease-out h-full 
        ${isvisible ? "translate-y-0 opacity-100" : "translate-y-96 opacity-0"} 
        text-white p-6 rounded-lg`}
      >
        {filteredProducts ? (
          <AutoSizer >
            {({ height, width }) => {
              const grid_height = Math.max(window.innerHeight * 4 / 5)
              const columncount = Math.floor(window.innerWidth / CARD_WIDTH);
              const rowCount = Math.ceil(filteredProducts.length / columnCount);

              return (
                <div>
                  <Grid
                    columnCount={columncount}
                    columnWidth={width / columncount}
                    height={grid_height}
                    rowCount={rowCount}
                    rowHeight={CARD_HEIGHT}
                    width={width}
                    style={{
                      overflowY: 'auto',
                      backgroundColor: 'transparent',

                    }}
                  >
                    {Cell}
                  </Grid>
                </div>
              );
            }}
          </AutoSizer>
        ) : (
          loading && <Loading />
        )}
      </div>
    </div>
  );
};

export default Home;
