import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Requsetservice from "../Forms/RequestService";
import RequestAndAcceptList from "../Pages/RequestAndAcceptList";
function ChildProfileRequestService() {
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    // const user_id = parsedToken.userId;

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token === null) {
            setIsAuthenticated(false);
            navigate('/'); // Navigate to login if no token is present
        } else {
            setIsAuthenticated(true);
            const parsedToken = JSON.parse(token);
            const user_id = parsedToken.userId;
        }
    }, [navigate]);

    const logOut = async () => {
        try {
            googleLogout();
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleprofile = () => {
        navigate('/ChildProfileUpdate');
    };

    const handleparents = () => {
        navigate('/ChildProfile')
    };

    const handledoctor = () => {
        navigate('/ChildDoctorView')
    };

    const handleReports = () => {
        navigate('/ChildReports')
    }

    const handleParentDetails = () => {
        navigate('/ChildProfile')
    };

    const handleRequestService = () => {
        navigate("/requestService");
    }

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                        <li className="nav-item px-3">
                                <button type="button" className="btn btn-success" onClick={handleModal}>Request Service</button>
                            </li>
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/ParentRegister"><i className="bi bi-plus-lg"></i>Add Parent</a></button>
                            </li>
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/DoctorRegister"><i className="bi bi-plus-lg"></i>Add Doctor</a></button>
                            </li>
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
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleprofile} >
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span>View Profile</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleParentDetails}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Parent Details</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handledoctor}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span>Doctors</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleReports}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-file-earmark-pdf"><span>Reports</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleRequestService}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-house-gear-fill"><span>Service</span></i>
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
                <div style={{ paddingTop: '5rem' }} className='col-10'>
                    <div className="container">
                       <RequestAndAcceptList />
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
                        <Requsetservice closeModal={closeModal} />
                    </div>
                </div >
            }
        </>
    );
}

export default ChildProfileRequestService;