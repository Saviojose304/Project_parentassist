import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Register.css';
import AlertBox from "../Alert";
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import TherapyBookingBilling from "../Billing Page/TherapyBookingBilling";
function ParentTherapyBooking() {
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [specialization, setSpecialization] = useState("");
    const [hospital, setHospital] = useState("");
    const [time, setTime] = useState();
    const [timeerror, setTimeerror] = useState('');
    const [doctorid, setDoctorid] = useState('');
    const [bookingtoken, setBookingToken] = useState('');
    const [bookingtime, setBookingTime] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });
    const currentDate = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [editMode, setEditMode] = useState(false);
    const [disabledDates, setDisabledDates] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [showTherapyBillingModal, setShowTherapyBillingModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);
    const parent_user_id = parsedToken.userId;


    useEffect(() => {
        // console.log("Fetching data...");
        axios.get("http://13.233.162.230:9000/doctorslist")
            .then((response) => {
                // Filter the doctors based on the desired specializations
                const filteredDoctors = response.data.filter((doctor) => {
                    const specializations = doctor.specialization || [];
                    // Check if any of the desired specializations exist in the doctor's specializations
                    return specializations.includes("General Medicine") ||
                        specializations.includes("Psychologist") ||
                        specializations.includes("Psychiatrist") ||
                        specializations.includes("Psychoanalyst");
                });
                // Set the filtered doctor list in state
                setDoctorList(filteredDoctors);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleDoctorChange = (event) => {
        const selectedDoctorValue = event.target.value;

        setSelectedDoctor(selectedDoctorValue);

        const selectedDoctorObject = doctorList.find((doctor) => doctor.name === selectedDoctorValue);

        if (selectedDoctorObject) {
            const doctorId = selectedDoctorObject.doctor_id; // Extract doctor_id from the found object
            setDoctorid(doctorId); // Set the state variable with the extracted doctor_id
        } else {
            // Handle the case where no matching doctor is found
            console.error(`Doctor not found for name: ${selectedDoctor}`);
            // You can choose to set doctorId to a default value or show an error message.
        }
    };

    useEffect(() => {
        if (doctorid) { // Check if doctorid is truthy
            axios.get(`http://13.233.162.230:9000/doctorslist/${doctorid}`).then((response) => {
                const { doctorDetails, leaveDays } = response.data;
                setSpecialization(doctorDetails.specialization);
                setHospital(doctorDetails.hospital);
                setDisabledDates(leaveDays);
            })
                .catch((error) => {
                    console.error("Error fetching doctor details:", error);
                });
        }
    }, [doctorid]);

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const handletime = (eventtime) => {
        const inputTime = eventtime.target.value;
        setTime(eventtime.target.value);

        const timeRegex = /^(0[9-9]|1[0-6]):[0-5][0-9]$/;

        if (timeRegex.test(inputTime)) {
            // Valid time format
            setTime(inputTime);
            setTimeerror('');
        } else {
            // Invalid time format
            setTime('');
            setTimeerror('Please enter a valid time between 9:30 AM and 5:00 PM');
        }
    };

    const closeModal = () => {
        setShowTherapyBillingModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitClicked(true);
            // Send your request to the backend and handle the response
            const response = await axios.post("http://13.233.162.230:9000/therapyBooking", {
                selectedDate, time, parent_user_id, doctorid 
            });
    
            if (response.data.success) {
                //navigate(`/therapy-booking-billing/${selectedDate}/${parent_user_id}/${doctorid}`);
                setSubmitClicked(false)
                setShowTherapyBillingModal(true);
            } else {
                console.error("Booking failed:", response.data.message);
                setAlertInfo({ variant: 'danger', message: response.data.error, show: true });
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.status === 400) {
                //Already registered
                setAlertInfo({ variant: 'danger', message: error.response.data.error, show: true });

            } else {
                // Other error occurred
                setAlertInfo({ variant: 'danger', message: 'An error occurred. Please try again later.', show: true });
            }

            if (error.response.data.error_code) {
                const customErrorCode = error.response.data.error_code;
                setAlertInfo({ variant: 'danger', message: 'Selected time slot is not available', show: true });
                customErrorCode && setAvailableTimeSlots(error.response.data.availableTimeSlots);
            }
        }

    };

    return (
        <>
            <section className="vh-100 bg-img">
                <div className="container-fluid" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className={selectedDoctor ? (disabledDates.length > 0 ? 'col-md-4' : 'col-12 col-md-4 col-lg-4 col-xl-4') : 'col-12 col-md-4 col-lg-4 col-xl-4'}>
                            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                                <div className="card-body p-5 text-center">
                                    <h3 className="mb-5">Book Appoinment</h3>
                                    <form onSubmit={handleSubmit} autoComplete="off" className="row">
                                        <div className="">
                                            <span><i className="bi bi-person-fill icon"></i></span>
                                                <select id="selectdoctor" value={selectedDoctor} onChange={handleDoctorChange}
                                                    required >
                                                    <option value="">Select a doctor</option>
                                                    {doctorList.map((doctor) => (
                                                        <option id="sel_doc" key={doctor.id} value={doctor.id}>
                                                            {doctor.name}
                                                        </option>
                                                    ))}
                                                </select>
                                        </div>
                                        <div className="">
                                            <span><i class="bi bi-award-fill icon"></i></span>
                                                <input type="text" placeholder="Specialization (eg:General Medicine)" readOnly name="specialization" value={specialization}  required />
                                        </div> <br />

                                        <div className="">
                                            <span><i className="bi bi-hospital-fill icon"></i></span>
                                                <input type="text" placeholder="Hospital name" readOnly name="hospital" value={hospital}  required />
                                        </div> <br />
                                        <div className="">
                                            <input type="date" id="selectdate" min={currentDate} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
                                        </div>
                                        <div className="">
                                            <input type="time" placeholder="Enter Time" name="time" value={time} min="09:30" max="17:00" onChange={handletime} required />
                                            <div className="red-text" id="name_err">{timeerror}</div> <br />
                                        </div>
                                        <div className="col-12">
                                            <button
                                                style={{ width: '70%' }}
                                                className="btn btn-primary btn-lg btn-block"
                                                type="submit"
                                                id="submit"
                                                name="submit"
                                            >
                                                Book Appointment
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
                                        {bookingtoken && (
                                            <div className={`alert alert-success alert-dismissible`} role="alert">
                                                Your appointment token: {bookingtoken} and time : {bookingtime}
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="alert"
                                                    aria-label="Close"
                                                    onClick={() => setBookingToken(null)}
                                                ></button>
                                            </div>
                                        )}
                                        {/* Display available time slots */}
                                        {availableTimeSlots.length > 0 && (
                                            <div className="alert alert-info">
                                                Available Time Slots:
                                                <ul>
                                                    {availableTimeSlots.map((slot, index) => (
                                                        <li key={index}>{slot}</li>
                                                    ))}
                                                </ul>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="alert"
                                                    aria-label="Close"
                                                    onClick={() => setAvailableTimeSlots([])}
                                                ></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {selectedDoctor && (
                            <div className={selectedDoctor ? (disabledDates.length > 0 ? 'col-md-4' : ' ') : 'col-12 col-md-4 col-lg-4 col-xl-4'}>
                                {disabledDates.length > 0 && (
                                    <div className="card mt-4">
                                        <div className="card-header">Doctor Leave Dates</div>
                                        <div className="card-body">
                                            <ul>
                                                {disabledDates.map((leaveDate, index) => (
                                                    <li key={index}>
                                                        {leaveDate.start} {leaveDate.start !== leaveDate.end && `to ${leaveDate.end}`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Modal show={showTherapyBillingModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Therapy Booking Billing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TherapyBookingBilling
                        selectedDate={selectedDate}
                        parentUserId={parent_user_id}
                        doctorId={doctorid}
                        closeModal={closeModal} 
                    />
                </Modal.Body>
            </Modal>

        </>
    );
}

export default ParentTherapyBooking;