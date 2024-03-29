import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { BsClockFill } from "react-icons/bs";
import geernTick from '../../assets/images/greenTickIcon.png'
import axios from "axios";
import { toast } from "react-toastify";
function ServiceProviderHomePage() {
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);
    const user_id = parsedToken.userId;

    // console.log(parsedToken);

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [acceptedServices, setAcceptedServices] = useState([]);
    const [requestedServices, setRequestedServices] = useState([]);
    const [selectedDates, setSelectedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState("NO");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [amountError, setAmountError] = useState('');
    const [selectedDateToChange, setSelectedDateToChange] = useState("");

    const [error, setError] = useState('');


    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const user_role = token.role;
        if (token !== null && user_role == 'SRVCPRVDR') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            axios.get(`http://13.233.162.230:9000/getRequestServices?user_id=${user_id}`)
                .then((response) => {
                    if (response.status === 200) {
                        const services = response.data;
                        console.log(response.data);
                        setServiceList(response.data);
                        const accepted = services.matchingServiceRequests.filter(service => service.status === "Approved");
                        const requested = services.matchingServiceRequests.filter(service => service.status === "Requested" || service.status === "pending");

                        setAcceptedServices(accepted);
                        setRequestedServices(requested);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching doctor visit details:", error);
                });
        };

        fetchData();
    }, []);

    console.log(serviceList);

    const logOut = async () => {
        try {
            googleLogout();
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleService = () => {
        navigate("/AddService");
    }
    const handleServiceList = () => {
        navigate("/ServiceProviderHomePage")
    }

    const formatDateString = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleRadioChange = (value, index) => {
        setSelectedDateToChange(value);
        setSelectedDates((prevDates) => {
            return { ...prevDates, [index]: value };
        });
    };

    const handleDateChange = (value, index) => {
        setSelectedDateToChange(value);
        setSelectedDates((prevDates) => {
            return { ...prevDates, [index]: value };
        });
    };

    const handleAmountChange = (value, index) => {
        // Use a regular expression to allow only numeric values
        const numericValue = value.replace(/[^0-9]/g, '');
    
        if (value !== numericValue) {
            setAmountError('Please enter only numbers');
        } else if (parseInt(numericValue) > 200000) {
            setAmountError('Please enter an amount under 200000');
        } else {
            setAmountError('');
        }
    
        setSelectedAmount((prevAmounts) => {
            return { ...prevAmounts, [index]: numericValue };
        });
    };
    


    const handleAddInvoice = async (serviceId, index, serviceName) => {
        try {

            // console.log(selectedAmount);
            if (!selectedFile) {
                setIsModalOpen(true);
                return;
            }

            const formattedDate = selectedDateToChange === 'No' ? "No" : formatDate(selectedDateToChange);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('srq_id', serviceId);
            formData.append('amount', selectedAmount[index]);
            formData.append('date', formattedDate);
            formData.append('userId', parsedToken.userId);
            formData.append('serviceName', serviceName);

            const submitResponse = await axios.post(`http://13.233.162.230:9000/acceptRequest`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (submitResponse.status === 200) {
                toast.success('Invoice added successfully!');
                setIsModalOpen(false);
                window.location.reload();
            } else {
                toast.error('Error adding invoice');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error === 'Invoice already submitted for this request') {
                toast.error("Invoice already submitted for this request");
            } else {
                toast.error("Failed to add service. Please try again.");
            }
        }
    };

    // Function to format the date to 'YYYY/MM/DD'
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Validate the file type
        if (file && file.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
        } else {
            setSelectedFile(file);
            setError('');
        }
    };

    const handleSubmit = () => {
        // Handle the file upload logic here
        if (selectedFile) {
            // Your file upload logic here
            console.log('Uploading file:', selectedFile);
            setIsModalOpen(false)
        } else {
            toast.warning('Please select a PDF file');
        }


    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleProfile = () => {
        navigate('/ServiceProviderProfilePage')
    }



    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3 py-2">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" >{parsedToken ? parsedToken.userName : 'Name'}</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <div className='row  d-flex'>
                <div className='col-2' id="sidebar-nav">
                    <div className="container pt-5">
                        <div className="row flex-nowrap" >
                            <div className=" px-0">
                                <div id="sidebar" className='show border-end pt-2'>
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleProfile} >
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span>View Profile</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleService}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-house-gear-fill"><span>Add Service</span></i>
                                            </a>
                                        </button>

                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleServiceList}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-list-columns"><span className=" ml-2">Service List</span></i>
                                            </a>
                                        </button>
                                        {/* <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span></span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-file-earmark-pdf"><span>Reports</span></i>
                                            </a>
                                        </button> */}
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={logOut}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-box-arrow-right"><span>Logout</span></i>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div style={{ paddingTop: '5rem' }} className='col-10'>
                    <div className="container">

                        <div className=" w-2/3   shadow-md shadow-gray-400 rounded-md mt-28 lg:mt-12 bg-white mx-auto ">
                            <div className="w-full bg-blue-700 text-white font-semibold text-xl  text-center px-3 py-4">
                                Service Accept List
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {acceptedServices && acceptedServices.length > 0 ? (
                                    acceptedServices.map((service, index) => (
                                        <div key={index} className="relative border border-gray-400 rounded-lg p-4 hover:shadow-md transition duration-300"
                                            style={{
                                                boxShadow: "5px 5px 12px 0px rgba(173, 216, 230, 0.9)",
                                            }}>


                                            <div className="top-0 right-0 p-2 flex items-center absolute">

                                                <img
                                                    src={geernTick}
                                                    alt="Thumbnail"
                                                    className="w-10 h-10 object-cover rounded ml-2"
                                                />
                                                <span className="text-gray px-2 py-1 rounded">
                                                    Status: Approved
                                                </span>
                                            </div>
                                            <div className="p-4 border rounded-md bg-white">
                                                <h2 className="text-xl font-semibold mb-2">{service.service_name}</h2>
                                                <p className="text-gray-600 mb-2">Service Description: {service.service_dec}</p>
                                                <p className="text-gray-700 mb-2">Location: {service.location}</p>
                                                <p className="text-gray-700 mb-2">Address: {service.address}</p>
                                                <p className="text-gray-700 mb-2">Phone: {service.phone}</p>
                                                <p className="text-gray-700">Date: {formatDateString(service.date)}</p>

                                            </div>


                                        </div>
                                    ))
                                ) : (
                                    <p className="flex justify-center text-center">Nothing to show</p>
                                )}
                            </div>

                        </div>

                        <div className=" w-2/3   shadow-md shadow-gray-400 rounded-md mt-28 lg:mt-12 bg-white mx-auto mb-4 ">
                            <div className="w-full bg-blue-700 text-white font-semibold text-xl  text-center px-3 py-4">
                                Service Request List
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {requestedServices && requestedServices.length > 0 ? (
                                    requestedServices.map((service, index) => (
                                        <div key={index} className="relative border border-gray-400 rounded-lg p-4 hover:shadow-md transition duration-300"
                                            style={{
                                                boxShadow: "5px 5px 12px 0px rgba(173, 216, 230, 0.9)",
                                            }}>


                                            <div className="top-0 right-0 p-2 flex items-center absolute">
                                                <div
                                                    style={{ display: "flex", alignItems: "center" }}
                                                >
                                                    <span className="object-cover rounded ml-2">
                                                        {<BsClockFill />}
                                                    </span>
                                                    <span className="text-gray px-2 py-1 rounded">
                                                        Status: {service.locationStatus}
                                                    </span>
                                                </div>

                                            </div>
                                            <div className="p-4 border rounded-md bg-white">
                                                <h2 className="text-xl font-semibold mb-2">{service.service_name}</h2>
                                                <p className="text-gray-600 mb-2">Service Description: {service.service_dec}</p>
                                                <p className="text-gray-700 mb-2">Location: {service.location}</p>
                                                <p className="text-gray-700 mb-2">Address: {service.address}</p>
                                                <p className="text-gray-700 mb-2">Phone: {service.phone}</p>
                                                <p className="text-gray-700">Date: {formatDateString(service.date)}</p>


                                                <div className="mt-4">
                                                    <label className="mr-2">Amount:</label>
                                                    <input
                                                        type="text"
                                                        value={selectedAmount[index] || ''}
                                                        onChange={(e) => handleAmountChange(e.target.value, index)}
                                                        placeholder="Enter amount"
                                                        required
                                                        className="w-full lg:w-2/3"
                                                    />
                                                    {amountError && <p className="text-red-500">{amountError}</p>}
                                                </div>


                                                {/* Radio button for changing the date */}
                                                <div className="flex items-center mt-4">
                                                    <label className="mr-4 font-semibold">Do you want to change the date?</label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={`yes-${index}`}
                                                            name={`changeDate-${index}`}
                                                            value="yes"
                                                            className="mr-2"
                                                            onChange={() => handleRadioChange('yes', index)}
                                                        />
                                                        <label htmlFor={`yes-${index}`} className="cursor-pointer">
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center ml-4">
                                                        <input
                                                            type="radio"
                                                            id={`no-${index}`}
                                                            name={`changeDate-${index}`}
                                                            value="no"
                                                            className="mr-2"
                                                            onChange={() => {
                                                                handleRadioChange('no', index);
                                                                handleDateChange('No', index); // Set date to "No" when selecting "No"
                                                            }}
                                                        />
                                                        <label htmlFor={`no-${index}`} className="cursor-pointer">
                                                            No
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Date picker for changing the date */}
                                                {selectedDates[index] === 'yes' && (
                                                    <div className="mt-4">
                                                        <label className="mr-2">Select Date:</label>
                                                        <input
                                                            type="date"
                                                            value={selectedDates[index] === 'No' ? 'No' : selectedDates[index]}
                                                            onChange={(e) => handleDateChange(e.target.value, index)}
                                                            className="w-full lg:w-2/3"
                                                        />
                                                    </div>
                                                )}

                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                                                    onClick={() => handleAddInvoice(service.srq_id, index, service.service_name)}
                                                >
                                                    {selectedFile ? 'Submit' : 'Add Invoice'}
                                                </button>
                                            </div>


                                        </div>
                                    ))
                                ) : (
                                    <p className="flex justify-center text-center">Nothing to show</p>
                                )}
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            {isModalOpen &&
                < div className="fixed  inset-0 z-50 mt-16 h-[75vh] opacity-1 flex items-center justify-center">
                    <div className="bg-white overflow-y-scroll relative bottom-3  h-[75vh] w-1/2 mt-10 shadow-md shadow-gray-400 p-8 rounded-lg text-center">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            <IoMdClose className="bg-red-500 text-white" size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4"> Add Invoice</h2>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="my-4 p-2 border border-gray-300 rounded"
                        />

                        {error && <p className="text-red-500">{error}</p>}

                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                            Add Invoice
                        </button>

                    </div>
                </div >
            }

        </>
    );
}

export default ServiceProviderHomePage;