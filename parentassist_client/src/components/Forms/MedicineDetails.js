import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import axios from 'axios';
import AlertBox from "../Alert";
function MedicineDetails() {
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState('');
    const [medicinename, setMedicinename] = useState('');
    const [sellerDetails, setSellerdetails] = useState('');
    const [medicineOptions, setMedicineOptions] = useState([]); // Store medicine names
    const [dropdownClicked, setDropdownClicked] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });

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

    const handleSeller = (eventSell) => {
        const newSeller = eventSell.target.value;
        setSellerdetails(newSeller);
    };

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const fetchMedicineNames = async () => {
        try {
            const response = await axios.get('http://localhost:9000/medicineNames');
            if (response.status === 200) {
                const names = response.data; // Assuming the response is an array of medicine names
                setMedicineOptions(names);
            }
        } catch (error) {
            console.error("Error fetching medicine names:", error);
        }
    };

    const handleDropdownClick = () => {
        if (!dropdownClicked) {
            fetchMedicineNames();
            setDropdownClicked(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);
        console.log(date, medicinename, sellerDetails,);
        try {
            const response = await axios.post('http://localhost:9000/addMedicine', {
                name: medicinename,
                sellerDetails,
                expiryDate: date,
            });

            if (response.status === 200) {
                // Medicine added successfully
                console.log(response.data.message);
                setAlertInfo({ variant: 'success', message: 'Medicine added successfully', show: true });
                setMedicinename('');
                setSellerdetails('');
                setDate('');
            } else {
                // Handle errors here
                console.error('Failed to add medicine');
            }
        } catch (error) {
            console.error('Error adding medicine:', error);
            setAlertInfo({ variant: 'danger', message: "Medicine Already Exist", show: true });
        }

    };
    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-success"
                    onClick={() => setShowForm(true)}
                >
                    Add Medicine
                </button>
            </div>
            <select
                className="form-select mx-auto w-50"
                value={medicinename}
                onChange={(e) => setMedicinename(e.target.value)}
                onClick={handleDropdownClick} // Load medicine names onClick
            >
                <option value="">Select Medicine</option>
                {medicineOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <Modal show={showForm} onHide={() => {
                setShowForm(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Medicine Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="popup-form">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={medicinename}
                                    className="form-control"
                                    onChange={handlename}
                                />
                                <div style={{ color: 'red' }} id="name_err">{errorMessage}</div> <br />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sellerDetails" className="form-label">
                                    Seller Details:
                                </label>
                                <textarea
                                    id="sellerDetails"
                                    name="sellerDetails"
                                    value={sellerDetails}
                                    className="form-control"
                                    onChange={handleSeller}
                                />
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
                                    Add
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

export default MedicineDetails;