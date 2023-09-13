import React from "react";
import { useState, useEffect } from "react";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
function DoctorsPatientDetails() {
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const [isshowRout, setShowRout] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const doctor_user_id = parsedToken.userId;
    const navigate = useNavigate();


    const toggleParent = () => {
        setShowGeneral(true);
        setShowPass(false);
        setShowRout(false);
    };

    const toggleTodayAppointment = () => {
        setShowGeneral(false);
        setShowPass(true);
        setShowRout(false);

    };

    const toggleMEdicineRout = () => {
        setShowGeneral(false);
        setShowPass(false);
        setShowRout(true);
    };

    const logOut = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
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
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ color: 'white', textDecoration: 'none' }}>
                                        {parsedToken ? parsedToken.email : 'Name'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item style={{ cursor: 'pointer' }} onClick={logOut}>LogOut</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <div style={{ paddingTop: "5rem" }}>
                <div className="container  light-style flex-grow-1 container-p-y">
                    <div className="card w-100 overflow-hidden">
                        <div className="row d-flex  pt-0">
                            <div className="col-4 col-md-4">
                                <div className="list-group fw-bold  list-group-flush account-settings-links">
                                    <div className={isshowgeneral ? 'list-group-item  w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleParent} style={{ cursor: 'pointer' }} >General</div>
                                </div>
                            </div>
                            <div className="col-4 col-md-4">
                                <div className="list-group fw-bold  list-group-flush account-settings-links">
                                    <div className={isshowpass ? 'list-group-item w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleTodayAppointment} style={{ cursor: 'pointer' }}>Medicine</div>
                                </div>
                            </div>
                            <div className="col-4 col-md-4">
                                <div className="list-group fw-bold  list-group-flush account-settings-links">
                                    <div className={isshowRout ? 'list-group-item  w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleMEdicineRout} style={{ cursor: 'pointer' }} >Medicine Routine</div>
                                </div>
                            </div>

                        </div>
                        <div className="row no-gutters row-bordered row-border-light">
                            <div className="col-md-9">
                                <div className="tab-content">
                                    <div className={isshowgeneral ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                        <h3 className="mb-3 text-center">General information</h3>

                                    </div>
                                    <div className={isshowpass ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                        <h3 className="mb-3 text-center">Medicines</h3>

                                    </div>
                                    <div className={isshowRout ? 'tab-pane fade active show' : 'tab-pane fade'}>
                                        <h3 className="mb-3 text-center">Medicine Routine</h3>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}

export default DoctorsPatientDetails;