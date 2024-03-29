import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function PatientDetailsModal({ show, onHide, parent_id, userId }) {
    const [patientDetails, setPatientDetails] = useState([]);
    const [medicineDetails, setMedicineDetails] = useState([]);


    const fetchPatientDetails = async () => {
        try {
            const response = await axios.get(`http://13.233.162.230:9000/getPatientDetailsDoctorView?parent_id=${parent_id}&user_id=${userId}`);
            if (response.status === 200) {
                setPatientDetails(response.data);
            } else {
                console.error('Failed to fetch patient details');
            }
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    const fetchMedicineDetails = async () => {
        try {
            const response = await axios.get(`http://13.233.162.230:9000/getMedicineDetailsDoctorView?parent_id=${parent_id}&user_id=${userId}`);
            if (response.status === 200) {
                setMedicineDetails(response.data);
            } else {
                console.error('Failed to fetch medicine details');
            }
        } catch (error) {
            console.error('Error fetching medicine details:', error);
        }
    };

    useEffect(() => {

        if (show) {
            fetchPatientDetails();
            fetchMedicineDetails();
        }
    }, [show, parent_id, userId]);

    console.log(patientDetails);

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Patient Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {patientDetails.length > 0 ? (
                    patientDetails.map((details) => (
                        <div key={details.doctor_visit_id}>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <p>Last Visited Date: {details.formatted_date}</p>
                                    <p>Next Visit: {details.formatted_next_visit_date}</p>
                                    <p>Medical Condition: {details.medical_condition}</p>
                                    <p>Current Disease: {details.current_diseases}</p>
                                    <p>BP: {details.BP}</p>
                                    <p>Sugar: {details.sugar}</p>
                                    <p>Weight: {details.weight}</p>
                                </div>
                                <div className='col-md-6'>
                                    <p>Height: {details.height}</p>
                                    <p>BMI: {details.BMI}</p>
                                    <p>Allergies: {details.allergies}</p>
                                    <p>
                                        Past Surgeries:
                                        {details.past_surgeries === "No" ? (
                                            <span>No</span>
                                        ) : (
                                            <a href={`http://13.233.162.230:9000/${details.past_surgeries}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                <i className="bi bi-file-arrow-down-fill"></i>
                                            </a>
                                        )}
                                    </p>
                                    <p>
                                        Text Results:
                                        {details.text_result === "No" ? (
                                            <span>No</span>
                                        ) : (
                                            <a href={`http://13.233.162.230:9000/${details.test_result}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                <i className="bi bi-file-arrow-down-fill"></i>
                                            </a>
                                        )}
                                    </p>
                                    <p>Description: {details.description}</p>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p>Loading patient details...</p>
                )}

                <h4>Prescribed Medicines</h4>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Medicine Name</th>
                                <th>Morning</th>
                                <th>Noon</th>
                                <th>Night</th>
                                <th>Route Description</th>
                                <th>Days</th>
                                <th>Prescribed Date</th>
                                <th>Prescribed Doctor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicineDetails.map((medicine, index) => (
                                <tr key={index}>
                                    <td>{medicine.medicine_name}</td>
                                    <td>{medicine.morning}</td>
                                    <td>{medicine.noon}</td>
                                    <td>{medicine.night}</td>
                                    <td>{medicine.rout_descp}</td>
                                    <td>{medicine.days}</td>
                                    <td>{medicine.formatted_doctor_visit_date}</td>
                                    <td>{medicine.doctor_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default PatientDetailsModal;
