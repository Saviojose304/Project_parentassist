import React, { useState } from "react";
import axios from "axios";
import './Register.css'
import AlertBox from "./Alert";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });

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
        const phoneRegex = /^\+(\d{1,2})?\d{10}$/;
        const emptyRegex = /^\s*$/;

        if (emptyRegex.test(phone)) {
            return 'Phone number is required';
        }

        if (!phoneRegex.test(phone) || phone.length !== 13) {
            return 'Please enter a valid phone number with a country code starting with "+" and exactly 10 digits';
        }

        return '';
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
        setNameError(errorMessage)
    }

    const handleaddress = (eventadrs) => {
        const addressNew = eventadrs.target.value;
        setAddress(addressNew);
        const adressErrorMessage = validateAdress(addressNew);
        setAddressError(adressErrorMessage);


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

    const navigate = useNavigate();
    const [submitClicked, setSubmitClicked] = useState(false);

    const login = useGoogleLogin({

        onSuccess: async (codeResponse) => {
            // setUser(codeResponse);
            if (codeResponse.access_token) {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${codeResponse.access_token}`,
                        Accept: 'application/json'
                    }
                });

                if (res.data.name && res.data.email) {
                    setSubmitClicked(true);
                    try {
                        const response = await axios.post('http://13.233.162.230:9000/google-signup', {
                            gname: res.data.name,
                            gemail: res.data.email
                        });
                        const token = response.data;
                        localStorage.setItem('token', JSON.stringify(token));
                        navigate('/ChildProfile'); // Navigate to the desired route
                    } catch (error) {
                        // console.log('Google Sign-In failed');
                        if (error.response && error.response.status === 400) {
                            // Email already registered
                            setAlertInfo({ variant: 'danger', message: 'Email is already registered', show: true });
                        } else {
                            // Other error occurred
                            setAlertInfo({ variant: 'danger', message: 'An error occurred. Please try again later.', show: true });
                        }
                    }
                }

            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });



    const handlegoogleSiginIn = async () => {
        login();
    };


    const token = JSON.parse(localStorage.getItem('token'));

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nameError && !addressError && !emailError && !phoneError && !passwordError && !repasswordError) {
            try {
                setSubmitClicked(true);
                const response = await axios.post('http://13.233.162.230:9000/signup', { name, address, email, phone, password });
                if (response.status === 200) {
                    setAlertInfo({ variant: 'success', message: 'Registration successful. Verification email sent', show: true });
                }
                // navigate('/Login')
                // console.log(response.data);
            } catch (error) {
                // console.error(error);
                if (error.response && error.response.status === 400) {
                    // Email already registered
                    setAlertInfo({ variant: 'danger', message: 'Email is already registered', show: true });
                } else {
                    // Other error occurred
                    setAlertInfo({ variant: 'danger', message: 'An error occurred. Please try again later.', show: true });
                }
            }
        }

    };
    return (
        <>
            <section className="vh-100 bg-img">
                <div className="container-fluid" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                                <div className="card-body p-5 text-center">
                                    <h3 className="mb-5">Register Your Account</h3>
                                    <form onSubmit={handleSubmit} autoComplete="off" className="row">
                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-person-fill icon"></i></span>
                                            <input type="text" placeholder="Enter your name" name="name" value={name} onChange={handlename} required />
                                            <div className="red-text" id="name_err">{nameError}</div> <br />
                                        </div>
                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-house-fill icon"></i></span>
                                            <input type="text" placeholder="Enter your address" name="address" value={address} onChange={handleaddress} required />
                                            <div className="red-text" id="name_err">{addressError}</div> <br />
                                        </div>
                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-envelope-fill icon"></i></span>
                                            <input type="email" placeholder="Enter your e-mail" name="email" value={email} onChange={handleEmail} required />
                                            <div className="red-text" id="name_err">{emailError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-telephone-fill icon"></i></span>
                                            <input type="text" placeholder="Enter your number" name="phone" value={phone} onChange={handlePhone} required />
                                            <div className="red-text" id="name_err">{phoneError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-lock-fill icon"></i></span>
                                            <input type="password" placeholder="Enter your password" name="password" value={password} onChange={handlePass} required />
                                            <div className="red-text" id="name_err">{passwordError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-lock-fill icon"></i></span>
                                            <input type="password" placeholder="Enter your re-password" name="repassword" value={repassword} onChange={handleRepass} required />
                                            <div className="red-text" id="name_err">{repasswordError}</div> <br />
                                        </div>

                                        <div className="col-12">
                                            <button
                                                style={{ width: '50%' }}
                                                className="btn btn-primary btn-lg btn-block"
                                                type="submit"
                                                id="submit"
                                                name="submit"
                                            >
                                                Sign Up
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
                                    <p className="small fw-bold mt-2 pt-1 mb-0">
                                        Already have an account? <a href="/Login" className="link-danger text-decoration-none">Log In</a>
                                    </p>
                                    <hr className="my-4" />
                                    <div className="col-12 justify-content-center d-flex">
                                        <button
                                            className="btn btn-lg btn-block btn-primary"
                                            style={{ backgroundColor: '#dd4b39', width: '50%' }}
                                            type="submit"
                                            onClick={handlegoogleSiginIn}
                                        >
                                            <i className="bi bi-google me-2"></i> Sign in with Google
                                        </button>
                                        {/* <button
                                            className="btn btn-lg btn-block btn-primary"
                                            style={{ backgroundColor: '#075E54', width: '50%' }}
                                            type="submit"
                                        >
                                            <i class="bi bi-whatsapp"></i> Sign in with WhatsApp
                                        </button> */}
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

export default Register;