import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import '../Register.css'
function Doctor() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [parents, setParents] = useState([]); // State to hold the list of parents
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token !== null) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);

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
                                                    placeholder="Search parents"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>

                                        </div>
                                        <div className={isshowpass ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                            <h3 className="mb-3 text-center">Today Appointment</h3>

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