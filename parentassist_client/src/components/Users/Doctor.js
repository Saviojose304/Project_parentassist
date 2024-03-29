import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import '../Register.css'
import AlertBox from "../Alert";
import format from "date-fns/format";
import PatientDetailsModal from "../UsersView/PatientDetailsModal";
function Doctor() {


    
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const [isshowAppoint, setShowAppoint] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const doctor_user_id = parsedToken.userId;


    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [parents, setParents] = useState([]); // State to hold the list of parents
    const [filteredParents, setFilteredParents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [nextAppointments, setnextAppointments] = useState([]);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const user_role = token.role;
        if (token !== null && user_role == 'Doctor') {
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

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const fetchParents = async () => {
        try {
            // Fetch parent data from your backend API
            const response = await fetch(`http://13.233.162.230:9000/DoctorViewParents?userId=${doctor_user_id}`);
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
            const todaytime = new Date().toLocaleTimeString('en-US', { hour12: false });
            // Fetch today's appointments for the current doctor from your backend API
            const response = await fetch(`http://13.233.162.230:9000/DoctorViewAppointments?userId=${doctor_user_id}&date=${currentDate}`);
            if (response.ok) {
                const data = await response.json();


                // Filter appointments for today and future dates
                const todayAppointments = data.filter(appointment => appointment.formatted_date === currentDate && appointment.formatted_time > todaytime);
                const futureAppointments = data.filter(appointment => appointment.formatted_date > currentDate);

                // Update the state with the filtered data
                setTodaysAppointments(todayAppointments);
                setnextAppointments(futureAppointments);
                //setTodaysAppointments(data); // Update the todaysAppointments state with the fetched data
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
        setShowGeneral(true);
        setShowPass(false);
        setShowAppoint(false);
    };

    const toggleTodayAppointment = () => {
        setShowGeneral(false);
        setShowPass(true);
        setShowAppoint(false);
    };

    const toggleAppoint = () => {
        setShowGeneral(false);
        setShowPass(false);
        setShowAppoint(true);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };


    const logOut = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleViewDetails = async (parent_id) => {
        setSelectedParentId(parent_id);
        setShowPatientDetailsModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);

        try {
            const response = await fetch('http://13.233.162.230:9000/saveLeaveDays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    doctor_user_id,
                }),
            });

            if (response.ok) {
                console.log('Leave days saved successfully');
                setAlertInfo({ variant: 'success', message: 'Leave days saved successfully', show: true });
            } else {
                console.error('Failed to save leave days');
                setAlertInfo({ variant: 'danger', message: 'Failed to save leave days', show: true });
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setEndDate('');
        setStartDate('');

    };
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/Doctor">Home</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3 py-2">
                                <button className="btn btn-success" onClick={() => setShowForm(true)}>Add Leave Days</button>
                            </li>
                            <li className="nav-item px-3 py-2">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" onClick={toggleSidebar}>{parsedToken ? parsedToken.userName : 'Name'}</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <div className='row d-flex pb-10 mb-10'>
                <div className='col-2' id="sidebar-nav">
                    <div className="container mt-5 pt-2">
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
                                <div className="col-4 col-md-4">
                                    <div className="list-group fw-bold  list-group-flush account-settings-links">
                                        <div className={isshowgeneral ? 'list-group-item  w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleParent} style={{ cursor: 'pointer' }} >Patients List</div>
                                    </div>
                                </div>
                                <div className="col-4 col-md-4">
                                    <div className="list-group fw-bold  list-group-flush account-settings-links">
                                        <div className={isshowpass ? 'list-group-item w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleTodayAppointment} style={{ cursor: 'pointer' }}>Todays Appointment</div>
                                    </div>
                                </div>
                                <div className="col-4 col-md-4">
                                    <div className="list-group fw-bold  list-group-flush account-settings-links">
                                        <div className={isshowAppoint ? 'list-group-item w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleAppoint} style={{ cursor: 'pointer' }}>Next Appointment</div>
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
                                                        <div className="card d-flex flex-column h-100">
                                                            <div className="card-body flex-grow-1">
                                                                <h5 className="card-title">{parent.name}</h5>
                                                                <p className="card-text">Age:{parent.age}</p>
                                                                <p className="card-text">Phone:{parent.phone}</p>
                                                                <div className="mb-2">
                                                                    <button className="btn w-100 btn-outline-primary" onClick={() => handleViewDetails(parent.parent_id)}>View Details</button>
                                                                </div>
                                                                <button className="btn w-100 btn-primary" onClick={() => navigate(`/DoctorPatientDetails/${parent.parent_id}`)}>Edit Details</button>
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
                                                            <div className="card d-flex flex-column h-100">
                                                                <div className="card-body flex-grow-1">
                                                                    <h5 className="card-title">Patient: {appointment.parent_name}</h5>
                                                                    <p className="card-text">Age: {appointment.parent_age}</p>
                                                                    <p className="card-text">Phone: {appointment.parent_phone}</p>
                                                                    <p className="card-text">Time: {appointment.formatted_time}</p>
                                                                    <div className="mb-2">
                                                                        <button className="btn w-100 btn-outline-primary" onClick={() => handleViewDetails(appointment.parent_id)}>View Details</button>
                                                                    </div>
                                                                    <button className="btn w-100 btn-primary" onClick={() => navigate(`/DoctorPatientDetails/${appointment.parent_id}`)}>Edit Details</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className={isshowAppoint ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                            <h3 className="mb-3 text-center">Appointments</h3>

                                            <div style={{ paddingLeft: '75px' }} className="row">
                                                {nextAppointments.map((appointment) => (
                                                    <div key={appointment.appointment_id} className="col-lg-4 col-md-4 mb-3">
                                                        <div className="card d-flex flex-column h-100">
                                                            <div className="card-body flex-grow-1">
                                                                <h5 className="card-title">Patient: {appointment.parent_name}</h5>
                                                                <p className="card-text">Age: {appointment.parent_age}</p>
                                                                <p className="card-text">Phone: {appointment.parent_phone}</p>
                                                                <p className="card-text">Time: {appointment.formatted_time}</p>
                                                                <p className="card-text">Date: {appointment.formatted_date}</p>
                                                                <div className="mb-2">
                                                                    <button className="btn w-100 btn-outline-primary" onClick={() => handleViewDetails(appointment.parent_id)}>View Details</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showForm} onHide={() => {
                setShowForm(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Leave Days</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="popup-form">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    min={date}
                                    placeholder="Start Date"
                                    onChange={handleStartDateChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    placeholder="End Date"
                                    min={date}
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    required
                                />
                            </div>
                            <div className="text-center mb-3">
                                <button type="submit" className="btn btn-success">Submit</button>
                            </div>
                        </form>
                        <div className="p-2">
                            {submitClicked && (
                                <AlertBox
                                    variant={alertInfo.variant}
                                    message={alertInfo.message}
                                    onClose={handleAlertClose}
                                />
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <PatientDetailsModal
                show={showPatientDetailsModal}
                onHide={() => setShowPatientDetailsModal(false)}
                parent_id={selectedParentId}
                userId = {doctor_user_id}
            />
        </>
    );
}

export default Doctor;