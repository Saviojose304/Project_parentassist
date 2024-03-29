import { useState } from 'react';
import axios from 'axios';
import './Register.css'
import AlertBox from './Alert';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });


    const validateemail = (email) => {
        var filter = /^([a-zA-Z0-9_\- ])+\@(([a-zA-Z\-])+\.)+([a-zA-Z]{2,})+$/;
        var regex = / \s/;
        if (email.match(regex)) {
            return "Email is required";
        }
        if (email.match(filter)) {
            setEmailError(true);
        } else {
            return "Invalid email address!";
        }
    };

    const validatepassword = (password) => {
        var pwd_expression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
        var regex = /^\s/;
        if (password.match(regex)) {
            return "Password is required"
        }
        if (password.length <= 5) {
            return "Password minimum length is 6"
        }
        if (password.length >= 12) {
            return "Password maximum length is 12"
        }
        if (password.match(pwd_expression)) {
            setPasswordError(true);
        } else {
            return "Upper case, Lower case, Special character and Numeric letter are required in Password filed"
        }
    };


    const handleemail = (eventEmail) => {
        const newEmail = eventEmail.target.value;
        setEmail(newEmail);
        const emailErrorMessage = validateemail(newEmail);
        setEmailError(emailErrorMessage);

        // if (emailErrorMessage) {
        //     setTimeout(() => {
        //         setEmailError('');
        //     }, 5000);
        // }
    }

    const handlepass = (eventPass) => {
        const passNew = eventPass.target.value;
        setPassword(passNew);
        const passwordMessage = validatepassword(passNew);
        setPasswordError(passwordMessage);

        // if (passwordMessage) {
        //     setTimeout(() => {
        //         setPasswordError('');
        //     }, 5000);
        // }

    }


    const navigate = useNavigate();
    const [submitClicked, setSubmitClicked] = useState(false);

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false)
    };

    const login = useGoogleLogin({

        onSuccess: async (codeResponse) => {
            if (codeResponse.access_token) {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${codeResponse.access_token}`,
                        Accept: 'application/json'
                    }
                });

                if (res.data.email) {
                    setSubmitClicked(true);

                    try {
                        const response = await axios.post('http://13.233.162.230:9000/google-signin', {
                            gname: res.data.name,
                            gemail: res.data.email
                        });

                        const token = response.data;
                        // console.log(token);

                        const userrole = token.role;
                        localStorage.setItem('token', JSON.stringify(token));

                        switch (userrole) {
                            case 'Doctor':
                                navigate('/Doctor');
                                break;
                            case 'Child':
                                navigate('/ChildProfile');
                                break;
                            case 'Parent':
                                navigate('/Parent');
                                break;
                            case 'Admin':
                                navigate('/Admin');
                                break;
                            case 'MedSeller':
                                navigate('/MedicineSeller');
                                break;
                            case 'SRVCPRVDR':
                                navigate('/ServiceProviderHomePage');
                                break;
                            default:
                                alert("Invalid Credentials");
                        }

                        // console.log(userrole);
                    } catch (error) {
                        if (error.response && error.response.status === 400) {
                            setAlertInfo({ variant: 'danger', message: 'Email is already registered', show: true });
                        } else {
                            setAlertInfo({ variant: 'danger', message: 'An error occurred. Please try again later.', show: true });
                        }
                    }
                }
            }

        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const handlegoogleSiginIn = async () => {
        try {
            login();
        } catch (error) {
            console.log('Login Failed:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailError && !passwordError) {
            try {
                setSubmitClicked(true);
                const response = await axios.post('http://13.233.162.230:9000/login', { email, password });

                

                const token = response.data; //  token field
                const userRole = token.role
                // const userRole = response.data.role  ;


                localStorage.setItem('token', JSON.stringify(token));
                // console.log(token);

                if (userRole === 'Doctor') {
                    navigate('/Doctor');
                } else if (userRole === 'Child') {
                    navigate('/ChildProfile');
                } else if (userRole === 'Parent') {
                    navigate('/Parent');
                } else if (userRole === 'Admin') {
                    navigate('/Admin');
                } else if (userRole === 'MedSeller') {
                    navigate('/MedicineSeller');
                } else if (userRole === 'SRVCPRVDR') {
                    navigate('/ServiceProviderHomePage')
                }else {
                    alert("Invalid Credentials")
                }

                // console.log(response.data);
            } catch (error) {
                // console.error(error);
                if (error.response && error.response.status === 401) {
                    // Email already registered
                    setAlertInfo({ variant: 'danger', message: 'User not found/Invalid password/Account is Deactive', show: true });
                } else if (error.response && error.response.status === 500) {
                    // Other error occurred
                    setAlertInfo({ variant: 'danger', message: 'Login Failed', show: true });
                } else {
                    setAlertInfo({ variant: 'danger', message: 'An error occurred. Please try again later.', show: true });
                }
            }
        }



    };


    const sendmail = async (e) => {
        e.preventDefault();

        setSubmitClicked(true);

        try {
            const response = await axios.post('http://13.233.162.230:9000/forgot-password', { email });
            if (response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Verification email sent', show: true });
            }
        } catch (error) {
            // console.error(error);
            if (error.response && error.response.status === 400) {
                setAlertInfo({ variant: 'danger', message: 'User Not Found', show: true });
            } else {

                setAlertInfo({ variant: 'danger', message: 'An error occurred. Please try again later.', show: true });
            }
        }
    }

    return (
        <>
            <section className="vh-100 bg-img">
                <div className="container-fluid" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                                <div className="card-body p-5 text-center">
                                    <h3 className="mb-2">Log In</h3>
                                    <form onSubmit={handleSubmit} autoComplete="off">

                                        <span><i className="bi bi-envelope-fill icon"></i></span>
                                        <input type="email" placeholder="Enter your e-mail" name="email" value={email} onChange={handleemail} required />
                                        <div className="red-text" id="name_err">{emailError}</div> <br />

                                        <span><i className="bi bi-lock-fill icon"></i></span>
                                        <input type="password" placeholder="Enter your password" name="password" value={password} onChange={handlepass} required />
                                        <div className="red-text" id="name_err">{passwordError}</div> <br />

                                        <button
                                            style={{ width: '90%' }}
                                            className="btn btn-primary btn-lg btn-block"
                                            type="submit"
                                            id="submit"
                                            name="submit"
                                        >
                                            Log In
                                        </button>
                                    </form>
                                    <div className="p-2">
                                        {submitClicked && (
                                            <AlertBox
                                                variant={alertInfo.variant}
                                                message={alertInfo.message}
                                                show={alertInfo.show}
                                                onClose={handleAlertClose}
                                            />
                                        )}
                                    </div>
                                    <p className="small fw-bold mt-2 pt-1 mb-0">
                                        <a style={{ cursor: "pointer" }} onClick={sendmail} className="text-decoration-none ">Forgot Password?</a>
                                    </p>
                                    <p className="small fw-bold mt-2 pt-1 mb-0">
                                        Don't have an account?<a href="/Register" className="link-danger text-decoration-none">Register</a>
                                    </p>
                                    <hr className="my-4" />
                                    <button
                                        className="btn btn-lg btn-block btn-primary"
                                        style={{ backgroundColor: '#dd4b39', width: '100%', marginBottom: '20px' }}
                                        id='google-btn'
                                        type="submit"
                                        onClick={handlegoogleSiginIn}
                                    >
                                        <i className="bi bi-google me-2"></i> Sign in with Google
                                    </button>
                                    {/* <button
                                        className="btn btn-lg btn-block btn-primary"
                                        style={{ backgroundColor: '#075E54', width: '100%' }}
                                        type="submit"
                                    >
                                        <i class="bi bi-whatsapp"></i> Sign in with WhatsApp
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;