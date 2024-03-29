import React from "react";
import { useState, useEffect } from "react";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import format from "date-fns/format";
function ChildDoctorView() {
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const child_user_id = parsedToken.userId;
    const userRole = parsedToken.role;
    //console.log(userRole);
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token !== null) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);


    useEffect(() => {
        // Fetch the list of doctors when the component mounts
        fetchDoctors();
        // Fetch today's appointments when the component mounts
        fetchTodaysAppointments();
    }, []);

    useEffect(() => {
        // Update the filteredParents when the searchQuery changes
        const filtered = doctors.filter((doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDoctors(filtered);
    }, [searchQuery, doctors]);


    const handleprofile = () => {
        navigate('/ChildProfileUpdate');
    };

    const handledoctor = () => {
        navigate('/ChildDoctorView')
    };

    const handledoctorVisits = () => {
        navigate('/Parent')
    };

    const handleReports = () => {
        navigate('/ChildReports')
    }

    const handleparents = () => {
        navigate('/ChildProfile')
    }


    


    const fetchDoctors = async () => {
        try {
            const response = await fetch(`http://13.233.162.230:9000/ChildDoctorList`);
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
                setFilteredDoctors(data);
            } else {
                console.error("Failed to fetch doctors");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const fetchTodaysAppointments = async () => {
        try {
            if (userRole === 'Child') { // Assuming 'child' is the role you want to check
                const response = await axios.get(`http://13.233.162.230:9000/ChildTodaysAppointments?user_id=${child_user_id}`);
                if (response.status === 200) {
                    const data = response.data;
                    setTodaysAppointments(data);
                } else {
                    console.error("Failed to fetch today's appointments");
                }
            } else if (userRole === 'Parent') { // You can add more conditions for different roles
                // Make another Axios request for the parent role
                const currentDate = format(new Date(), "yyyy-MM-dd");
                const response = await axios.get(`http://13.233.162.230:9000/ParentViewAppointments?parent_user_id=${child_user_id}&date=${currentDate}`);
                // Process the parentResponse data and update state as needed
                const data = response.data;
                setTodaysAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    //console.log(todaysAppointments);
    const fetchDoctorDetails = async (doctorId) => {
        try {
            const response = await axios.get(`http://13.233.162.230:9000/editdoctorslist/${doctorId}`);
            if (response.status === 200) {
                return response.data;
            } else {
                console.error(`Failed to fetch doctor details for doctor_id: ${doctorId}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching doctor details: ${error}`);
            return null;
        }
    };

    function isToday(appointmentDate, appointmentTime) {
        const today = new Date().toISOString().split('T')[0];
        const todaytime = new Date().toLocaleTimeString('en-US', { hour12: false });
        if (appointmentDate > today) {
            return true; // Appointment date is in the future
        } else if (appointmentDate === today && appointmentTime >= todaytime) {
            return true; // Appointment date is today, and time is in the future
        }
    }

    const handleEditAppointment = (appointment, doctorDetails) => {
        // Navigate to the "DoctorBooking" component and pass the appointment details
        navigate("/DoctorBooking", {
            state: { appointmentDetails: appointment, doctorDetails: doctorDetails },
        });
    };

    const toggleParent = () => {
        setShowGeneral(!isshowgeneral);
        setShowPass(!isshowpass);
    };

    const toggleTodayAppointment = () => {
        setShowPass(!isshowpass);
        setShowGeneral(!isshowgeneral);

    };


    const logOut = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        {userRole == 'Parent' ? <a style={{ color: "white" }} className="navbar-brand ms-5" href="/Parent">ParentAssist</a> :
                            <a style={{ color: "white" }} className="navbar-brand ms-5" href="/ChildProfile">ParentAssist</a>
                        }
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3">
                                {userRole === 'Parent' ? (null) :
                                    <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/DoctorBooking">Book Appointment</a></button>
                                }

                            </li>
                            <li className="nav-item px-3 py-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ color: 'white', textDecoration: 'none' }}>
                                        {parsedToken ? parsedToken.email : 'Name'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item style={{ cursor: 'pointer' }} onClick={logOut}>LogOut</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <div className="row d-flex">
                <div className='col-2 mt-2' id="sidebar-nav">
                    <div className="container pt-5">
                        <div className="row flex-nowrap" >
                            <div className=" px-0">
                                <div id="sidebar" className='show border-end pt-2'>
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleprofile} >
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span>View Profile</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleparents}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Parent Details</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handledoctor}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span>Doctors</span></i>
                                            </a>
                                        </button>
                                        {/* <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handledoctorVisits}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span>Doctors Visits</span></i>
                                            </a>
                                        </button> */}
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleReports}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-file-earmark-pdf"><span>Reports</span></i>
                                            </a>
                                        </button>
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
                <div style={{ paddingTop: "5rem" }} className='col-10'>
                    <div className="container  light-style flex-grow-1 container-p-y">
                        <div className="card w-100 overflow-hidden">
                            <div className="row d-flex  pt-0">
                                <div className="col-6 col-md-6">
                                    <div className="list-group fw-bold  list-group-flush account-settings-links">
                                        <div className={isshowgeneral ? 'list-group-item  w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleParent} style={{ cursor: 'pointer' }} >Doctors List</div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6">
                                    <div className="list-group fw-bold  list-group-flush account-settings-links">
                                        <div className={isshowpass ? 'list-group-item w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleTodayAppointment} style={{ cursor: 'pointer' }}>Booked Appointment</div>
                                    </div>
                                </div>

                            </div>
                            <div className="row no-gutters row-bordered row-border-light">
                                <div className="col-md-9">
                                    <div className="tab-content">
                                        <div className={isshowgeneral ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                            <h3 className="mb-3 text-center">Doctors List</h3>
                                            <div className="mb-3 p-2">
                                                <span><i className="bi bi-search icon"></i></span>
                                                <input
                                                    type="text"
                                                    placeholder="Search Doctor"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ paddingLeft: '75px' }} className="row">
                                                {filteredDoctors.map((doctor) => (
                                                    <div key={doctor.id} className="col-lg-4 col-md-4 mb-3">
                                                        <div className="card d-flex flex-column h-100">
                                                            <div className="card-body flex-grow-1">
                                                                <h5 className="card-title">{doctor.name}</h5>
                                                                <p className="card-text">Specialization:{doctor.specialization}</p>
                                                                <p className="card-text">Hospital:{doctor.hospital}</p>
                                                                <p className="card-text">Phone:{doctor.phone}</p>
                                                                {/* <div className="mb-2">
                                                                    <a href="#" className="btn w-100 btn-outline-primary">View Details</a>
                                                                </div> */}


                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                        <div className={isshowpass ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                            <h3 className="mb-3 text-center">Booked Appointment</h3>

                                            {todaysAppointments.length === 0 ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <p className="p-2">No appointments for today</p>
                                                </div>
                                            ) : (

                                                <div style={{ paddingLeft: '75px' }} className="row">
                                                    {todaysAppointments.map((appointment) => (
                                                        <div key={appointment.parent_id} className="col-lg-4 col-md-4 mb-3">
                                                            <div className="card d-flex flex-column h-100 ">
                                                                <div className="card-body flex-grow-1">
                                                                    {userRole === 'Parent' ? (
                                                                        <>
                                                                            <h5 className="card-title">{appointment.parent_name}</h5>
                                                                            <p className="card-text">Doctor: {appointment.doctor_name}</p>
                                                                            <p className="card-text">Time: {appointment.time}</p>
                                                                            <p className="card-text">Date: {appointment.formatted_date}</p>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <h5 className="card-title">{appointment.parent_name}</h5>
                                                                            <p className="card-text">Age: {appointment.parent_age}</p>
                                                                            <p className="card-text">Phone: {appointment.parent_phone}</p>
                                                                            <p className="card-text">Doctor: {appointment.doctor_name}</p>
                                                                            <p className="card-text">Time: {appointment.time}</p>
                                                                            <p className="card-text">Date: {appointment.formatted_date}</p>
                                                                        </>
                                                                    )}
                                                                    {isToday(appointment.formatted_date, appointment.time) && (
                                                                        <>
                                                                            <button className="btn w-100 mb-2 btn-primary" onClick={async () => {
                                                                                const doctorDetails = await fetchDoctorDetails(appointment.doctor_id);
                                                                                if (doctorDetails) {
                                                                                    // Pass both appointment and doctor details to DoctorBooking component
                                                                                    handleEditAppointment(appointment, doctorDetails);
                                                                                }
                                                                            }}>Edit Appointment</button>
                                                                            <button className="btn w-100 btn-outline-danger" onClick={async () => {
                                                                                const doctorDetails = await fetchDoctorDetails(appointment.doctor_id);
                                                                                if (doctorDetails) {
                                                                                    // Show a confirmation dialog before canceling
                                                                                    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
                                                                                    if (confirmed) {
                                                                                        // Make an API request to cancel the appointment
                                                                                        const response = await axios.delete(`http://13.233.162.230:9000/cancelappointment/${appointment.doctor_id}/${appointment.parent_id}/${appointment.formatted_date}`);
                                                                                        if (response.status === 200) {
                                                                                            // Update the UI or handle success as needed
                                                                                            console.log("Appointment cancelled successfully");
                                                                                            // Show a success alert
                                                                                            alert("Appointment cancelled successfully");
                                                                                            window.location.reload();
                                                                                        } else {
                                                                                            console.error("Failed to cancel appointment");
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }}>Cancel</button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default ChildDoctorView;