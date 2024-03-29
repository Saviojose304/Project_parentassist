import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Register.css'
import AlertBox from "../Alert";
import { useNavigate } from "react-router-dom";
function DoctorProfileUpdate() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [hospital, setHospital] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [specializationerror, setSpecializationerror] = useState('');
    const [hospitalerror, setHospitalError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const [submitClicked, setSubmitClicked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const user_child_id = parsedToken.userId;

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
                const response = await axios.get('http://13.233.162.230:9000/getDoctorData', { params: { user_child_id }});
                const userData = response.data;
                // Update the state with the user data
                setName(userData.name);
                setSpecialization(userData.specialization);
                setHospital(userData.hospital);
                setPhone(userData.phone);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [user_child_id]);

    const validateName = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Username cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter a username with at least 3 valid characters';
        }
    };

    const validatePhonenumber = (phone) => {
        var phone_regex = /^(\+\d{1,2}[- ]?)?\d{10}$/;
        var regex = /^\s/;
        if (phone.match(regex)) {
            return 'Phone number is required'
        }
        if (phone.match(phone_regex) && !(phone.match(/0{5,}/))) {
            return " ";
        } else {
            return "Please enter country code with phone number "
        }
    };

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

    const validatePassword = (password) => {
        var pwd_expression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
        var regex = /^\s/;
        if (password.match(regex)) {
            return "Password is required"
        }
        if (password.length <= 6) {
            return "Password minimum length is 6"
        }
        if (password.length >= 12) {
            return "Password maximum length is 12"
        }
        if (password.match(pwd_expression)) {
            return " "
        } else {
            return "Upper case, Lower case, Special character and Numeric letter are required in Password filed"
        }
    };

    const validateRepassword = (password, repassword) => {
        if (password !== repassword) {
            return 'Confirm password does not match'
        } else {
            return " "
        }
    };

    const handlename = (event) => {
        const newName = event.target.value;
        setName(newName);
        const errorMessage = validateName(newName);
        setNameError(errorMessage);
    }

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

    const handlePhone = (eventphn) => {
        const phoneNew = eventphn.target.value;
        setPhone(phoneNew);
        const phonenumberMessage = validatePhonenumber(phoneNew);
        setPhoneError(phonenumberMessage);
    }

    const handlePass = (eventpass) => {
        const passNew = eventpass.target.value;
        setPassword(passNew);
        const passwordMessage = validatePassword(passNew);
        setPasswordError(passwordMessage);
    }

    const handleRepass = (eventrepass) => {
        const repassNew = eventrepass.target.value;
        setRepassword(repassNew);
        const rePasswordMessage = validateRepassword(password, repassNew);
        setRepasswordError(rePasswordMessage);

    }

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const togglegeneral = () => {
        setShowGeneral(!isshowgeneral);
        setShowPass(!isshowpass);
    };

    const togglepass = () => {
        setShowPass(!isshowpass);
        setShowGeneral(!isshowgeneral);
    };

    const handleCancel = () => {
        navigate('/Doctor');
    }

    const handleGeneralData = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);
        try {
            const response = await axios.put('http://13.233.162.230:9000/Doctorprofileupdate', { name, specialization,hospital, phone, user_child_id });
            if (response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Profile Update Successfully', show: true });
            }
        } catch (error) {
            if (error.response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Error updating child profile', show: true });
            }
        }
    };
    const handleUserPass = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);

        try {
            const response = await axios.put('http://13.233.162.230:9000/ProfilePassUpdate', { password, user_child_id });
            if (response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Password Update Successfully', show: true });
            }
        } catch (error) {
            if (error.response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Error updating password', show: true });
            }
        }
    };

    return (
        <>
            <div className="container light-style flex-grow-1 container-p-y">
                <h4 className="font-weight-bold py-3 mb-4">Account settings</h4>

                <div className="card overflow-hidden">
                    <div className="row no-gutters row-bordered row-border-light">
                        <div className="col-md-3 pt-0">
                            <div className="list-group list-group-flush account-settings-links">
                                <div className={isshowgeneral ? 'list-group-item list-group-item-action active' : 'list-group-item list-group-item-action'} onClick={togglegeneral} style={{ cursor: 'pointer' }} >General</div>
                                <div className={isshowpass ? 'list-group-item list-group-item-action active' : 'list-group-item list-group-item-action'} onClick={togglepass} style={{ cursor: 'pointer' }}>Change Password</div>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="tab-content">
                                <div className={isshowgeneral ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                    <h3 className="mb-3 text-center">Profile</h3>
                                    <div className="">
                                        <span><i className="bi bi-person-fill icon"></i></span>
                                        <input className="edit_pro" type="text" placeholder="Enter your name" name="name" value={name} onChange={handlename} required />
                                        <div className="red-text" id="name_err">{nameError}</div> <br />
                                    </div>
                                    <div className="">
                                        <span><i class="bi bi-award-fill icon"></i></span>
                                        <input type="text" placeholder="Specialization (eg:General Medicine)" name="specialization" value={specialization} onChange={handleSpecialization} required />
                                        <div className="red-text" id="name_err">{specializationerror}</div> <br />
                                    </div>

                                    <div className="">
                                        <span><i className="bi bi-hospital-fill icon"></i></span>
                                        <input type="text" placeholder="Enter doctor hospital name" name="hospital" value={hospital} onChange={handleHospital} required />
                                        <div className="red-text" id="name_err">{hospitalerror}</div> <br />
                                    </div>
                                    <div className="">
                                        <span><i className="bi bi-telephone-fill icon"></i></span>
                                        <input className="edit_pro" type="text" placeholder="Enter your number" name="phone" value={phone} onChange={handlePhone} required />
                                        <div className="red-text" id="name_err">{phoneError}</div> <br />
                                    </div>

                                    <div className="text-right mt-1 pb-3 ">
                                        <button type="button" className="btn btn-primary" onClick={handleGeneralData}>Save changes</button>&nbsp;
                                        <button type="button" className="btn btn-default" onClick={handleCancel}>Cancel</button>
                                    </div>
                                </div>
                                <div className={isshowpass ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                    <h3 className="mb-3 text-center">Profile</h3>
                                    <div className="">
                                        <span><i className="bi bi-lock-fill icon"></i></span>
                                        <input type="password" placeholder="Enter your password" name="password" value={password} onChange={handlePass} required />
                                        <div className="red-text" id="name_err">{passwordError}</div> <br />
                                    </div>

                                    <div className="">
                                        <span><i className="bi bi-lock-fill icon"></i></span>
                                        <input type="password" placeholder="Enter your re-password" name="repassword" value={repassword} onChange={handleRepass} required />
                                        <div className="red-text" id="name_err">{repasswordError}</div> <br />
                                    </div>

                                    <div className="text-right mt-1 pb-3">
                                        <button type="button" className="btn btn-primary" onClick={handleUserPass}>Save changes</button>&nbsp;
                                        <button type="button" className="btn btn-default" onClick={handleCancel}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
            </div>
        </>
    );
}

export default DoctorProfileUpdate;