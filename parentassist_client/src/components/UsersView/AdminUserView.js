import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Modal, Button, Card, Container, Row, Col } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import AdminSideBar from '../Users/AdminSideBar';
import AdminServiceReports from '../Reports/AdminServiceReport';
function AdminUserView() {
    const location = useLocation();
    const navigate = useNavigate();
    const user_id = location.state.userDetails
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const [userDetails, setUserDetails] = useState({});
    const [countPay, setCountPay] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

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
        fetchUserDetails();
    }, [user_id]);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`http://13.233.162.230:9000/users/${user_id}`);
            setUserDetails(response.data);
            console.log(response);
        } catch (error) {
            console.error('Error fetching user details: ', error);
        }

        try {
            const responseSrvc = await axios.get(`http://13.233.162.230:9000/srvcpayment/${user_id}`);
            setCountPay(responseSrvc.data);
        } catch (error) {
            console.error('Error fetching user details: ', error);
        }
    };

    const logOut = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/Admin">Home</a>
                        <ul className="navbar-nav ms-auto me-5">
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
            <div className='row d-flex'>
                <div className='col-2' id="sidebar-nav">
                    <AdminSideBar />
                </div>

                <div className="container">
                    <div className=" w-2/3   shadow-md shadow-gray-400 rounded-md mt-28 lg:mt-12 bg-white mx-auto ">
                        <div className="w-full bg-blue-700 text-white font-semibold text-xl  text-center px-3 py-4">
                            Details of {userDetails.name}
                        </div>
                        {userDetails.role === 'SRVCPRVDR' && (
                            <div className="flex justify-center mt-2">
                                <div className="w-1/2">
                                    <p className="text-lg text-center text-gray-700">Total Service Done</p>
                                    <p className="text-3xl text-center text-blue-600 font-bold">
                                        <span>{countPay.totalServiceDone ? countPay.totalServiceDone : "0"}</span>
                                    </p>
                                </div>
                                <div className="w-1/2">
                                    <p className="text-lg text-center text-gray-700">Total Payment</p>
                                    <p className="text-3xl text-center text-green-600 font-bold">
                                        <span>{countPay.totalAmountReceived ? countPay.totalAmountReceived : "0"}</span>
                                    </p>
                                </div>
                            </div>
                        )}


                        <div className="col-md-12 mt-2 d-flex justify-content-center align-items-center">
                            <div className="card w-2/4">
                                <div className="card-body">
                                    <h5 className="card-title">{userDetails.name}</h5>
                                    <p className="card-text">{userDetails.email}</p>
                                    <p className="card-text">{userDetails.address}</p>
                                    <p className="card-text">{userDetails.specialization}</p>
                                    <p className="card-text">{userDetails.hospital}</p>
                                    <p className="card-text">{userDetails.phone}</p>
                                    {userDetails.role === 'SRVCPRVDR' && (
                                        <>
                                            <p className="card-text">Adhar Card Details:
                                                <a href={`http://13.233.162.230:9000//${userDetails.adhar_card}`} target="_blank" rel="noopener noreferrer" className="btn btn-danger mx-2 w-20  mt-3">
                                                    <i class="bi bi-file-arrow-down-fill"></i>
                                                </a>
                                            </p>

                                            <div className="flex mt-3 mb-2">
                                                <button className="btn btn-primary mx-2 w-1/2" onClick={handleModal}>
                                                    Service Details
                                                </button>
                                            </div>
                                        </>


                                    )}
                                    <p className="card-text" style={{ color: userDetails.user_status === 'ACTIVE' ? 'green' : 'red' }}>
                                        {userDetails.user_status}
                                    </p>
                                </div>
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
                            onClick={handleModal}
                        >
                            <IoMdClose className="bg-red-500 text-white" size={24} />
                        </button>
                        <AdminServiceReports userId={user_id} />
                    </div>
                </div>
            }
        </>
    );
}

export default AdminUserView;