import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertBox from "../Alert";
import { Modal, Dropdown } from "react-bootstrap";
function MedicineSeller() {
    const token = localStorage.getItem('token');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const navigate = useNavigate();
    const seller_user_id = parsedToken.userId;
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState('');
    const [medicinename, setMedicinename] = useState('');
    const [medcineDetails, setMedicineDetails] = useState([]);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedMedicine, setEditedMedicine] = useState(null);
    const [currentMedicineName, setCurrentMedicineName] = useState('');
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const user_role = token.role;
        if (token !== null && user_role == 'MedSeller') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);

    useEffect(() => {
        fetchMedicineDetails();
    }, []);

    const validateName = (name) => {
        var letters = /^[A-Za-z0-9 ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Medicine cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter a Medicine with at least 3 valid characters';
        }
    };
    const handlename = (event) => {
        const newName = event.target.value;
        setMedicinename(newName);
        const errormsg = validateName(newName);
        setErrorMessage(errormsg)
    }

    const handleEdit = (medicine_id, medicine_name) => {
        // Set the medicine to be edited and enter edit mode
        setEditedMedicine(medicine_id);
        setCurrentMedicineName(medicine_name);
    };

    useEffect(() => {
        if (editedMedicine !== null) {
            setIsEditMode(true);
            setShowForm(true);
        }
    }, [editedMedicine]);

    const handleCloseModal = () => {
        // Reset the edited medicine and exit edit mode
        setEditedMedicine(null);
        setIsEditMode(false);
        setShowForm(false);
        window.location.reload();
    };

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const handleProfile = () =>{
        navigate('/MedSellerProfileUpdate')
    };

    const fetchMedicineDetails = async () => {
        try {
            const response = await axios.get(`http://13.233.162.230:9000/sellerMedicineView/${seller_user_id}`);
            if (response.status === 200) {
                setMedicineDetails(response.data);
            }
        } catch (error) {
            console.error("Error fetching medicine details:", error);
        }
    };

    const filteredDetails = medcineDetails.filter((med) =>
        med.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const logOut = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!errorMessage) {
            setSubmitClicked(true);
            try {
                if (isEditMode && editedMedicine) {
                    // Update the medicine if in edit mode
                    const response = await axios.put(
                        `http://13.233.162.230:9000/updateMedicine/${editedMedicine}`,
                        {
                            expiryDate: date,
                        }
                    );

                    if (response.status === 200) {
                        // Medicine updated successfully
                        console.log(response.data.message);
                        setAlertInfo({
                            variant: 'success',
                            message: 'Medicine updated successfully',
                            show: true,
                        });
                        handleCloseModal();
                    } else {
                        // Handle errors here
                        console.error('Failed to update medicine');
                    }
                } else {
                    // Add a new medicine if not in edit mode
                    const response = await axios.post('http://13.233.162.230:9000/addMedicine', {
                        name: medicinename,
                        expiryDate: date,
                        userId: seller_user_id,
                    });

                    if (response.status === 200) {
                        // Medicine added successfully
                        console.log(response.data.message);
                        setAlertInfo({
                            variant: 'success',
                            message: 'Medicine added successfully',
                            show: true,
                        });
                        setMedicinename('');
                        setDate('');
                        handleCloseModal();
                    } else {
                        // Handle errors here
                        console.error('Failed to add medicine');
                    }
                }
            } catch (error) {
                console.error('Error adding/updating medicine:', error);
                setAlertInfo({
                    variant: 'danger',
                    message: 'An error occurred. Please try again later.',
                    show: true,
                });
            }
        }

    };

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/MedicineSeller">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3 py-2 ">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Medicine"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                            </li>
                            <li className="nav-item px-3 py-2">
                                <button
                                    className="btn btn-success"
                                    onClick={() => setShowForm(true)}
                                >
                                    Add Medicine
                                </button>
                            </li>
                            <li className="nav-item px-3 py-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ color: 'white', textDecoration: 'none' }}>
                                        {parsedToken ? parsedToken.email : 'Name'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item style={{ cursor: 'pointer' }} onClick={handleProfile}>My Profile</Dropdown.Item>
                                        <Dropdown.Item style={{ cursor: 'pointer' }} onClick={logOut}>LogOut</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>


            <main className="col overflow-auto h-100">
                <div className="bg-light border rounded-3 p-5">
                    <div className="container mt-5">
                        <h2>Medicine Details</h2>
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Medicine Name</th>
                                    <th>Medicine Expiry Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDetails.map((med) => (
                                    <tr key={med.medicine_id}>
                                        <td>{med.medicine_name}</td>
                                        <td>{med.formatted_date}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm mr-2"
                                                onClick={() => handleEdit(med.medicine_id, med.medicine_name)}
                                            >
                                                Edit Expiry Date
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>


            <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Medicine Details' : 'Add Medicine Details'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="popup-form">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label htmlFor="name" className="form-label">
                                    Medcine Name:
                                </label>
                                {isEditMode ? (
                                    // Display the current medicine's name as read-only text in edit mode
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={currentMedicineName}
                                        className="form-control"
                                        readOnly
                                    />
                                ) : (
                                    // Display the medicine name input for adding a new medicine
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={medicinename}
                                        className="form-control"
                                        onChange={handlename}
                                    />
                                )}
                                <div style={{ color: 'red' }} id="name_err">{errorMessage}</div> <br />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="expiryDate" className="form-label">
                                    Expiry Date:
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={date}
                                    min={new Date().toISOString().slice(0, 10)}
                                    className="form-control"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="text-center mb-3">
                                <button type="submit" className="btn btn-primary">
                                    {isEditMode ? 'Update' : 'Add'}
                                </button>
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
        </>
    );
}

export default MedicineSeller;