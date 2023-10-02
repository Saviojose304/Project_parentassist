import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button, Card } from 'react-bootstrap';
import { useState, useEffect } from "react";
import axios from "axios";
function ChildProfile() {

    const [gender, setGender] = useState('male');
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const user_id = parsedToken.userId;

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showFatherDetails, setShowFatherDetails] = useState(true);
    const [showMotherDetails, setShowMotherDetails] = useState(false);
    const [doctorVisits, setDoctorVisits] = useState([]);
    const [medicineRoutine, setMedicineRoutine] = useState([]);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token !== null) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch latest doctor visit details for the parent
        axios.get(`http://localhost:9000/getLatestDoctorVisitDetailsChild?user_id=${user_id}&gender=${gender}`)
            .then((response) => {
                if (response.status === 200) {
                    setDoctorVisits(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });
    }, []);

    useEffect(() => {
        // Fetch medicine routine details for the parent's doctor visits
        axios.get(`http://localhost:9000/getMedicineRoutineDetailsChild?user_id=${user_id}&gender=${gender}`)
            .then((response) => {
                if (response.status === 200) {
                    setMedicineRoutine(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medicine routine details:", error);
            });
    }, [user_id]);

    const logOut = async () => {
        try {
            googleLogout();
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleprofile = () => {
        navigate('/ChildProfileUpdate');
    };

    const handleparents = () => {
        navigate('/ChildParentView')
    };

    const handledoctor = () => {
        navigate('/ChildDoctorView')
    };

    const toggleFatherDetails = async () => {
        setShowFatherDetails(true);
        setShowMotherDetails(false);

        const updatedGender = 'male';
        setGender(updatedGender);

        setDoctorVisits([]);
        setMedicineRoutine([]);

        axios.get(`http://localhost:9000/getLatestDoctorVisitDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setDoctorVisits(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });

        axios.get(`http://localhost:9000/getMedicineRoutineDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setMedicineRoutine(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medicine routine details:", error);
            });

    };

    const toggleMotherDetails = async () => {
        setShowFatherDetails(false);
        setShowMotherDetails(true);

        // Update gender here
        const updatedGender = 'female';
        setGender(updatedGender);

        setDoctorVisits([]);
        setMedicineRoutine([]);

        // Fetch latest doctor visit details for the parent with the updated gender
        axios.get(`http://localhost:9000/getLatestDoctorVisitDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setDoctorVisits(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });

        // Fetch medicine routine details for the parent's doctor visits with the updated gender
        axios.get(`http://localhost:9000/getMedicineRoutineDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setMedicineRoutine(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medicine routine details:", error);
            });
    };


    const handleMoreDetailsClick = (doctor_visit_id) => {
        // Toggle the expanded state for the selected doctor visit card
        const updatedDoctorVisits = doctorVisits.map((visit) => ({
            ...visit,
            expanded: visit.doctor_visit_id === doctor_visit_id ? !visit.expanded : visit.expanded,
        }));
        setDoctorVisits(updatedDoctorVisits);
    };


    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="#">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/ParentRegister"><i className="bi bi-plus-lg"></i>Add Parent</a></button>
                            </li>
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/DoctorRegister"><i className="bi bi-plus-lg"></i>Add Doctor</a></button>
                            </li>
                            <li className="nav-item px-3 py-2">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" >{parsedToken ? parsedToken.email : 'Name'}</a>
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
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleprofile} >
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span>View Profile</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleparents}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Parents</span></i>
                                            </a>
                                        </button>

                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handledoctor}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span>Doctors</span></i>
                                            </a>
                                        </button>
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
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <Card style={{ width: '30rem', height: '6rem', borderRadius: '30px', backgroundColor: "#116396", cursor: 'pointer' }} onClick={toggleFatherDetails}>
                                    <Card.Body>
                                        <Card.Text>
                                            <div className="d-flex text-white  h3 strong py-3 justify-content-center align-content-center">
                                                Father Details
                                            </div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-md-6 mb-4">
                                <Card style={{ width: '30rem', height: '6rem', borderRadius: '30px', backgroundColor: "#116396", cursor: 'pointer' }} onClick={toggleMotherDetails}>
                                    <Card.Body>
                                        <Card.Text>
                                            <div className="d-flex text-white  h3 strong py-3 justify-content-center align-content-center">
                                                Mother Details
                                            </div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>

                        {showFatherDetails && (
                            <main className="col overflow-auto h-100">
                                <div className="bg-light border rounded-3 p-5">
                                    <h2>Doctor Visits</h2>
                                    {doctorVisits.map((visit, index) => (
                                        <div className="card mb-3" key={visit.doctor_visit_id}>
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between">
                                                    <span>Visited Date: {visit.formatted_date}</span>
                                                    <span>Doctor Name: {visit.doctor_name}</span>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <button
                                                    className="btn btn-primary mb-3"
                                                    onClick={() => handleMoreDetailsClick(visit.doctor_visit_id)}
                                                >
                                                    {visit.expanded ? "Less Details" : "More Details"}
                                                </button>
                                                {visit.expanded && (
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div>
                                                                <p>Medical Condition: {visit.medical_condition}</p>
                                                                <p>Current Disease: {visit.current_diseases}</p>
                                                                <p>BP: {visit.BP}</p>
                                                                <p>Sugar: {visit.sugar}</p>
                                                                <p>Weight: {visit.weight}</p>
                                                                <p>Height: {visit.height}</p>
                                                                <p>BMI: {visit.BMI}</p>
                                                                <p>Allergies: {visit.allergies}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div>
                                                                <p>
                                                                    Past Surgeries:
                                                                    {visit.past_surgeries === "No" ? (
                                                                        <span>No</span>
                                                                    ) : (
                                                                        <a href={`http://localhost:9000/${visit.past_surgeries}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                                            <i className="bi bi-file-arrow-down-fill"></i>
                                                                        </a>
                                                                    )}
                                                                </p>
                                                                <p>
                                                                    Test Results:
                                                                    <a href={`http://localhost:9000/${visit.test_result}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                                        <i className="bi bi-file-arrow-down-fill"></i>
                                                                    </a>
                                                                </p>
                                                                <p>Description: {visit.description}</p>
                                                                <p>Next Visit: {visit.formatted_next_visit_date}</p>
                                                            </div>
                                                        </div>
                                                        <h2 className="m-2 text-center">Medicine Routine</h2>
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Medicine Name</th>
                                                                        <th>Morning</th>
                                                                        <th>Noon</th>
                                                                        <th>Night</th>
                                                                        <th>Route Description</th>
                                                                        <th>Prescribed Date</th>
                                                                        <th>Days</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {medicineRoutine
                                                                        .filter((medRoutine) => medRoutine.doctor_visit_id === visit.doctor_visit_id)
                                                                        .map((filteredMedRoutine) => (
                                                                            <tr key={filteredMedRoutine.doctor_visit_id}>
                                                                                <td>{filteredMedRoutine.medicine_name}</td>
                                                                                <td>{filteredMedRoutine.morning}</td>
                                                                                <td>{filteredMedRoutine.noon}</td>
                                                                                <td>{filteredMedRoutine.night}</td>
                                                                                <td>{filteredMedRoutine.rout_descp}</td>
                                                                                <td>{filteredMedRoutine.formatted_doctor_visit_date}</td>
                                                                                <td>{filteredMedRoutine.days}</td>
                                                                            </tr>
                                                                        ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </main>
                        )}
                        {showMotherDetails && (
                            <main className="col overflow-auto h-100">
                            <div className="bg-light border rounded-3 p-5">
                                <h2>Doctor Visits</h2>
                                {doctorVisits.map((visit, index) => (
                                    <div className="card mb-3" key={visit.doctor_visit_id}>
                                        <div className="card-header">
                                            <div className="d-flex justify-content-between">
                                                <span>Visited Date: {visit.formatted_date}</span>
                                                <span>Doctor Name: {visit.doctor_name}</span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <button
                                                className="btn btn-primary mb-3"
                                                onClick={() => handleMoreDetailsClick(visit.doctor_visit_id)}
                                            >
                                                {visit.expanded ? "Less Details" : "More Details"}
                                            </button>
                                            {visit.expanded && (
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div>
                                                            <p>Medical Condition: {visit.medical_condition}</p>
                                                            <p>Current Disease: {visit.current_diseases}</p>
                                                            <p>BP: {visit.BP}</p>
                                                            <p>Sugar: {visit.sugar}</p>
                                                            <p>Weight: {visit.weight}</p>
                                                            <p>Height: {visit.height}</p>
                                                            <p>BMI: {visit.BMI}</p>
                                                            <p>Allergies: {visit.allergies}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div>
                                                            <p>
                                                                Past Surgeries:
                                                                {visit.past_surgeries === "No" ? (
                                                                    <span>No</span>
                                                                ) : (
                                                                    <a href={`http://localhost:9000/${visit.past_surgeries}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                                        <i className="bi bi-file-arrow-down-fill"></i>
                                                                    </a>
                                                                )}
                                                            </p>
                                                            <p>
                                                                Test Results:
                                                                <a href={`http://localhost:9000/${visit.test_result}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                                    <i className="bi bi-file-arrow-down-fill"></i>
                                                                </a>
                                                            </p>
                                                            <p>Description: {visit.description}</p>
                                                            <p>Next Visit: {visit.formatted_next_visit_date}</p>
                                                        </div>
                                                    </div>
                                                    <h2 className="m-2 text-center">Medicine Routine</h2>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th>Medicine Name</th>
                                                                    <th>Morning</th>
                                                                    <th>Noon</th>
                                                                    <th>Night</th>
                                                                    <th>Route Description</th>
                                                                    <th>Prescribed Date</th>
                                                                    <th>Days</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {medicineRoutine
                                                                    .filter((medRoutine) => medRoutine.doctor_visit_id === visit.doctor_visit_id)
                                                                    .map((filteredMedRoutine) => (
                                                                        <tr key={filteredMedRoutine.doctor_visit_id}>
                                                                            <td>{filteredMedRoutine.medicine_name}</td>
                                                                            <td>{filteredMedRoutine.morning}</td>
                                                                            <td>{filteredMedRoutine.noon}</td>
                                                                            <td>{filteredMedRoutine.night}</td>
                                                                            <td>{filteredMedRoutine.rout_descp}</td>
                                                                            <td>{filteredMedRoutine.formatted_doctor_visit_date}</td>
                                                                            <td>{filteredMedRoutine.days}</td>
                                                                        </tr>
                                                                    ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
}

export default ChildProfile;