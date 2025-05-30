import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../components/Backbutton'
import { CircleCheck, FileDown, Maximize, Maximize2, Minimize2 } from 'lucide-react'
import { useSelector } from 'react-redux';
import DjangoConfig from '../config/config';
import axios from 'axios';



export const Export = () => {
  const [covers, setCover] = useState([])//all covers
  const [coverimage, setCoverImage] = useState("/images/cover.jpeg");// cover to print
  const [error, setError] = useState(false); // Error state
  const cart = useSelector(state => state.cart.items); // Get the cart items from Redux state
  const [isvisible, setIsvisible] = useState(false);

  useEffect(() => {
    const fatchcovers = async () => {
      try {
        const response = await axios.get(`${DjangoConfig.apiUrl}/main/product/covers`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        setCover(response.data);  // Return all covers
        setError(false);
      } catch (e) {
        console.error(e);
      }

    }
    fatchcovers()
    setInterval(() => {
      setIsvisible(true)
    }, 200);
  }, [])

  const generatePDF = () => {
    const printContent = document.getElementById('pdf');
    const printCover = document.getElementById('cover');
    const printWindow = window.open('', '', 'height=600, width=800');

    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>button{display: none;} .mainimage{display:flex} .imagecontainer{ display: flex; flex-wrap: wrap;} img{height:250px;width:150px;margin:2px;padding:2px} @media print { .no-print { display: none; } .page-break-before {page-break-before: always; }  }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printCover.innerHTML);

    printWindow.document.write(printContent.innerHTML);

    printWindow.document.write('</body></html>');
    printWindow.document.close(); // Important for printing
    printWindow.print();
  };

  const card = (item, index) => {
    const [image, setImage] = useState([
      { key: "fabric", src: item.fabric_image, alt: "Fabric Image", visible: true },
      { key: "front", src: item.front_image, alt: "Front Image", visible: true },
      { key: "sleeve", src: item.sleeve_image, alt: "Sleeve Image", visible: true },
      { key: "back", src: item.back_image, alt: "Back Image", visible: true },
      { key: "detail", src: item.details_image, alt: "Detail Image", visible: true },
      { key: "inspiration", src: item.inspiration_image, alt: "Inspiration Image", visible: true },
    ]);

    const [main, setMain] = useState(false);

    // Function to toggle image visibility
    const toggleImageVisibility = (key) => {
      setImage((prev) =>
        prev.map((img) => (img.key === key ? { ...img, visible: !img.visible } : img))
      );
    };

    const dateOnly = new Date(item.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });

    const ImageCard = ({ src, alt, imageKey, visible }) => (
      <div className={`relative overflow-hidden rounded-lg ${!visible ? "opacity-25 no-print" : "opacity-100"}`}>

        <img
          src={`${DjangoConfig.apiUrl}${src}`}
          alt={alt}
          className={`w-[35vw] md:w-[25vw] lg:w-[10vw] h-[15vh] md:h-[20vh] lg:h-[20vh]" object-cover bg-red-200`}
          onClick={() => toggleImageVisibility(imageKey)}
        />
        <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-[10px] sm:text-xs text-white font-medium truncate">
            {alt}
          </p>
        </div>
        <button className="absolute bottom-0 right-0">
          {visible ? (
            <CircleCheck color="white" className="bg-green-500 rounded-full" />
          ) : (
            <CircleCheck />
          )}
        </button>
      </div>
    );

    return (
      < div key={index} className="w-100% ml-4 group rounded-3xl bg-white md:m-4 pb-4 page-break-before mx-2" >
        <div className='m-2'>
          <div className='md:flex sm:block pt-4 justify-around'>
            <div className='md:w-64 px-4'>
              <p className=" text-gray-600   flex justify-between">
                <span className="font-bold">Style:</span>
                <span>{item.style_no || "N/A"}</span>
              </p>
              <p className="text-gray-600  flex justify-between">
                <span className="font-bold">Code:</span>
                <span>{item.product_code || "N/A"}</span>
              </p>
            </div>
            <div className='w-[1px] bg-slate-500'></div>
            <div className='md:w-64 px-4 ' >
              <p className="text-gray-600  flex justify-between">
                <span className="font-bold">Code:</span>
                <span>{item.product_code || "N/A"}</span>
              </p>
              <p className="text-gray-600 flex justify-between">
                <span className="font-bold">Remarks:</span>
                <span>{item.remarks || "N/A"}</span>
              </p>
            </div>
            <div className='w-[1px] bg-slate-500 '></div>
            <div className='md:w-64 px-4'>
              <p className="text-gray-600  flex justify-between">
                <span className="font-bold">DMM:</span>
                <span>{item.dmm_status || "N/A"}</span>
              </p>
              <p className="text-gray-600  flex justify-between">
                <span className="font-bold">Date:</span>
                <span>
                  {dateOnly}

                </span>
              </p>

            </div>


          </div>
          <div className='md:flex sm:block pt-4 gap-4 w-full mainimage overflow-x-auto' >{/*image container */}
            <div
              className={`p-4 border-2 border-slate-200 mx-auto mt-2 relative overflow-x-auto  rounded-lg ${main ? "opacity-25 no-print" : "opacity-100"}`}
            >
              <div className='relative overflow-hidden rounded-lg'>
                <img
                  src={`${DjangoConfig.apiUrl}${item.main_image}`}
                  alt={`Product ${item.style_no || "N/A"}`}
                  className="w-full md:w-[30vw] lg:w-[20vw] h-[40vh] md:h-[30vh] lg:h-[45vh] bg-red-200 rounded-lg mainimage bg-cover"
                  onClick={() => setMain(!main)}
                />

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
                  <p className="text-[10px] sm:text-xs text-white font-medium truncate">
                    Main Image
                  </p>
                </div>

                {/* Button */}
                <button className="absolute bottom-0 right-0">
                  {main ? (
                    <CircleCheck />
                  ) : (
                    <CircleCheck color="white" className="bg-green-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            <div className=' grid lg:grid-rows-2 lg:grid-flow-col grid-cols-2 gap-8 border-2 mx-auto mt-2 border-slate-200 p-4 rounded-lg imagecontainer'>

              {image.map(({ key, src, alt, visible }) => (
                <ImageCard key={key} src={src} alt={alt} imageKey={key} visible={visible} />
              ))}

            </div>
          </div>
        </div>
      </div>
    )

  }

  return (
    <div className=' sm:ml-[50px] p-2 bg-[#f0ebe7] min-h-full h-auto'>
      <div className="flex justify-between ">
        <div className='ml-4'><BackButton /></div>
        <h1>Export items</h1>
        <div>
          <button className=' flex  justify-center rounded-lg p-1 md:text-lg hover:bg-[#00000077]'
            onClick={generatePDF}> Download:<FileDown color="#f39c12" size={22} />
          </button>
        </div>
      </div>
      <div className='h-auto md:flex  border-2 border-slate-200 mt-12 bg-white rounded-lg' > {/*to set cover page*/}
        {covers.map((item) => {
          return (
            <div className=' mx-2 p-1'>
              <img src={item.cover} className='w-40 h-20' onClick={() => setCoverImage(item.cover)}>
              </img>{coverimage != item.cover ? ("") : (<CircleCheck color="white " className="bg-green-500 rounded-full z-20 " />)}</div>
          )
        })}
      </div>
      <div id="cover" >
        <img src={coverimage} className='mx-auto object-cover hidden' style={{ width: "100%", height: "100%" }}></img>
      </div>
      <div
        className={`transform transition-all duration-700 ease-out h-full 
        ${isvisible ? "translate-y-0 opacity-100" : "translate-y-96 opacity-0"} 
        text-white p-6 rounded-lg`}
      >
        <div className='w-[100%] mx-2 ' id='pdf'>
          {/*to display cover page*/}
          {cart.length>0 ? (
            <div >
              {cart.map((item, index) => (// replace result with cart.item
                card(item, index) // Render each card with item details and remove button

              ))}
            </div>
          ) : (
            <h2 className="text-center mt-8 animate-bounce" style={{color:"blue"}}>! First add item in cart !</h2>
          )}
        </div>
      </div>

    </div>
  )
}