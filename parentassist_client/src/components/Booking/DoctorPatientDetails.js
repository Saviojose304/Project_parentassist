import React from "react";
import { useState, useEffect } from "react";
import { Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import ParentGeneralInfo from "../Forms/ParentGeneralInfo";
import MedicineRoutineDetails from "../Forms/MedicineRoutineDetails";
import './DoctorPatientDetails.css'
function DoctorsPatientDetails() {
    const { parentId } = useParams();
    const [isshowgeneral, setShowGeneral] = useState(true);
    const [isshowpass, setShowPass] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const doctor_user_id = parsedToken.userId;
    const navigate = useNavigate();


    const getMarginTopClass = () => {
        // You can adjust these values based on your design breakpoints
        if (window.innerWidth <= 576) {
            return "mt-sm-5rem";
        }
        if (window.innerWidth <= 992) {
            return "mt-md-5rem";
        }
        if(window.innerWidth >= 993){
            return "mt-lg-5rem";
        }
    };

    const toggleParent = () => {
        setShowGeneral(true);
        setShowPass(false);
    };

    const toggleTodayAppointment = () => {
        setShowGeneral(false);
        setShowPass(true);
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
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/Doctor">Home</a>
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

            <div className={`container ${getMarginTopClass()}`}>
                <div className="container  light-style flex-grow-1 container-p-y">
                    <div className="card w-100 overflow-hidden">
                        <div className="row d-flex  pt-0">
                            <div className="col-6 col-md-6">
                                <div className="list-group fw-bold  list-group-flush account-settings-links">
                                    <div className={isshowgeneral ? 'list-group-item  w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleParent} style={{ cursor: 'pointer' }} >General</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6">
                                <div className="list-group fw-bold  list-group-flush account-settings-links">
                                    <div className={isshowpass ? 'list-group-item w-100 list-group-item-action active' : 'list-group-item w-100 list-group-item-action'} onClick={toggleTodayAppointment} style={{ cursor: 'pointer' }}>Medicines Details</div>
                                </div>
                            </div>
                        </div>
                        <div className="row no-gutters row-bordered row-border-light">
                            <div className="col-12 col-md-10 col-lg-10 col-xl-10">
                                <div className="tab-content">
                                    <div className={isshowgeneral ? 'tab-pane fade active show flex-grow-1' : 'tab-pane fade'}>
                                        <h3 className="mb-3 text-center">General information</h3>

                                        <ParentGeneralInfo parentId={parentId} />

                                    </div>
                                    <div className={isshowpass ? 'tab-pane fade active show flex-grow-1' : 'tab-pane fade'}>
                                        <h3 className="mb-3 text-center">Medicines</h3>

                                        <MedicineRoutineDetails parentId={parentId} />

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