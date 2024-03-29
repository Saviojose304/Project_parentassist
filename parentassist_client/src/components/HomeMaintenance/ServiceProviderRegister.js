import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../components/Register.css'
import AlertBox from "../Alert";
import { useNavigate } from "react-router-dom";
function ServiceProviderRegister() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [adharNumber, setAdharNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addressLine1Error, setAddressLine1Error] = useState('');
    const [addressLine2Error, setAddressLine2Error] = useState('');
    const [pinCodeError, setPinCodeError] = useState('');
    const [adharNumberError, setAdharNumberError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [pdfFileError, setPdfFileError] = useState(null);
    const navigate = useNavigate();
    const [submitClicked, setSubmitClicked] = useState(false);
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

    const validateAdressLine1 = (addressLine1) => {
        // Regular expression pattern to allow letters, spaces, and newlines
        var pattern = /^[A-Za-z0-9 .\n]*$/;

        // Check if address starts with a space
        var startsWithSpace = /^\s/.test(addressLine1);

        // Check if address is at least 10 characters long
        var isLengthValid = addressLine1.length >= 5;

        // Check if the same alphabet does not occur for 5 times consecutively
        var noConsecutiveSameAlphabet = !/(.)\1\1\1\1/.test(addressLine1);

        if (!startsWithSpace && isLengthValid && pattern.test(addressLine1) && noConsecutiveSameAlphabet) {
            return ''; // Valid address
        } else {
            if (startsWithSpace) {
                return 'Address cannot start with a space';
            } else if (!isLengthValid) {
                return 'Address must be at least 5 characters long.';
            } else if (!noConsecutiveSameAlphabet) {
                return 'Same alphabet cannot occur for 5 times consecutively.';
            } else {
                return 'Invalid characters in address.';
            }
        }
    };


    const validateAdressLine2 = (addressLine2) => {
        // Regular expression pattern to allow letters, spaces, and newlines
        var pattern = /^[A-Za-z0-9 .\n]*$/;

        // Check if address starts with a space
        var startsWithSpace = /^\s/.test(addressLine2);

        // Check if address is at least 10 characters long
        var isLengthValid = addressLine2.length >= 5;

        // Check if the same alphabet does not occur for 5 times consecutively
        var noConsecutiveSameAlphabet = !/(.)\1\1\1\1/.test(addressLine2);

        if (!startsWithSpace && isLengthValid && pattern.test(addressLine2) && noConsecutiveSameAlphabet) {
            return ''; // Valid address
        } else {
            if (startsWithSpace) {
                return 'Address cannot start with a space';
            } else if (!isLengthValid) {
                return 'Address must be at least 5 characters long.';
            } else if (!noConsecutiveSameAlphabet) {
                return 'Same alphabet cannot occur for 5 times consecutively.';
            } else {
                return 'Invalid characters in address.';
            }
        }
    };


    const validatePinCode = (pincode) => {
        // Regular expression pattern to allow only 6 numeric characters
        var pattern = /^\d{6}$/;

        if (pattern.test(pincode)) {
            return ''; // Valid pincode
        } else {
            return 'Invalid pincode. Please enter exactly 6 numeric characters.';
        }
    };

    const validateAdharNumber = (adharNumber) => {
        // Regular expression pattern to allow only 21 alphanumeric characters
        var pattern = /^[0-9]{12}$/;

        if (pattern.test(adharNumber)) {
            return ''; // Valid CIN number
        } else {
            return 'Invalid Adhar number. Please enter exactly 12 Numbers.';
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

    const handlename = (event) => {
        const newName = event.target.value;
        setName(newName);
        const errorMessage = validateName(newName);
        setNameError(errorMessage)
    }

    const handleAddressLine1 = (eventadrs1) => {
        const addressLine1New = eventadrs1.target.value;
        setAddressLine1(addressLine1New);
        const addressErrorMessage = validateAdressLine1(addressLine1New);
        setAddressLine1Error(addressErrorMessage);

        // Update the combined address
        updateCombinedAddress(addressLine1New, addressLine2, pinCode);
    }

    const handleAddressLine2 = (eventadrs2) => {
        const addressLine2New = eventadrs2.target.value;
        setAddressLine2(addressLine2New);
        const addressErrorMessage = validateAdressLine2(addressLine2New);
        setAddressLine2Error(addressErrorMessage);

        // Update the combined address
        updateCombinedAddress(addressLine1, addressLine2New, pinCode);
    }

    const handlePinCode = (eventpin) => {
        const pinCodeNew = eventpin.target.value;
        setPinCode(pinCodeNew);
        const pinErrorMessage = validatePinCode(pinCodeNew);
        setPinCodeError(pinErrorMessage);

        // Update the combined address
        updateCombinedAddress(addressLine1, addressLine2, pinCodeNew);
    }

    const updateCombinedAddress = (line1, line2, pin) => {
        const combinedAddress = `${line1}, ${line2}, ${pin}`;
        setAddress(combinedAddress);
    }


    const handleAdharNumber = (eventcin) => {
        const adharnew = eventcin.target.value;
        setAdharNumber(adharnew);
        const adharErrorMessage = validateAdharNumber(adharnew);
        setAdharNumberError(adharErrorMessage);
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


    const handlePdfFileChange = (event) => {
        const selectedFile = event.target.files[0];

        // Check if a file is selected
        if (selectedFile) {
            // Check if the selected file is a PDF
            if (selectedFile.type === "application/pdf") {
                setPdfFile(selectedFile);
                setPdfFileError(" ");
            } else {
                // Reset the file input and show an error message
                event.target.value = null;
                setPdfFile(null);
                setPdfFileError("Please select a PDF file.")
                // You can display an error message to the user here
                //console.error("Please select a PDF file.");
            }
        }
    };

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setSubmitClicked(true);
    
            // Create a FormData object
            const formData = new FormData();
    
            // Append form fields to the FormData object
            formData.append('name', name);
            formData.append('address', address);
            formData.append('adharNumber', adharNumber);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('pdfFile', pdfFile);
    
            // Append other form fields if needed

            const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        console.log(formDataObject);

            
    
            // Make the Axios POST request
            const response = await axios.post('http://13.233.162.230:9000/serviceProviderRegister', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important: Set the content type to multipart/form-data
                },
            });
    
            if (response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Registration successful. Wait for the Admin Response', show: true });
                await new Promise(resolve => setTimeout(resolve, 10000));
                navigate('/Login');
            }
    
            // Reset form fields after successful submission
            setName('');
            setAddressLine1('');
            setAddressLine2('');
            setPinCode('');
            setAdharNumber('');
            setEmail('');
            setPhone('');
            setPassword('');
            setRepassword('');
            setPdfFile(null);
    
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
                                            <span><i class="bi bi-house-fill icon"></i></span>
                                            <input type="text" placeholder="Enter Address Line 1" name="addressLine1" value={addressLine1} onChange={handleAddressLine1} required />
                                            <div className="red-text" id="name_err">{addressLine1Error}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-house-fill icon"></i></span>
                                            <input type="text" placeholder="Enter Address Line 2" name="addressLine2" value={addressLine2} onChange={handleAddressLine2} required />
                                            <div className="red-text" id="name_err">{addressLine2Error}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-mailbox2 icon"></i></span>
                                            <input type="text" placeholder="Postal Code " name="pincode" value={pinCode} onChange={handlePinCode} required />
                                            <div className="red-text" id="name_err">{pinCodeError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-person-vcard-fill icon"></i></span>
                                            <input type="text" placeholder="Enter Adhar number" name="CIN" value={adharNumber} onChange={handleAdharNumber} required />
                                            <div className="red-text" id="name_err">{adharNumberError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-telephone-fill icon"></i></span>
                                            <input type="text" placeholder="Enter contact number" name="phone" value={phone} onChange={handlePhone} required />
                                            <div className="red-text" id="name_err">{phoneError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-envelope-fill icon"></i></span>
                                            <input type="email" placeholder="Enter company e-mail" name="email" value={email} onChange={handleEmail} required />
                                            <div className="red-text" id="name_err">{emailError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-lock-fill icon"></i></span>
                                            <input type="password" placeholder="Enter  password" name="password" value={password} onChange={handlePass} required />
                                            <div className="red-text" id="name_err">{passwordError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <span><i className="bi bi-lock-fill icon"></i></span>
                                            <input type="password" placeholder="Enter  re-password" name="repassword" value={repassword} onChange={handleRepass} required />
                                            <div className="red-text" id="name_err">{repasswordError}</div> <br />
                                        </div>

                                        <div className="col-6 col-md-6">
                                            <h6>Upload Adhar Card</h6>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handlePdfFileChange}
                                                className="form-control"
                                            />
                                            <div className="red-text" id="pdfFile_err">
                                                {pdfFileError}
                                            </div>
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

export default ServiceProviderRegister;