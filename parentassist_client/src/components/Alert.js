import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
function AlertBox({ variant,show, message, onClose }) {
    // const [show, setShow] = useState(true);
    return (
        <>
          <Alert variant={variant} show={show} onClose={onClose} dismissible>
                {message}
            </Alert>
        </>
    );
}

export default AlertBox;