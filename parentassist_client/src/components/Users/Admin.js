import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css'
import '../Register.css'
import AlertBox from "../Alert";
import { Modal } from "react-bootstrap";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import AdminSideBar from './AdminSideBar';

function Admin() {

    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const token = JSON.parse(localStorage.getItem('token'))
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });


    useEffect(() => {
        if (token !== null) {
            const user_role = token.role;
            if(user_role === 'Admin'){
                setIsAuthenticated(true);
            }
        } else {
            setIsAuthenticated(false);
            navigate('/'); // Navigate to login if no token is present
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://13.233.162.230:9000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query) ||
            user.user_status.toLowerCase().includes(query)
        );
    });

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
            const response = await axios.post('http://13.233.162.230:9000/send-terms-email', {
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

    const styles = StyleSheet.create({
        page: {
            flexDirection: "row",
            backgroundColor: "#fff",
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
        title: {
            fontSize: 24,
            marginBottom: 10,
        },
        table: {
            display: "table",
            width: "100%",
            borderCollapse: "collapse",
        },
        tableRow: {
            flexDirection: "row",
        },
        tableCellHeader: {
            backgroundColor: "#f2f2f2",
            fontWeight: "bold",
            padding: 5,
            flex: 1,
            border: "1px solid #ccc",
        },
        tableCell: {
            padding: 5,
            fontSize: 12,
            flex: 1,
            border: "1px solid #ccc",
        },
    });


    const generatePdf = () => {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.title}>User Data</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCellHeader}><Text>Email</Text></View>
                                <View style={styles.tableCellHeader}><Text>User Role</Text></View>
                                <View style={styles.tableCellHeader}><Text>User Status</Text> </View>
                            </View>
                            {filteredUsers.map((user) => (
                                <View style={styles.tableRow} key={user.user_id}>
                                    <View style={styles.tableCell}><Text>{user.email}</Text></View>
                                    <View style={styles.tableCell}><Text>{user.role}</Text></View>
                                    <View style={styles.tableCell}><Text>{user.user_status}</Text></View>
                                </View>
                            ))}
                        </View>
                    </View>
                </Page>
            </Document>
        );
    };

    const openPdfModal = () => {
        setShowPdfModal(true);
    };
    const closePdfModal = () => {
        setShowPdfModal(false);
    };


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
                                    placeholder="Search by Email or Role or Status"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none">{token ? token.email : ''}</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <div className='row d-flex'>
                <div className='col-2' id="sidebar-nav">
                   <AdminSideBar />
                </div>
                <div className="col-10 pt-2">
                    <main className="col overflow-auto h-100">
                        <div className="bg-light border rounded-3 p-5">
                            <div className="container mt-5">
                                <div className='d-flex'>
                                    <h2>Admin Dashboard</h2>
                                    <div className="nav-item px-3">
                                        <button
                                            className="btn btn-primary btn-md"
                                            onClick={openPdfModal}
                                        >
                                            Download PDF
                                        </button>
                                    </div>

                                </div>
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
                                                                    const response = await axios.post(`http://13.233.162.230:9000/deactivateUser/${user.user_id}`);
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
                                                                    const response = await axios.post(`http://13.233.162.230:9000/activateUser/${user.user_id}`);
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

            <Modal show={showPdfModal} onHide={closePdfModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Download PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PDFViewer width="100%" height="500px">
                        {generatePdf()}
                    </PDFViewer>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default Admin;
