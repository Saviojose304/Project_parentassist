import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css'
import '../Register.css'
import AlertBox from "../Alert";
import { Modal } from "react-bootstrap";

function Admin() {

    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const token = JSON.parse(localStorage.getItem('token'))
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });


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
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const validateEmail = (email) => {
        var filter = /^([a-zA-Z0-9_\- ])+\@(([a-zA-Z\-])+\.)+([a-zA-Z]{2,})+$/;
        var regex = /^\s/;
        if (email.match(regex)) {
            return "Email is required";
        }
        if (email.match(filter)) {
            return " ";
        } else {
            return "Invalid email address!";
        }

    };

    const handleEmail = (eventemail) => {
        const newEmail = eventemail.target.value;
        setEmail(newEmail);
        const emailErrorMessage = validateEmail(newEmail);
        setEmailError(emailErrorMessage);
    }

    const handleViewDetails = (userId) => {
        navigate('/AdminUserView', {
            state: { userDetails: userId }
        })
    };

    const handleservice = () => {
        navigate('/AdminAddServices')
    };

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const Logout = async () => {
        try {
            localStorage.removeItem('token');
            console.log(token);
            navigate('/'); // Navigate to the home   page after logout
        } catch (error) {
            console.log(error);
        }
    }

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);

        try {
            const response = await axios.post('http://localhost:9000/send-terms-email', {
                recipientEmail: email,
            });

            if (response.status === 200) {
                // Email sent successfully
                setAlertInfo({ variant: 'success', message: 'Email sent successfully', show: true });
            } else {
                // Handle error
                setAlertInfo({ variant: 'danger', message: 'Email sending failed', show: true });
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Email sending failed');
        }
    }

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/">ParentAssist</a>
                        <div className="input-group mt-2   ms-auto me-5">
                            <div className="nav-item w-50 px-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Email"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="nav-item px-3">
                                <button className="btn btn-success btn-lg"
                                    onClick={() => setShowForm(true)} >
                                    <i className="bi bi-plus-lg"></i>
                                    Add Medicine Seller
                                </button>
                            </div>
                        </div>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" onClick={toggleSidebar}>{token ? token.email : ''}</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <div className='row d-flex'>
                <div className='col-2' id="sidebar-nav">
                    <div className="container mt-9 pt-5">
                        <div className="row flex-nowrap" >
                            <div className=" px-0">
                                <div id="sidebar" className={isSidebarOpen ? 'collapse collapse-horizontal ' : 'show border-end pt-2'}>
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleservice}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Services</span></i>
                                            </a>
                                        </button>
                                        {/* <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-bootstrap"><span>Providers</span></i>
                                            </a>
                                        </button> */}
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={Logout}>
                                            <a href='' className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-box-arrow-right"><span >Logout</span></i>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className={isSidebarOpen ? 'col-12' : 'col-10 pt-2'}>
                    <main className="col overflow-auto h-100">
                        <div className="bg-light border rounded-3 p-5">
                            <div className="container mt-5">
                                <h2>Admin Dashboard</h2>
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Email</th>
                                            <th>User Role</th>
                                            <th>User Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.user_id}>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.user_status}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm mr-2"
                                                        onClick={() => handleViewDetails(user.user_id)}
                                                    >
                                                        View Details
                                                    </button>
                                                    {user.user_status === 'ACTIVE' ? (
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={async () => {
                                                                // Show a confirmation dialog before deactivating
                                                                const confirmed = window.confirm("Are you sure you want to Deactivate the user?");
                                                                if (confirmed) {
                                                                    // Make an API request to deactivate the user
                                                                    const response = await axios.post(`http://localhost:9000/deactivateUser/${user.user_id}`);
                                                                    if (response.status === 200) {
                                                                        // Update the UI or handle success as needed
                                                                        console.log("User Deactivated successfully");
                                                                        // Show a success alert
                                                                        alert("User Deactivated successfully");
                                                                        window.location.reload();
                                                                    } else {
                                                                        console.error("Failed to Deactivate");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-success btn-sm mr-2"
                                                            onClick={async () => {
                                                                // Show a confirmation dialog before deactivating
                                                                const confirmed = window.confirm("Are you sure you want to Activate the user?");
                                                                if (confirmed) {
                                                                    // Make an API request to deactivate the user
                                                                    const response = await axios.post(`http://localhost:9000/activateUser/${user.user_id}`);
                                                                    if (response.status === 200) {
                                                                        // Update the UI or handle success as needed
                                                                        console.log("User Activated successfully");
                                                                        // Show a success alert
                                                                        alert("User Activated successfully");
                                                                        window.location.reload();
                                                                    } else {
                                                                        console.error("Failed to Deactivate");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Activate
                                                        </button>
                                                    )}

                                                    {/* {user.user_status === 'ACTIVE' ? (
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={async () => {
                                                                // Show a confirmation dialog before deactivating
                                                                const confirmed = window.confirm("Are you sure you want to Deactivate the user?");
                                                                if (confirmed) {
                                                                    // Make an API request to deactivate the user
                                                                    const response = await axios.post(`http://localhost:9000/deactivateUser/${user.user_id}`);
                                                                    if (response.status === 200) {
                                                                        // Update the UI or handle success as needed
                                                                        console.log("User Deactivated successfully");
                                                                        // Show a success alert
                                                                        alert("User Deactivated successfully");
                                                                        window.location.reload();
                                                                    } else {
                                                                        console.error("Failed to Deactivate");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        // Render an empty span for the "Deactivate" button if the user is already deactivated
                                                        <span></span>
                                                    )} */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </main>
                </div >
            </div >

            <Modal show={showForm} onHide={() => {
                setShowForm(false);
                window.location.reload();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Medcine Seller</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="">
                            <span><i className="bi bi-envelope-fill icon"></i></span>
                            <input type="email" placeholder="Enter Medicine Seller e-mail" name="email" value={email} onChange={handleEmail} required />
                            <div className="red-text" id="name_err">{emailError}</div> <br />
                        </div>
                        <div className="col-12 w-100 d-flex justify-content-center align-content-center">
                            <button
                                className="btn btn-primary btn-lg btn-block"
                                type="submit"
                                id="submit"
                                name="submit"
                            >
                                Send Terms and condition
                            </button>
                        </div>
                        <div className="p-2">
                            {submitClicked && (
                                <AlertBox
                                    variant={alertInfo.variant}
                                    message={alertInfo.message}
                                    onClose={handleAlertClose}
                                />
                            )}
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Admin;
