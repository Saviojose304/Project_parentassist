import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

function Emailverification() {
    const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://13.233.162.230:9000/emailverify', { token })
      .then(response => {
        if (response.data.success) {
        //   setVerificationStatus(true);
            navigate('/Login');
        } else {
          setVerificationStatus('Email verification failed.');
        }
      })
      .catch(error => {
        console.error('Verification error:', error);
        setVerificationStatus('An error occurred during verification.');
      });
  }, [token]);

    return ( 
        <>
            {verificationStatus} <be />
            <Button className='btn btn-primary' href='/Register'>Register</Button>
        </>
     );
}

export default Emailverification;