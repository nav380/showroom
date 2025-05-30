import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import patchProduct from "../redux/features/Products/thunks/patchProduct";

const Changedmm = ({ product, close ,check}) => {
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();

  const [formData, setForm] = useState({
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlesubmit = async () => {
    try {
      await dispatch(
        patchProduct({
          id: product.id,
          formData: {
            ...formData,
          },
        })
      )
        .unwrap()
        close({ message: "DMM status updated successfully", type: "success" });
    } catch (err) {
      close({ message: "failed to update status", type: "danger" });
    };
    
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full  bg-black/50 backdrop-blur-sm animate-in fade-in duration-700 z-50">
      <div className="float-right mr-2 mt-20">
        <button
          className="bg-red-500 rounded-full w-8 h-8"
          onClick={()=>close({ message: "No chnage detected", type: "success" })}
        >
          x
        </button>
      </div>
      {check}
      <div className="mx-auto mt-48 lg:w-1/2 sm:w-3/4 w-auto bg-white p-4 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className=" font-semibold">Change DMM Status</h2>
        </div>
        <div className="flex md:gap-10 gap-4 justify-center items-center h-48 px-4">
          <div>
            <h3 className="font-medium">Merchant Status*</h3>
            <select
              name="dmm_status"
              className="border-2 border-black bg-white rounded-md w-auto md:w-60 h-10"
              value={formData.dmm_status}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select a status
              </option>
              {products
                .map(product => product.dmm_status)  // Extract dmm_status values
                .filter((value, index, self) => self.indexOf(value) === index)  // Filter unique values
                .map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <h3 className="font-medium">Comment</h3>
            <input
              name="comment"
              className="border-2 border-black bg-white rounded-md w-40 md:w-60 h-10"
              value={formData.comment}
              onChange={handleInputChange}
              type="text"
            />
          </div>
        </div>
        <div className="flex justify-center items-center text-lg">
          <button
            className="bg-yellow-400 rounded-md w-36 h-12 font-semibold"
            onClick={handlesubmit}
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default Changedmm;
