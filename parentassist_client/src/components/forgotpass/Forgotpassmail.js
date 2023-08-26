import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

function Forgotpassmail() {

    const [email,setEmail] = useState("");
    const [emailError, setEmailError] = useState('');

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

    const setmail = (e) =>{
        const newEmail = e.target.value;
        setEmail(newEmail);
        const emailErrorMessage = validateEmail(newEmail);
        setEmailError(emailErrorMessage);
    }

    const sendmail = (e) =>{
        e.preventDefault();
        
        


    }

    return (
        <>
            <div className='h-100 justify-content-center d-flex align-content-center p-5'>
                <Card className="text-center" style={{ width: '500px' }}>
                    <Card.Header className="h5 text-white" style={{ backgroundColor: "#116396" }}>Password Reset</Card.Header>
                    <Card.Body className="px-5">
                        <p className="card-text py-2">
                            Enter your email address and we'll send you an email with instructions to reset your password.
                        </p>
                        <div className="form-outline">
                            <input type="email" id="typeEmail" value={email} className="form-control my-3" placeholder='Enter your mail' onChange={setmail} required  />
                            <div className="red-text" id="name_err">{emailError}</div> <br />
                        </div>
                        <Button href="#" onClick={sendmail} className="btn w-50" style={{ backgroundColor: "#116396" }}>
                            Reset password
                        </Button>
                        <div className="d-flex justify-content-between mt-4"> 
                            <Button href='/Login' className='btn w-25 btn-light text-light' style={{ backgroundColor: "#116396" }}>Log In</Button>
                            <Button href='/Register' className='btn w-25 btn-light text-light' style={{ backgroundColor: "#116396" }}>Register</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default Forgotpassmail;