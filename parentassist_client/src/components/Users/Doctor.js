import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import '../Register.css'
import format from "date-fns/format";
function Doctor() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const doctor_user_id = parsedToken.userId;

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [parents, setParents] = useState([]); // State to hold the list of parents
    const [filteredParents, setFilteredParents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [todaysAppointments, setTodaysAppointments] = useState([]);

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
        // Fetch the list of parents when the component mounts
        fetchParents();
        fetchTodaysAppointments();
    }, []);

    useEffect(() => {
        // Update the filteredParents when the searchQuery changes
        const filtered = parents.filter((parent) =>
            parent.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredParents(filtered);
    }, [searchQuery, parents]);


    const fetchParents = async () => {
        try {
            // Fetch parent data from your backend API
            const response = await fetch(`http://localhost:9000/DoctorViewParents?userId=${doctor_user_id}`);
            if (response.ok) {
                const data = await response.json();
                setParents(data); // Update the parents state with the fetched data
                setFilteredParents(data);
            } else {
                console.error("Failed to fetch parent data");
            }
        } catch (error) {
            console.error("Error fetching parent data:", error);
        }
    };

    const fetchTodaysAppointments = async () => {
        try {
            const currentDate = format(new Date(), "yyyy-MM-dd");
            // Fetch today's appointments for the current doctor from your backend API
            const response = await fetch(`http://localhost:9000/DoctorViewAppointments?userId=${doctor_user_id}&date=${currentDate}`);
            if (response.ok) {
                const data = await response.json();
                setTodaysAppointments(data); // Update the todaysAppointments state with the fetched data
            } else {
                console.error("Failed to fetch today's appointments");
            }
        } catch (error) {
            console.error("Error fetching today's appointments:", error);
        }
    };


    const handleprofile = () => {
        navigate('/DoctorProfileUpdate');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
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
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="#">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3 py-2">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" onClick={toggleSidebar}>{parsedToken ? parsedToken.email : 'Name'}</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <div className='row d-flex'>
                <div className='col-2' id="sidebar-nav">
                    <div className="container pt-5">
                        <div className="row flex-nowrap" >
                            <div className=" px-0">
                                <div id="sidebar" className={isSidebarOpen ? 'collapse collapse-horizontal ' : 'show border-end pt-2'}>
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleprofile} >
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span>View Profile</span></i>
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
                <div className={isSidebarOpen ? 'col-12' : 'col-10 pt-5'}>
                    <div className="container pt-5 light-style flex-grow-1 container-p-y">
                        <div className="card w-100 overflow-hidden">
                            <div className="row d-flex  pt-0">
                                <div className="col-6 col-md-6">
                                    <div className="list-group fw-bold  list-group-flush account-settings-links">
                                        <div className={isshowgeneral ? 'list-group-item  w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleParent} style={{ cursor: 'pointer' }} >Patients List</div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6">
                                    <div className="list-group fw-bold  list-group-flush account-settings-links">
                                        <div className={isshowpass ? 'list-group-item w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleTodayAppointment} style={{ cursor: 'pointer' }}>Todays Appointment</div>
                                    </div>
                                </div>

                            </div>
                            <div className="row no-gutters row-bordered row-border-light">
                                <div className="col-md-9">
                                    <div className="tab-content">
                                        <div className={isshowgeneral ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                            <h3 className="mb-3 text-center">Patients</h3>
                                            <div className="mb-3 p-2">
                                                <span><i className="bi bi-search icon"></i></span>
                                                <input
                                                    type="text"
                                                    placeholder="Search Patients"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ paddingLeft: '75px' }} className="row">
                                                {filteredParents.map((parent) => (
                                                    <div key={parent.id} className="col-lg-4 col-md-4 mb-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <h5 className="card-title">{parent.name}</h5>
                                                                <p className="card-text">Age:{parent.age}</p>
                                                                <p className="card-text">Phone:{parent.phone}</p>
                                                                <div className="mb-2">
                                                                    <a href="#" className="btn w-100 btn-outline-primary">View Details</a>
                                                                </div>
                                                                <a href="#" className="btn w-100 btn-primary">Edit Details</a>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                        <div className={isshowpass ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                            <h3 className="mb-3 text-center">Todays Appointment</h3>
                                            {todaysAppointments.length === 0 ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <p className="p-2">No appointments for today</p>
                                                </div>
                                            ) : (
                                                <div style={{ paddingLeft: '75px' }} className="row">
                                                    {todaysAppointments.map((appointment) => (
                                                        <div key={appointment.appointment_id} className="col-lg-4 col-md-4 mb-3">
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    <h5 className="card-title">Patient: {appointment.parent_name}</h5>
                                                                    <p className="card-text">Age: {appointment.parent_age}</p>
                                                                    <p className="card-text">Phone: {appointment.parent_phone}</p>
                                                                    <p className="card-text">Time: {appointment.time}</p>
                                                                    <div className="mb-2">
                                                                        <a href="#" className="btn w-100 btn-outline-primary">View Details</a>
                                                                    </div>
                                                                    <a href="#" className="btn w-100 btn-primary">Edit Details</a>
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

export default Doctor;