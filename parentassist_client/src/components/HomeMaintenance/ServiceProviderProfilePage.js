import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { BsClockFill } from "react-icons/bs";
import geernTick from '../../assets/images/greenTickIcon.png'
import axios from "axios";
import AlertBox from "../Alert";
import { toast } from "react-toastify";

function ServiceProfile() {

    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);
    const user_id = parsedToken.userId;

    // console.log(parsedToken);

    const navigate = useNavigate();
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });

    const [error, setError] = useState('');

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const user_role = token.role;
        if (token !== null && user_role == 'SRVCPRVDR') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);

    const logOut = async () => {
        try {
            googleLogout();
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://13.233.162.230:9000/getSellerData', { params: { user_id }});
                const userData = response.data;
                console.log(userData);
                // Update the state with the user data
                setName(userData.name);
                setAddress(userData.address);
                setPhone(userData.phn_num);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [user_id]);

    const handleService = () => {
        navigate("/AddService");
    }
    const handleServiceList = () => {
        navigate("/ServiceProviderHomePage")
    }

    const handleProfile = () => {
        navigate("/ServiceProviderHomePage")
    }

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
        navigate('/ServiceProviderHomePage');
    }

    const handleGeneralData = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);
        try {
            const response = await axios.put('http://13.233.162.230:9000/Sellerprofileupdate',{name, address, phone, user_id});
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
            const response = await axios.put('http://13.233.162.230:9000/ProfilePassUpdate',{password, user_id});
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

            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3 py-2">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" >{parsedToken ? parsedToken.userName : 'Name'}</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <div className='row  d-flex'>
                <div className='col-2' id="sidebar-nav">
                    <div className="container pt-5">
                        <div className="row flex-nowrap" >
                            <div className=" px-0">
                                <div id="sidebar" className='show border-end pt-2'>
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleProfile} >
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span>View Profile</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleService}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-house-gear-fill"><span>Add Service</span></i>
                                            </a>
                                        </button>

                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleServiceList}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-list-columns"><span className=" ml-2">Service List</span></i>
                                            </a>
                                        </button>
                                        {/* <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span></span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-file-earmark-pdf"><span>Reports</span></i>
                                            </a>
                                        </button> */}
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={logOut}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-box-arrow-right"><span>Logout</span></i>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div style={{ paddingTop: '5rem' }} className='col-10'>
                    <div className="container">
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
                       

                    </div>
                </div>

            </div>

        </>
    );
}

export default ServiceProfile;