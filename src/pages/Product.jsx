import React, { useEffect, useState } from "react";
import DjangoConfig from "../config/config";
import BackButton from "../components/Backbutton";
import { Edit, Filter, FolderPlus } from 'lucide-react';
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import addProduct from "../redux/features/Products/thunks/addProduct";
import editProduct from "../redux/features/Products/thunks/editProduct";
import fetchProducts from "../redux/features/Products/thunks/fetchProducts";
import { MaterialReactTable } from "material-react-table";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import Qrcodecomp from "../components/Qrcodecomp";

const Product = () => {
  const products = useSelector((state) => state.products.items);// product from redux
  const [showQR, setShowQR] = useState(false)// barcode show
  const [showfilters, setShowfilters] = useState(false)// filter show
  const [filteredProducts, setFilteredProducts] = useState([]);//filrtered product 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);// to pass an singular product
  const [showAddModal, setShowAddModal] = useState(false);//to show add or edit form
  const [ShowNotification, setShowNotification] = useState(false);// to show notification
  const [notification, setNotification] = useState({ message: "", type: "success" });//notification content and type
  const [searcheitem, setSearcheitem] = useState("");//search item
  const [isvisible, setIsvisible] = useState(false);
  const [showisdownload, setShowisdownload] = useState(false);
  const [isdownload, setisDownload] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        dispatch(fetchCartItems());
        await dispatch(fetchProducts()).unwrap();
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



  // form data 
  const [formData, setFormData] = useState({
    product_code: "",
    style_no: "",
    product_type: "",
    designer_head: "",
    entered_by: "",
    category: "",
    season: "",
    fabric: "",
    value_driver: "",
    sustainable: false,
    designer_status: "",
    dmm_status: "",
    remarks: "",
    comment: "",
    is_active: true,
    main_image: "",
    inspiration_image: "",
    front_image: "",
    details_image: "",
    back_image: "",
    sleeve_image: "",
    fabric_image: "",
  });

  //filter form data
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

  const capitalizeFirstLetter = (str) => { // capitalize first letter
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handlenotification = async () => {
    setShowNotification(true); // Show the notification
    setTimeout(() => {
      setShowNotification(false); // Hide the notification after 3 seconds
    }, 900);

  }
  const openModal = (product) => {
    setSelectedProduct(product);
    // Set the form data, including the converted files
    setFormData({
      product_code: product.product_code || "",
      style_no: product.style_no || "",
      product_type: product.product_type || "",
      designer_head: product.designer_head || "",
      entered_by: product.entered_by || "",
      category: product.category || "",
      season: product.season || "",
      fabric: product.fabric || "",
      value_driver: product.value_driver || "",
      sustainable: product.sustainable || false,
      designer_status: product.designer_status || "",
      dmm_status: product.dmm_status || "",
      remarks: product.remarks || "",
      comment: product.comment || "",
      is_active: product.is_active || true,
      main_image: product.main_image || "",
      inspiration_image: product.inspiration_image || "",
      front_image: product.front_image || "",
      details_image: product.details_image || "",
      back_image: product.back_image || "",
      sleeve_image: product.sleeve_image || "",
      fabric_image: product.fabric_image || "",
    });

    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedProduct(null); // Clear selected product
    setFormData({
      product_code: "",
      style_no: "",
      product_type: "",
      designer_head: "",
      entered_by: "",
      category: "",
      season: "",
      fabric: "",
      value_driver: "",
      sustainable: false,
      designer_status: "",
      dmm_status: "",
      remarks: "",
      comment: "",
      is_active: true,
      main_image: "",
      inspiration_image: "",
      front_image: "",
      details_image: "",
      back_image: "",
      sleeve_image: "",
      fabric_image: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFile = files.length > 0 ? files[0] : null;

    setFormData({
      ...formData,
      [name]: selectedFile,
    });
  };
  // handle new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addProduct(formData)).unwrap();
      setNotification({ message: "product added successfully", type: "success" });
      handlenotification();
    } catch (err) {
      setNotification({ message: "failed to add product", type: "error" });
      handlenotification();
    }
    closeAddModal();
  };
  // handle edit product data
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editProduct({ id: selectedProduct.id, formData })).unwrap();
      setNotification({ message: "product edit successfully", type: "success" })
      handlenotification();
    } catch (err) {
      setNotification({ message: "failed to edit product ", type: "error" })
      handlenotification();
    }
    closeAddModal();

  };

  const isImage = (value) => { //check image type
    return value instanceof File || value instanceof Blob;
  };
  //serch product
  const setSearchQuery = (value) => {
    setFilteredProducts(() => {
      if (value.toLowerCase() === 'yes') {
        return [...products].filter((product) => product.sustainable === true);
      } else if (value.toLowerCase() === 'no') {
        return [...products].filter((product) => product.sustainable === false);
      } else {

        return [...products].filter((product) => {
          return (
            product.style_no?.toLowerCase().includes(value.toLowerCase()) ||
            product.designer_head?.toLowerCase().includes(value.toLowerCase()) ||
            product.product_type?.toLowerCase().includes(value.toLowerCase()) ||
            product.category?.toLowerCase().includes(value.toLowerCase()) ||
            product.season?.toLowerCase().includes(value.toLowerCase()) ||
            product.fabric?.toLowerCase().includes(value.toLowerCase()) ||
            product.dmm_status?.toLowerCase().includes(value.toLowerCase()) ||
            product.comment?.toLowerCase().includes(value.toLowerCase()) ||
            product.product_code?.toLowerCase().includes(value.toLowerCase()) ||
            product.entered_by?.toLowerCase().includes(value.toLowerCase()) ||
            product.remarks?.toLowerCase().includes(value.toLowerCase()) ||
            product.designer_status?.toLowerCase().includes(value.toLowerCase()) ||
            product.value_driver?.toLowerCase().includes(value.toLowerCase())

          )
        });
      }
    });
  };
  //setfilters
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
  //filter products
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
    setFilteredProducts(filteredData);
    setShowfilters(false);
  };

  const handleQR = (data) => {
    setSelectedProduct(data)
    setShowQR(!showQR)
  };


  //download filtered products as excel handler
  const generateExcelFile = async () => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "Product Code", key: "product_code" },
      { header: "Style No", key: "style_no" },
      { header: "Product Type", key: "product_type" },
      { header: "Designer Head", key: "designer_head" },
      { header: "Entered By", key: "entered_by" },
      { header: "Category", key: "category" },
      { header: "Season", key: "season" },
      { header: "Fabric", key: "fabric" },
      { header: "Value Driver", key: "value_driver" },
      { header: "Sustainable", key: "sustainable" },
      { header: "Designer Status", key: "designer_status" },
      { header: "DMM Status", key: "dmm_status" },
      { header: "Remarks", key: "remarks" },
      { header: "Comment", key: "comment" },
      { header: "Is Active", key: "is_active" },
      { header: "Main Image", key: "main_image" },
    ];

    try {
      const modifiedData = await Promise.all(
        filteredProducts.map(async (entry) => {
          const { inspiration_image, front_image, details_image, back_image, sleeve_image, fabric_image, ...cleanedEntry } = entry;

          let thumbnail = null;
          if (entry.main_image) {
            try {
              thumbnail = await convertImageToThumbnail(entry.main_image);
            } catch (error) {
              console.error("Image processing failed:", error);
            }
          }

          return { ...cleanedEntry, main_image: thumbnail };
        })
      );

      modifiedData.forEach((entry, index) => {
        const row = worksheet.addRow(entry);

        if (entry.main_image) {
          try {
            const base64Data = entry.main_image.split(",")[1];
            const imageId = workbook.addImage({
              base64: base64Data,
              extension: "png",
            });
            worksheet.addImage(imageId, {
              tl: { col: 15, row: index + 1 }, // Adjusted row index
              ext: { width: 15, height: 15 }, // Increased size for better visibility
            });
          } catch (error) {
            console.error("Error embedding image:", error);
          }
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "products_data.xlsx");

    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  // Convert image to thumbnail format
  const convertImageToThumbnail = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Handle CORS issues
      img.src = `${DjangoConfig.apiUrl}${imageUrl}`

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, 0, 0, size, size);

        const thumbnail = canvas.toDataURL("image/png");
        resolve(thumbnail);
      };

      img.onerror = (error) => {
        console.error("Image loading failed:", error);
        reject(error);
      };
    });
  };


  // table 
  const columns = [
    {
      header: 'Sno',
      accessorKey: 'Sno',
      Cell: ({ row }) => {
        return row.index + 1
      },
      size: 70,
    },
    {
      accessorKey: 'product_code',
      header: 'Product Code',
      size: 120,
      muiTableBodyCellProps: ({ cell }) => ({
        onClick: () => handleQR(cell.row.original),
        style: { cursor: "pointer", color: "green" },
      }),
      //Cell: ({ row }) => (<div onClick={() => handleQR(row.original)}>{row.original.product_code}</div>),
    },
    {
      accessorKey: 'style_no',
      header: 'Style No',
      size: 120,

    },
    {
      accessorKey: 'product_type',
      header: 'Product Type',
      size: 120,

    },
    {
      accessorKey: 'designer_head',
      header: 'Designer Head',
      size: 120,

    },
    {
      accessorKey: 'entered_by',
      header: 'Entered By',
      size: 120,

    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 120,

    },
    {
      accessorKey: 'season',
      header: 'Season',
      size: 120,

    },
    {
      accessorKey: 'fabric',
      header: 'Fabric',
      size: 120,

    },
    {
      accessorKey: 'value_driver',
      header: 'Value Driver',
      size: 120,
    },
    {
      accessorKey: 'sustainable',
      header: 'Sustainable',
      size: 120,
      Cell: ({ row }) => {
        const sustainable = row.original.sustainable;
        return sustainable ? 'Yes' : 'No';
      },
    },
    {
      accessorKey: 'designer_status',
      header: 'Designer Status',
      size: 120,

    },
    {
      accessorKey: 'dmm_status',
      header: 'Merchant Status',
      size: 120,

    },
    {
      accessorKey: 'remarks',
      header: 'Remarks',
      size: 120,

    },
    {
      accessorKey: 'action',
      header: 'Action',
      Cell: ({ row }) => (
        <button onClick={() => openModal(row.original)} color="primary">
          <Edit />
        </button>
      ),
      size: 120,
    },
  ];

  if (loading) return <div><BackButton /><Loading /></div>;

  // if (error)
  //   return (
  //     <div className="p-6 bg-[#f0ebe7] h-auto min-h-full">
  //       <div className="flex  items-center ml-12 mb-5">
  //         <BackButton />
  //         <div className="w-full flex"><h1 className="my-4 mx-auto ">Product Master</h1></div>
  //       </div>
  //       {error && <h2 className="text-center mt-8 text-red-600 animate-bounce">!{error}</h2>}
  //     </div>);


  return (
    <div className="p-6 bg-[#f0ebe7] h-auto min-h-full sm:ml-[60px]">
      <div className="flex  items-center mb-5">
        <BackButton />
        <div className="w-full flex"><h1 className="my-4 mx-auto ">Product Master</h1></div>
      </div>
      {ShowNotification ? (
        <div className={`fixed top-20 right-5  text-white px-4 py-2 rounded-lg shadow-lg ${notification.type === "success" ? "success" : "danger"}`}>
          {notification.message}
        </div>
      ) : null}
      {showisdownload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[200px]">
            <p className="text-lg font-semibold mb-4">Are you sure for download ?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={()=>{setShowisdownload(false),generateExcelFile()}}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={()=>{ setShowisdownload(false)}}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="md:flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <p >Search: </p>
          <input
            type="text"
            placeholder="Search by Product Code, Style No, etc."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-[180px] border border-gray-300 rounded-md bg-slate-50"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowfilters(true)}
            className="px-4 py-2 rounded-lg hover:bg-[#00000077] flex"
          >
            <p className="mt-1 pr-2">Filters:</p><Filter color="#f39c12" size={30} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="py-2 px-4  rounded-md hover:bg-[#00000077]  "
          > <h3 className="flex mr-4"><p className="mt-1 pr-4">Add Product:</p><FolderPlus color="#f39c12" size={30} /></h3>

          </button>
        </div>
      </div>
      {showfilters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 md:p-8 lg:p-16 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-h-[90vh] ">
            <div className="bg-white p-6 rounded-lg w-full mb-10">
              <h2 className="text-xl font-bold mb-4  ">Filter Products</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyFilters();
                }}
                className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-x-5 items-end"
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
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            [`${key}DropdownOpen`]: !prev[`${key}DropdownOpen`],
                          }))
                        }
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
                                    e.stopPropagation();
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
                    onClick={() => setShowfilters(false)}
                    className="w-full px-4 py-2 danger text-white hover:bg-red-700 rounded-lg"
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
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-h-[90vh] overflow-y-auto">
            <div className="w-full bg-white p-4 mb-3">
              <form
                onSubmit={selectedProduct ? handleEditSubmit : handleSubmit}
                className="flex flex-col"
              >
                <h2 className="font-bold text-lg mb-3">
                  {selectedProduct ? "Edit Product" : "Add Product"}
                </h2>

                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-x-5 gap-y-3">
                  {Object.keys(formData).map((key) => {
                    if (["fabric", "remarks", "comment"].includes(key)) {
                      return (
                        <div key={key} className="flex flex-col gap-y-1">
                          <label className="font-semibold">{capitalizeFirstLetter(key.replace(/_/g, " "))}:</label>
                          <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                            className="p-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      );
                    } else if (key.includes("image")) {
                      return (
                        <div key={key} className="flex">
                          <div className="flex flex-col gap-1">
                            <label className="font-semibold">{capitalizeFirstLetter(key.replace(/_/g, " "))}:</label>
                            <input
                              type="file"
                              name={key}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="text-base file:mr-4 file:py-2 file:px-4 file:rounded-md  file:text-sm file:font-semibold file:bg-gray-500 file:text-white hover:file:bg-gray-900 transition"
                            />
                          </div>
                          <div>
                            {formData[key] && (
                              <img
                                className="w-20 h-16 mt-2 rounded-xl"
                                src={isImage(formData[key]) ? URL.createObjectURL(formData[key]) : `${DjangoConfig.apiUrl}${formData[key]}`}
                                alt="N/A"
                              />
                            )}
                          </div>
                        </div>
                      );
                    } else if (["sustainable", "is_active"].includes(key)) {
                      return (
                        <div key={key} className="flex flex-col gap-1">
                          <label className="font-semibold">{capitalizeFirstLetter(key.replace(/_/g, " "))}:</label>
                          <select
                            name={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select an option</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      );
                    } else if (["product_code", "style_no"].includes(key)) {
                      return (
                        <div key={key} className="flex flex-col gap-y-1">
                          <label className="font-semibold">{capitalizeFirstLetter(key.replace(/_/g, " "))}:</label>
                          <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      );
                    } else if (key === "dmm_status") {
                      return (
                        <div key={key} className="flex flex-col gap-y-1">
                          <label className="font-semibold">Merchant Status:</label>
                          <select
                            name={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select an option</option>
                            {[...new Set(products.map(item => item[key]))].map((value, index) => (
                              <option key={index} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                      );
                    } else {
                      return (
                        <div key={key} className="flex flex-col gap-y-1">
                          <label className="font-semibold">{capitalizeFirstLetter(key.replace(/_/g, " "))}:</label>
                          <select
                            name={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select an option</option>
                            {[...new Set(products.map(item => item[key]))].map((value, index) => (
                              <option key={index} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    {selectedProduct ? "Update Product" : "Save Product"}
                  </button>
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/*barcode popup */}
      <div className={` ${showQR ? "inlineblock" : "hidden"}`} ><Qrcodecomp product={selectedProduct} close={handleQR} /></div>

      <div
        className={`transform transition-all duration-700 ease-out h-full 
        ${isvisible ? "translate-y-0 opacity-100" : "translate-y-96 opacity-0"} 
        text-white p-6 rounded-lg`}
      >
        <div className="cell overflow-x-auto  overflow-y-visible relative flex" >
          {/* Virtualized Body */}
          <div style={{ height: "70vh", width: "100%" }} >
            {filteredProducts ? (
              <MaterialReactTable
                columns={columns}
                data={filteredProducts}
                enablePagination={false}
                enableRowVirtualization={true}
                enableSorting={false}
                enableColumnFilter={false}
                renderTopToolbarCustomActions={() => (
                  <div className="flex justify-end w-full">
                    <button className="success p-2  top-4 sm:text-sm md:text-md text-[10px] rounded-md text-white" onClick={()=>setShowisdownload(true)}>
                      Export
                    </button>
                  </div>
                )}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: "rgb(51 65 85)",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    "&:last-child": {
                      color: " rgb(79 70 229)",
                      fontWeight: "bold",
                    },
                    fontSize: "10px",
                    color: "#333",
                    border: "1px solid #ddd",
                  },
                }}
              />
            ) : ("")}

          </div>

        </div>
      </div>
    </div>


  );
};

const modalStyles = {
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "5px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  checkbox: {
    display: "flex",
    columnGap: "20px",
    alignItems: "center",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "30px",
  },
  submitButton: {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Product;