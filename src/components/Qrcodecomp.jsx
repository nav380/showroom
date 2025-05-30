import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const Qrcodecomp = ({ product, close }) => {
  const qrvalue = product ? (product.product_code) : "";

  return (<div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div
      aria-modal="true"
      className="relative w-full lg:w-1/2 bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-200 "
    >
      <div className="flex flex-row-reverse h-8 border-b">
        <button
          onClick={close}
          className=" h-4 w-8   mr-4 text-gray-400 hover:text-gray-700 mt-1 rounded-full"
        >
          x
        </button>
      </div>
      <div className="w-64 mx-auto ">
        <h2 className="text-center">{qrvalue}</h2>
        <QRCodeCanvas value={qrvalue} size={250} className="border-2 border-slate-300 rounded-lg my-4" />
      </div>
    </div>
  </div>


  );
};

export default Qrcodecomp;

