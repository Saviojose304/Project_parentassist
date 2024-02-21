import { useState, useEffect } from "react";
import { BsClockFill } from "react-icons/bs";
import geernTick from '../../assets/images/greenTickIcon.png'
import axios from "axios";
function RequestAndAcceptList() {

  const token = localStorage.getItem('token');
  const parsedToken = JSON.parse(token);

  const user_id = parsedToken.userId;
  const [serviceList, setServiceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilteredService] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/getRequsetServicesList?user_id=${user_id}`);
        setServiceList(response.data);
      } catch (error) {
        console.error('Error fetching service list:', error);
      }
    };

    fetchData();
  }, [user_id])

  console.log(serviceList);


  const handleSearch = (value) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredService([]);
    } else {
      const filtered = serviceList.filter((item) =>
        item.status.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredService(filtered);
    }
  };

  const formatDateString = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };


  const serviceToRender = searchTerm ? filterService : serviceList;


  const handleSubmit = async (item) => {
    try {
      const initiatePaymentResponse = await axios.post("http://localhost:9000/initiate-payment", {
        amount: item.amount,
        date: new Date().toISOString(), // Pass the desired date
      });

      const { order_id } = initiatePaymentResponse.data;
      // console.log(order_id);

      const options = {
        key: "rzp_test_9jMMbEMH5GTU9V",
        amount: item.amount * 100, // Amount in paise (100 paise = 1 INR)
        currency: "INR",
        name: "ParentAssist",
        description: "Service Bill Payment",
        order_id: order_id,
        handler: async (response) => {
          //console.log(totalBillAmount);
          try {
            // Send the payment response to your backend for verification
            const paymentResponse = await axios.post("http://localhost:9000/verify-service-payment", {
              razorpay_order_id: response.razorpay_order_id,
              amount: item.amount,
              date: new Date().toISOString(),
              sp_id:item.sp_id,
              srq_id: item.srq_id,
              srqa_id:item.srqa_id,
              status: response.razorpay_signature,
              serviceName: item.service_name
            });
            console.log("Payment Response:", paymentResponse.data);

            // Update payment status
            setPaymentStatus(true);
          } catch (error) {
            console.error("Payment Verification Error:", error);
            // Handle payment verification error
            setPaymentStatus("failed");
          }
        },
        // prefill: {
        //     name: "Gaurav Kumar",
        //     email: "gaurav.kumar@example.com",
        //     contact: "9000090000",
        // },
        // notes: {
        //     address: "Razorpay Corporate Office",
        // },
        theme: {
          color: "#3399cc",
        },
      };

      // Create a new Razorpay instance with the options
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open(); // Open the Razorpay payment dialog

      // ... create Razorpay instance ...
    } catch (error) {
      console.error("Error initiating payment:", error);
      // Handle payment initiation error
    }
  };

  return (
    <>
      <div className="md:flex flex-col md:flex-row mt-24 lg:mt-0 items-center justify-between mb-4">
        <div className="w-2/3">
          <h2 className="md:text-3xl font-bold text-xl mb-2 md:mb-0">
            Request List
          </h2>
        </div>
        <input
          type="text"
          placeholder="Search by Status.."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="bodrder md:w-80 w-full md:max-w-sm h-12 md:ml-4 md:px-5 px-2 py-1 rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        {serviceToRender && serviceToRender.length > 0 ? (
          serviceToRender.map((item, index) => (
            <>
              <div key={index} className="relative border border-gray-400 rounded-lg p-4 hover:shadow-md transition duration-300"
                style={{
                  boxShadow: "5px 5px 12px 0px rgba(173, 216, 230, 0.9)",
                }}>
                <div className="top-0 right-0 p-2 flex items-center absolute">
                  {item.status === "Approved" ? (
                    <>
                      <img
                        src={geernTick}
                        alt="Thumbnail"
                        className="w-10 h-10 object-cover rounded ml-2"
                      />
                      <span className="text-gray px-2 py-1 rounded">
                        Status: Approved
                      </span>
                    </>
                  ) : (
                    <>
                      <div
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span className="object-cover rounded ml-2">
                          {<BsClockFill />}
                        </span>
                        <span className="text-gray px-2 py-1 rounded">
                          Status: {item.status}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-4 border rounded-md bg-white">
                  <h2 className="text-xl font-semibold mb-2">{item.service_name}</h2>
                  <p className="text-gray-600 mb-2">Service Description: {item.service_dec}</p>
                  <p className="text-gray-700 mb-2">
                    {item.name ? (
                      <>
                        Service Provider : {item.name}
                      </>
                    ) : ("")}
                  </p>
                  <p className="text-gray-700 mb-2">
                    {item.phn_num ? (
                      <>
                        Phone : {item.phn_num}
                      </>
                    ) : ("")}
                  </p>

                  <p className="text-gray-700 mb-2">
                    {item.adhar_number ? (
                      <>
                        Adhar Number : {item.adhar_number}
                      </>
                    ) : ("")}
                  </p>

                  <p className="text-gray-700 mb-2">
                    {item.adhar_card ? (
                      <>
                        ID Proof : <a href={`http://localhost:9000/${item.adhar_card}`} target="_blank" rel="noopener noreferrer" className="btn btn-danger mx-2 w-20  mt-3">
                          <i class="bi bi-file-arrow-down-fill"></i>
                        </a>
                      </>
                    ) : ("")}
                  </p>

                  <p className="text-gray-700 mb-2">
                    {item.amount ? (
                      <>
                        Amount to be Paid : {item.amount}
                      </>
                    ) : ("")}
                  </p>

                  <p className="text-gray-700 mb-2">
                    {item.invoice ? (
                      <>
                        Invoice : <a href={`http://localhost:9000/${item.invoice}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20  mt-3">
                          <i class="bi bi-file-arrow-down-fill"></i>
                        </a>
                      </>
                    ) : ("")}
                  </p>



                  <p className="text-gray-700 mb-2">
                    {item.date === 'No' || item.date === null ? (
                      ""
                    ) : (
                      <p className="text-gray-700">Date: {formatDateString(item.date)}</p>
                    )}
                  </p>

                  {item.name ? (
                    <>
                      <div className="text-center">
                        <button
                          type="submit"
                          onClick={() => handleSubmit(item)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                          Accept
                        </button>
                      </div>
                    </>
                  ) : ("")}


                </div>
              </div>
            </>
          ))
        ) : (
          <p>No data found</p>
        )}
      </div>

    </>
  );
}

export default RequestAndAcceptList;