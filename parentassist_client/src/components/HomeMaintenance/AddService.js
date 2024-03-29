import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import Spinner from "../Spinner/Spinner";

function AddService() {
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [fetchingCoordinates, setFetchingCoordinates] = useState(false);
    const [service, setService] = useState("");
    const [subService, setSubService] = useState("");
    const [subServiceDes, setSubServiceDes] = useState("");
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [serviceError, setServiceError] = useState("");
    const [subServiceError, setSubServiceError] = useState("");
    const [subServiceDesError, setSubServiceDesError] = useState("");
    const [amountError, setAmountError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [userId, setUserId] = useState("");


    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const user_role = token.role;
        const user_id = token.userId;
        setUserId(user_id);
        if (token !== null && user_role == 'SRVCPRVDR') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);

    const validateService = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Service cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter a service with at least 3 valid characters';
        }
    };


    const validateSubServiceDes = (name) => {
        var letters = /^[A-Za-z\d\-_.,!"'()@#$%^&*+= ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Sub Service Des cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter a sub service description with at least 3 valid characters';
        }
    };


    const validateLocation = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Location cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter a location with at least 3 valid characters';
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (location.trim() !== '') {
                getCoordinates();
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [location]);

    const handleService = (event) => {
        const newService = event.target.value;
        setService(newService);
        const errorMessage = validateService(newService);
        setServiceError(errorMessage)
    }


    const handleSubServiceDes = (event) => {
        const newSubServiceDes = event.target.value;
        setSubServiceDes(newSubServiceDes);
        const errorMessage = validateSubServiceDes(newSubServiceDes);
        setSubServiceDesError(errorMessage)
    }



    const handleLocation = (event) => {
        const newLocation = event.target.value;
        setLocation(newLocation);
        const errorMessage = validateLocation(newLocation);
        setLocationError(errorMessage);
    }

    const getCoordinates = async () => {
        try {
            setFetchingCoordinates(true);

            // Replace 'YOUR_API_KEY' with your actual OpenCage Geocoding API key
            const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
            const response = await axios.get(
                `https://geocode.maps.co/search?q=${location}&api_key=${apiKey}`
            );

            //console.log(response);

            if (response.data.length > 0) {
                const result = response.data[0];
                const { lat, lon } = result;
                setLatitude(lat);
                setLongitude(lon);
            } else {
                console.error('OpenCage Geocoding API request failed');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error.message);
        } finally {
            setFetchingCoordinates(false);
        }
    };

    const handleSubmit = async () => {
        const serviceError = validateService(service);
        const locationError = validateLocation(location);


        if (serviceError || subServiceDesError || locationError) {
            // Display individual field error messages
            if (serviceError) toast.warning("Enter Service ");
            if (locationError) toast.warning("Enter location");
            if (subServiceDesError) toast.warning("Enter Description");
        } else {
            if (latitude === '' || longitude === '') {
                return <Spinner />;
            }
            try {
                // Assuming you have a backend API endpoint to handle this request
                const backendEndpoint = 'http://13.233.162.230:9000/addService';


                const requestBody = {
                    service,
                    subServiceDes,
                    location,
                    latitude,
                    longitude,
                    userId,
                };

                const response = await axios.post(backendEndpoint, requestBody);

                // Check the response and handle success/failure accordingly
                if (response.status === 200) {
                    toast.success("Service added successfully!");
                    // Optionally, you can reset the form or navigate to another page
                    // Resetting form:
                    setLocation("");
                    setLatitude("");
                    setLongitude("");
                } else {
                    if (response.data.error === 'Service Already Existing For Same Location') {
                        toast.error("Service already exists for the same location.");
                    } else {
                        toast.error("Failed to add service. Please try again.");
                    }
                }
            } catch (error) {
                console.error('Error adding service:', error);

                if (error.response && error.response.status === 500 && error.response.data.error === 'Service Already Existing For Same Location') {
                    toast.error("Service already exists for the same location.");
                } else {
                    toast.error("Failed to add service. Please try again.");
                }
            }

        }


    }



    const logOut = async () => {
        try {
            googleLogout();
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleServiceList = () => {
        navigate("/ServiceProviderHomePage")
    }

    const handleProfile = () => {
        navigate("/ServiceProviderProfilePage")
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
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleProfile}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span className="ml-2">View Profile</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-house-gear-fill"><span className="ml-2">Add Service</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleServiceList}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-list-columns"><span className=" ml-2">Service List</span></i>
                                            </a>
                                        </button>
                                        {/* <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-file-earmark-pdf"><span>Reports</span></i>
                                            </a>
                                        </button> */}
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={logOut}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-box-arrow-right"><span className="ml-2">Logout</span></i>
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
                        <h1 className="text-3xl font-bold mb-4">Add Service</h1>

                        {/* Box with Shadow */}
                        <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition duration-300"
                            style={{
                                boxShadow: "5px 5px 12px 0px rgba(173, 216, 230, 0.9)",
                            }}>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Enter Service</label>
                                <input
                                    type="text"
                                    id="addService"
                                    name="addService"
                                    value={service}
                                    onChange={handleService}
                                    required
                                    className="border rounded-md p-2 w-full"
                                    placeholder="Enter service name"
                                />
                                <div className=" text-red-700" id="name_err">{serviceError}</div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Enter Service Description</label>
                                <textarea
                                    id="addSubService"
                                    name="addSubServiceDes"
                                    value={subServiceDes}
                                    onChange={handleSubServiceDes}
                                    required
                                    className="border rounded-md p-2 w-full lg:w-9/12"
                                    placeholder="Enter sub-service Description"
                                    rows="4" // Set the number of rows as needed
                                />

                                <div className=" text-red-700" id="name_err">{subServiceDesError}</div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Enter Location</label>
                                <input
                                    type="text"
                                    id="addLocation"
                                    name="addLocation"
                                    value={location}
                                    onChange={handleLocation}
                                    required
                                    className="border rounded-md p-2 w-full"
                                    placeholder="Enter Location"
                                />
                                <div className=" text-red-700" id="name_err">{locationError}</div>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                    disabled={fetchingCoordinates} // Disable the button while fetching coordinates
                                >
                                    {fetchingCoordinates ? 'Fetching Coordinates...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddService;