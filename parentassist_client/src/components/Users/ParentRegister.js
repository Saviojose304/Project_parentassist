import React, { useState } from "react";
import axios from "axios";
import '../Register.css'
import AlertBox from "../Alert";
function ParentRegister() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('male');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const user_child_id = parsedToken.userId;

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

    const validateAge = (age) => {
        if (age < 40) {
            return "Age must be greater than or equla to 40";
        } else {
            return " ";
        }
    };

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
    const handleGenderChange = (event) => {
        setGender(event.target.value);
        console.log(event.target.value);
    };

    const handleage = (eventage) => {
        const ageNew = parseInt((eventage).target.value);
        setAge(ageNew);
        const ageErrorMessage = validateAge(ageNew);
        setAgeError(ageErrorMessage);
    }


    const handleEmail = (eventemail) => {
        const newEmail = eventemail.target.value;
        setEmail(newEmail);
        const emailErrorMessage = validateEmail(newEmail);
        setEmailError(emailErrorMessage);



    }

    const handlePhone = (eventphn) => {
        const phoneNew = eventphn.target.value;
        setPhone(phoneNew);
        const phonenumberMessage = validatePhonenumber(phoneNew);
        setPhoneError(phonenumberMessage);


    }

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitClicked(true);

        try {
            const response = await axios.post('http://13.233.162.230:9000/parent-register', { name, address, gender, age, email, phone, user_child_id });
            if (response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Registration successful. Notification Email Sent', show: true });
            }
        } catch (error) {

            if (error.response && error.response.status === 400) {
                // Email already registered
                setAlertInfo({ variant: 'danger', message: 'Email is already registered', show: true });
            } else {
                // Other error occurred
                setAlertInfo({ variant: 'danger', message: 'An error occurred. Please try again later.', show: true });
            }
        }

    };


    return (
        <>
            <section className="vh-100 bg-img">
                <div className="container-fluid" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                                <div className="card-body p-5 text-center">
                                    <h3 className="mb-5">Add Your Parent</h3>
                                    <form onSubmit={handleSubmit} autoComplete="off" className="row">
                                        <div className="">
                                            <span><i className="bi bi-person-fill icon"></i></span>
                                            <input type="text" placeholder="Enter parent name" name="name" value={name} onChange={handlename} required />
                                            <div className="red-text" id="name_err">{nameError}</div> <br />
                                        </div>
                                        <div className="">
                                            <span><i className="bi bi-house-fill icon"></i></span>
                                            <input type="text" placeholder="Enter parent address" name="address" value={address} onChange={handleaddress} required />
                                            <div className="red-text" id="name_err">{addressError}</div> <br />
                                        </div>
                                        <div className="d-flex ms-3">
                                            <label>Gender</label>
                                            <div className="col-8 ms-0">
                                                <input style={{width:'10%'}} type="radio" name="gender" value="male" checked={gender === 'male'} onChange={handleGenderChange} className="ms-0" />Male
                                                <input style={{width:'10%'}} type="radio" name="gender" value="female" checked={gender === 'female'} onChange={handleGenderChange} className="ms-0" />Female
                                            </div>
                                        </div>

                                        <div className="">
                                            <span><i className="bi bi-person-fill icon"></i></span>
                                            <input type="number" inputMode="numeric" placeholder="Enter parent age" min={0} name="age" value={age} onChange={handleage} required />
                                            <div className="red-text" id="name_err">{ageError}</div> <br />
                                        </div>

                                        <div className="">
                                            <span><i className="bi bi-envelope-fill icon"></i></span>
                                            <input type="email" placeholder="Enter parent e-mail" name="email" value={email} onChange={handleEmail} required />
                                            <div className="red-text" id="name_err">{emailError}</div> <br />
                                        </div>

                                        <div className="">
                                            <span><i className="bi bi-telephone-fill icon"></i></span>
                                            <input type="text" placeholder="Enter parent phone number" name="phone" value={phone} onChange={handlePhone} required />
                                            <div className="red-text" id="name_err">{phoneError}</div> <br />
                                        </div>

                                        <div className="col-12">
                                            <button
                                                style={{ width: '50%' }}
                                                className="btn btn-primary btn-lg btn-block"
                                                type="submit"
                                                id="submit"
                                                name="submit"
                                            >
                                                Submit
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ParentRegister;