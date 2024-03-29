import React, { useState, useEffect } from "react";
import { Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ParentBookedTherapyView() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const parent_user_id = parsedToken.userId;

    const [showBookedTherapies, setShowBookedTherapies] = useState(true); // Initially show booked therapies
    const [bookedTherapies, setBookedTherapies] = useState([]);
    const [upcomingTherapies, setUpcomingTherapies] = useState([]);

    const logOut = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // Fetch booked therapies when the component mounts
        axios.get(`http://13.233.162.230:9000/booked-therapies/${parent_user_id}`)
            .then((response) => {
                const today = new Date().toISOString().split('T')[0];
                const filteredBookedTherapies = response.data.filter(therapy => therapy.status === 'Success' && therapy.formatted_date <= today);
                const filteredUpcomingTherapies = response.data.filter(therapy => therapy.status === 'Success' && therapy.formatted_date > today);

                setBookedTherapies(filteredBookedTherapies);
                setUpcomingTherapies(filteredUpcomingTherapies);
            })
            .catch((error) => {
                console.error("Error fetching booked therapies:", error);
            });
    }, [parent_user_id]);


    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/Parent">Home</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/ParentTherapyBooking">Book Therapy Section</a></button>

                            </li>
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

            <div style={{paddingTop:'5rem'}} className="container mt-5">
                <div className="text-center mb-4">
                    <Button
                        variant="info"
                        className="me-2"
                        onClick={() => setShowBookedTherapies(true)}
                    >
                        Booked Therapy
                    </Button>
                    <Button
                        variant="info"
                        onClick={() => setShowBookedTherapies(false)}
                    >
                        Upcoming Therapy
                    </Button>
                </div>

                {showBookedTherapies ? (
                    <div className="row">
                        {bookedTherapies.map((therapy) => (
                            <div key={therapy.id} className="col-md-4 mb-4">
                                {/* Render booked therapy card */}
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Doctor: {therapy.name}</h5>
                                        <p className="card-text">Booking Date: {therapy.formatted_date}</p>
                                        <p className={`card-text text-${therapy.status === 'Success' ? 'success' : 'warning'}`}>Payment Status: {therapy.status}</p>
                                        <p className="card-text">Order ID: {therapy.order_id}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row">
                        {upcomingTherapies.map((therapy) => (
                            <div key={therapy.id} className="col-md-4 mb-4">
                                {/* Render upcoming therapy card */}
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Doctor: {therapy.name}</h5>
                                        <p className="card-text">Booking Date: {therapy.formatted_date}</p>
                                        <p className={`card-text text-${therapy.status === 'Success' ? 'success' : 'warning'}`}>Payment Status: {therapy.status}</p>
                                        <p className="card-text">Order ID: {therapy.order_id}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </>
    );
}

export default ParentBookedTherapyView;