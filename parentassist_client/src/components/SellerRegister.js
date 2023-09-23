import React, { useState } from "react";
import axios from "axios";
import './Register.css'
import AlertBox from "./Alert";
import { useNavigate } from "react-router-dom";
function SellerRegister() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [testResultFile, setTestResultFile] = useState(null);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [uploadFileTestError, setUploadFileTestError] = useState('');
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
        // Regular expression pattern to allow letters, spaces, and newlines
        var pattern = /^[A-Za-z \n]*$/;

        // Check if address starts with a space
        var startsWithSpace = /^\s/.test(address);

        // Check if address is at least 10 characters long
        var isLengthValid = address.length >= 10;

        if (!startsWithSpace && isLengthValid && pattern.test(address)) {
            return ''; // Valid address
        } else {
            if (startsWithSpace) {
                return 'Address cannot start with a space';
            } else if (!isLengthValid) {
                return 'Address must be at least 10 characters long.';
            } else {
                return 'Invalid characters in address.';
            }
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

    const validateFileTest = (file) => {
        const allowedTypes = ['application/pdf'];
        const maxSizeMB = 2; // The maximum file size as needed (in megabytes)

        if (!allowedTypes.includes(file.type)) {
            setUploadFileTestError('Invalid file type. Please select a valid video file.');
            return false;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setUploadFileTestError('File size exceeds the maximum allowed size.');
            return false
        }

        return true;
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

    const handleTestResultFileChange = (e) => {
        const file = e.target.files[0];
        if (validateFileTest(file)) {
            setTestResultFile(file);
        }
    };

    const navigate = useNavigate();
    const [submitClicked, setSubmitClicked] = useState(false);

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitClicked(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('address', address);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('testResultFile', testResultFile);


            const response = await axios.post('http://localhost:9000/sellerRegister', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            
            if (response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Registration successful Wait for the Admin Response', show: true });
            }
            // navigate('/Login')
            // console.log(response.data);
            setName('');
            setAddress('');
            setEmail('');
            setPhone('');
            setPassword('');
            setRepassword('');
            setTestResultFile('');
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
                                            <input type="text" placeholder="Enter your company name" name="name" value={name} onChange={handlename} required />
                                            <div className="red-text" id="name_err">{nameError}</div> <br />
                                        </div>
                                        <div className="col-6 col-md-6">
                                            <textarea
                                                placeholder="Enter your company address"
                                                name="address"
                                                value={address}
                                                onChange={handleaddress}
                                                required
                                                rows="3" // You can adjust the number of rows as needed
                                                className="form-control"

                                            />
                                            <div className="red-text" id="name_err">{addressError}</div> <br />
                                        </div>
                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-envelope-fill icon"></i></span>
                                            <input type="email" placeholder="Enter your company e-mail" name="email" value={email} onChange={handleEmail} required />
                                            <div className="red-text" id="name_err">{emailError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-telephone-fill icon"></i></span>
                                            <input type="text" placeholder="Enter your company number" name="phone" value={phone} onChange={handlePhone} required />
                                            <div className="red-text" id="name_err">{phoneError}</div> <br />
                                        </div>

                                        <div className="col-4 col-md-4">
                                            <span><i className="bi bi-lock-fill icon"></i></span>
                                            <input type="password" placeholder="Enter  password" name="password" value={password} onChange={handlePass} required />
                                            <div className="red-text" id="name_err">{passwordError}</div> <br />
                                        </div>

                                        <div className="col-4 col-md-4">
                                            <span><i className="bi bi-lock-fill icon"></i></span>
                                            <input type="password" placeholder="Enter  re-password" name="repassword" value={repassword} onChange={handleRepass} required />
                                            <div className="red-text" id="name_err">{repasswordError}</div> <br />
                                        </div>

                                        <div className="col-4 col-md-4">
                                            <label htmlFor="testResultFile" className="form-label">Submit CDSCO/SDSCO(PDF)</label>
                                            <input
                                                type="file"
                                                id="file2" name="file2"
                                                className="form-control"
                                                accept=".pdf"
                                                onChange={handleTestResultFileChange}
                                                required
                                            />
                                            <div style={{ color: 'red' }} id="name_err">{uploadFileTestError}</div> <br />
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
                                    <hr className="my-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SellerRegister;