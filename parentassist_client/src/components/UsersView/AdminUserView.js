import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Modal, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from 'axios';
function AdminUserView() {
    const location = useLocation();
    const navigate = useNavigate();
    const user_id = location.state.userDetails
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const [userDetails, setUserDetails] = useState({});
    const [fileUrl, setFileUrl] = useState('');

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
            const response = await axios.get(`http://localhost:9000/users/${user_id}`);
            setUserDetails(response.data);
            console.log(response);
        } catch (error) {
            console.error('Error fetching user details: ', error);
        }
    };

    console.log(userDetails);


    const handleCancel = () => {
        navigate('/Admin')
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
            <div style={{ marginTop: '5rem' }} className="container">
                <h2 className="text-center mb-4">Details of {userDetails.email}</h2>
                <div className="row justify-content-center">
                    <div className="col-md-12 d-flex justify-content-center align-items-center">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{userDetails.name}</h5>
                                <p className="card-text">{userDetails.email}</p>
                                <p className="card-text">{userDetails.address}</p>
                                <p className="card-text">{userDetails.specialization}</p>
                                <p className="card-text">{userDetails.hospital}</p>
                                <p className="card-text">{userDetails.phone}</p>
                                {userDetails.role === 'SRVCPRVDR' && (
                                    <p className="card-text">Adhar Card Details:
                                    <a href={`http://localhost:9000/${userDetails.adhar_card}`} target="_blank" rel="noopener noreferrer" className="btn btn-danger mx-2 w-20  mt-3">
                                           <i class="bi bi-file-arrow-down-fill"></i>
                                        </a>
                                    </p>
                                    )}
                                <p className="card-text">{userDetails.user_status}</p>
                                <button className="btn w-50 btn-outline-primary" onClick={handleCancel}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminUserView;