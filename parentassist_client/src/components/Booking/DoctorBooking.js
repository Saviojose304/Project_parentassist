import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Register.css';
import AlertBox from "../Alert";
import { useLocation } from "react-router-dom";


function DoctorBooking() {
    const location = useLocation();
    const appointmentDetails = location.state ? location.state.appointmentDetails : null;
    const doctorDetails = location.state ? location.state.doctorDetails : null;
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(
        appointmentDetails ? appointmentDetails.doctor_name : ""
    );
    const [specialization, setSpecialization] = useState("");
    const [hospital, setHospital] = useState("");
    const [time, setTime] = useState();
    const [specializationerror, setSpecializationerror] = useState('');
    const [hospitalerror, setHospitalError] = useState('');
    const [gender, setGender] = useState(" ");
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
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const user_id = parsedToken.userId;

    useEffect(() => {
        // console.log("Fetching data...");
        axios.get("http://13.233.162.230:9000/doctorslist")
            .then((response) => {
                // console.log("Data received:", response.data);
                setDoctorList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        if (appointmentDetails) {
            setEditMode(true);
            setSpecialization(doctorDetails.specialization);
            setHospital(doctorDetails.hospital);
            setTime(appointmentDetails.time);
            setGender(appointmentDetails.parent_gender);
            setSelectedDate(appointmentDetails.formatted_date);

        }
    }, [appointmentDetails]);

    // console.log(doctorList);

    const validateSpecial = (specialization) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (specialization.length >= 3 && specialization.match(regex)) {
            return "Specialization cannot start with a space";
        }
        if (specialization.match(letters) && specialization.length > 3) {
            return '';
        } else {
            return 'Please Enter Specialization';
        }
    };

    const validateHsptl = (hospital) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (hospital.length >= 3 && hospital.match(regex)) {
            return "Hospital cannot start with a space";
        }
        if (hospital.match(letters) && hospital.length > 5) {
            return '';
        } else {
            return 'Please Enter Hospital Name';
        }
    };

    // const selectedDoctorObject = doctorList.find((doctors) => doctors.name === selectedDoctor);

    // console.log(selectedDoctorObject);

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

    //console.log(disabledDates);

    const handleSpecialization = (eventspcl) => {
        const specilanew = eventspcl.target.value;
        setSpecialization(specilanew);
        const specilamsg = validateSpecial(specilanew);
        setSpecializationerror(specilamsg);
    }

    const handleHospital = (eventhsptl) => {
        const hsptlnew = eventhsptl.target.value;
        setHospital(hsptlnew);
        const hsptlmsg = validateHsptl(hsptlnew);
        setHospitalError(hsptlmsg);
    }


    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    // function getCurrentTime() {
    //     const now = new Date();
    //     const hours = now.getHours().toString().padStart(2, "0");
    //     const minutes = now.getMinutes().toString().padStart(2, "0");
    //     return `${hours}:${minutes}`;
    // }


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitClicked(true);

        //console.log(gender);

        try {
            if (editMode) {
                // Handle update appointment logic
                const response = await axios.put(`http://13.233.162.230:9000/updatedoctorbooking/${doctorDetails.doctor_id}/${appointmentDetails.formatted_date}`,
                    {
                        selectedDate,
                        time,
                        gender,
                    }
                );
                if (response.status === 200) {
                    setAlertInfo({ variant: 'success', message: 'Appointment Updated Successfully', show: true });
                    // You may handle other state updates or actions here
                }
            } else {
                // Handle create appointment logic (as you were doing before)
                const response = await axios.post('http://13.233.162.230:9000/doctorbooking', { selectedDate, time, gender, doctorid });
                console.log(selectedDate, time, gender, doctorid);
                if (response.status === 200) {
                    setAlertInfo({ variant: 'success', message: 'Appointment Booked Successfully', show: true });
                    setBookingToken(response.data.token)
                    setBookingTime(response.data.appointmentTime)

                }
            }
        } catch (error) {

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
            // if (error.response.data.error_code === 3446) {
            //     setAlertInfo({ variant: 'danger', message: "You already have an appointment at the same date and time", show: true });
            // }
        }
    };


    return (
        <>
            <section className="vh-100 bg-img">
                <div className="container-fluid" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
                    <div className="row d-flex justify-content-center align-items-center h-100">
                            <div  className={selectedDoctor ? (disabledDates.length > 0 ? 'col-md-4' : 'col-12 col-md-4 col-lg-4 col-xl-4') : 'col-12 col-md-4 col-lg-4 col-xl-4'}>
                                <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                                    <div className="card-body p-5 text-center">
                                        <h3 className="mb-5">Book Appoinment</h3>
                                        <form onSubmit={handleSubmit} autoComplete="off" className="row">
                                            {editMode ? (
                                                <div className="">
                                                    <select
                                                        className="form-select"
                                                        onChange={(e) => setGender(e.target.value)}
                                                        required
                                                        aria-readonly
                                                        value={gender}
                                                        style={{ pointerEvents: 'none', paddingRight: '1rem' }}
                                                    >
                                                        <option value="male">Father</option>
                                                        <option value="female">Mother</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="">
                                                    <select
                                                        class="form-select"
                                                        onChange={(e) => setGender(e.target.value)}
                                                        required
                                                    >
                                                        <option selected>For Whom</option>
                                                        <option value="male">Father</option>
                                                        <option value="female">Mother</option>
                                                    </select>
                                                </div>
                                            )}
                                            <br />

                                            <div className="">
                                                <span><i className="bi bi-person-fill icon"></i></span>
                                                {editMode ? (
                                                    <select style={{ pointerEvents: 'none', paddingRight: '1rem' }} value={selectedDoctor} onChange={handleDoctorChange}
                                                        required aria-readonly >
                                                        <option value="">Select a doctor</option>
                                                        {doctorList.map((doctor) => (
                                                            <option key={doctor.id} value={doctor.id}>
                                                                {doctor.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <select value={selectedDoctor} onChange={handleDoctorChange}
                                                        required >
                                                        <option value="">Select a doctor</option>
                                                        {doctorList.map((doctor) => (
                                                            <option key={doctor.id} value={doctor.id}>
                                                                {doctor.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                            <div className="">
                                                <span><i class="bi bi-award-fill icon"></i></span>
                                                {editMode ? (
                                                    <input type="text" placeholder="Specialization (eg:General Medicine)" readOnly name="specialization" value={specialization} required />
                                                ) : (
                                                    <input type="text" placeholder="Specialization (eg:General Medicine)" readOnly name="specialization" value={specialization} onChange={handleSpecialization} required />
                                                )}
                                                <div className="red-text" id="name_err">{specializationerror}</div> <br />
                                            </div>

                                            <div className="">
                                                <span><i className="bi bi-hospital-fill icon"></i></span>
                                                {editMode ? (
                                                    <input type="text" placeholder="Enter doctor hospital name" readOnly name="hospital" value={hospital} onChange={handleHospital} required />
                                                ) : (
                                                    <input type="text" placeholder="Enter doctor hospital name" readOnly name="hospital" value={hospital} onChange={handleHospital} required />
                                                )}
                                                <div className="red-text" id="name_err">{hospitalerror}</div> <br />
                                            </div>
                                            <div className="">
                                                <input type="date" min={currentDate} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
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
                                                    {editMode ? "Update Appointment" : "Book Appointment"}
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
        </>
    );
}

export default DoctorBooking;