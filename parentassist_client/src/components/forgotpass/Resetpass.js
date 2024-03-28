import React,{ useState } from "react";
import { Card, Button } from 'react-bootstrap';
import AlertBox from "../Alert";
import axios from "axios";
import { useParams } from "react-router-dom";

function Resetpass() {
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const { token } = useParams();
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });

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

    const setpass = (eventPass) => {
        const passNew = eventPass.target.value;
        setPassword(passNew);
        const passwordMessage = validatePassword(passNew);
        setPasswordError(passwordMessage);

    }

    const setconpass = (eventrepass) => {
        const repassNew = eventrepass.target.value;
        setRepassword(repassNew);
        const rePasswordMessage = validateRepassword(password, repassNew);
        setRepasswordError(rePasswordMessage);

    }

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const sendmail = async (e) => {
        e.preventDefault();

        setSubmitClicked(true);

        try {
            const response = await axios.post(`/reset-password/${token}`, { password });
            if(response.status === 200)
            {
                setAlertInfo({variant : 'success' , message:'Password reset successful', show:true});
            }    
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setAlertInfo({ variant: 'danger', message: 'Invalid reset token', show: true });
            } else {

                setAlertInfo({ variant: 'danger', message: 'Password Reset failed', show: true });
            }
        }

        
    }


    return (
        <>
            <div className='h-100 justify-content-center d-flex align-content-center p-5'>
                <Card className="text-center" style={{ width: '500px' }}>
                    <Card.Header className="h5 text-white" style={{ backgroundColor: "#116396" }}>Password Reset</Card.Header>
                    <Card.Body className="px-5">
                        <div className="form-outline">
                            <input type="password" id="repass" value={password} className="form-control my-3" placeholder='Enter your password' onChange={setpass} required />
                            <div className="red-text" id="name_err">{passwordError}</div> <br />
                        </div>
                        <div className="form-outline">
                            <input type="password" id="crepass" value={repassword} className="form-control my-3" placeholder='Re-enter your password' onChange={setconpass} required />
                            <div className="red-text" id="name_err">{repasswordError}</div> <br />
                        </div>
                        <Button href="#" onClick={sendmail} className="btn w-50" style={{ backgroundColor: "#116396" }}>
                            Reset password
                        </Button>
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
                        <div className="justify-content-center">
                            <Button href='/Login' className='btn w-50 btn-light text-light' style={{ backgroundColor: "#116396" }}>Log In</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default Resetpass;