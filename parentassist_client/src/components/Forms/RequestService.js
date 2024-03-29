import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../Spinner/Spinner";

function Requsetservice({closeModal}) {

    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);

    const [service, setService] = useState("");
    const [serviceList, setServiceList] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [subServiceDes, setSubServiceDes] = useState("");
    const [fetchingCoordinates, setFetchingCoordinates] = useState(false);
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [serviceError, setServiceError] = useState("");
    const [subServiceDesError, setSubServiceDesError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const user_role = token.role;
        const user_id = token.userId;
        setUserId(user_id);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://13.233.162.230:9000/distinct-Service`);
                setServiceList(response.data);
            } catch (error) {
                console.error('Error fetching service list:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        // Set default value to today's date
        setSelectedDate(new Date());
    }, []);


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

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

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
        const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
        const formattedDate = adjustedDate.toISOString().split('T')[0];
        console.log(userId, formattedDate, location, latitude, longitude);
        const locationError = validateLocation(location);


        if (subServiceDesError || locationError) {
            // Display individual field error messages
            if (locationError) toast.warning("Enter location");
            if (subServiceDesError) toast.warning("Enter Description");
        } else {
            if (latitude === '' || longitude === '') {
                return <Spinner />;
            }
            try {
                // Assuming you have a backend API endpoint to handle this request
                const backendEndpoint = 'http://13.233.162.230:9000/requestService';


                const requestBody = {
                    selectedService,
                    subServiceDes,
                    location,
                    formattedDate,
                    userId,
                };

                const response = await axios.post(backendEndpoint, requestBody);

                // Check the response and handle success/failure accordingly
                if (response.status === 200) {
                    toast.success("Service Request added successfully!");
                    // Optionally, you can reset the form or navigate to another page
                    // Resetting form:
                    setSubServiceDes("");
                    setLocation("");
                    setLatitude("");
                    setLongitude("");

                    closeModal();
                    
                } else {
                    if (response.data.error === 'Similar service request already exists for this date and user.') {
                        toast.error("Similar service request already exists for this date and user.");
                    } 
                }
            } catch (error) {
                console.error('Error adding service:', error);

                if (error.response && error.response.status === 500 && error.response.data.error === 'Similar service request already exists for this date and user.') {
                    toast.error("Similar service request already exists for this date and user.");
                }
            }

        }
    };



    return (
        <>
            <h1 className="text-3xl font-bold mb-4">Request Service</h1>

            {/* Box with Shadow */}
            <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition duration-300"
                style={{
                    boxShadow: "5px 5px 12px 0px rgba(173, 216, 230, 0.9)",
                }}>
                <div className="mb-4">
                    <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Enter Service</label>
                    <select
                    id='service-dropdown'
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="" disabled>Select</option>
                        {serviceList.map((serviceItem, index) => (
                            <option key={index} value={serviceItem.service}>
                                {serviceItem.service}
                            </option>
                        ))}
                    </select>
                    <div className=" text-red-700" id="name_err">{serviceError}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Enter Service Description</label>
                    <textarea
                        id="service-description"
                        name="addSubServiceDes"
                        value={subServiceDes}
                        onChange={handleSubServiceDes}
                        required
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter sub-service Description"
                        rows="4" // Set the number of rows as needed
                    />

                    <div className=" text-red-700" id="name_err">{subServiceDesError}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Enter Location</label>
                    <input
                        type="text"
                        id="location"
                        name="addLocation"
                        value={location}
                        onChange={handleLocation}
                        required
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter Location"
                    />
                    <div className=" text-red-700" id="name_err">{locationError}</div>
                </div>
                <div className="mb-4">
                    <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Select Date</label>
                    <DatePicker
                        id="datepicker"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        minDate={new Date()} // Set the minimum date to today
                        dateFormat="dd/MM/yyyy" // Set the date format
                        className="border rounded-md p-2 w-full"
                        placeholderText="Select a date"
                    />
                </div>
                <div className="text-center">
                    <button
                        id="submitBtn"
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                        disabled={fetchingCoordinates} // Disable the button while fetching coordinates
                    >
                        {fetchingCoordinates ? 'Fetching Coordinates...' : 'Submit'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Requsetservice;