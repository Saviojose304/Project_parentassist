import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Register.css'
import AlertBox from "../Alert";
import { useNavigate } from "react-router-dom";
function ChildProfileUpdate() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const navigate = useNavigate();
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
                const response = await axios.get('http://13.233.162.230:9000/getUserData', { params: { user_child_id }});
                const userData = response.data;
                // Update the state with the user data
                setName(userData.name);
                setAddress(userData.address);
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

    const validateAdress = (address) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (address.length >= 3 && address.match(regex)) {
            return "Address cannot start with a space";
        }
        if (address.match(letters) && address.length > 10) {
            return '';
        } else {
            return 'Address must be at least 10 characters long.';
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

    const handleaddress = (eventadrs) => {
        const addressNew = eventadrs.target.value;
        setAddress(addressNew);
        const adressErrorMessage = validateAdress(addressNew);
        setAddressError(adressErrorMessage);
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
        navigate('/ChildProfile');
    }

    const handleGeneralData = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);
        try {
            const response = await axios.put('http://13.233.162.230:9000/Childprofileupdate',{name, address, phone, user_child_id});
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
            const response = await axios.put('http://13.233.162.230:9000/ProfilePassUpdate',{password, user_child_id});
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
                                        <span><i className="bi bi-house-fill icon"></i></span>
                                        <input className="edit_pro" type="text" placeholder="Enter your address" name="address" value={address} onChange={handleaddress} required />
                                        <div className="red-text" id="name_err">{addressError}</div> <br />
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

export default ChildProfileUpdate;