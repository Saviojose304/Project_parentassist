import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
function Parent() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [doctorVisits, setDoctorVisits] = useState([]);
    const [medicineRoutine, setMedicineRoutine] = useState([]);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const user_id = parsedToken.userId;


    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const user_role = token.role
        if (token !== null && user_role == 'Parent'){
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); 
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch latest doctor visit details for the parent
        axios.get(`http://13.233.162.230:9000/getLatestDoctorVisitDetails?user_id=${user_id}`)
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
        axios.get(`http://13.233.162.230:9000/getMedicineRoutineDetails?user_id=${user_id}`)
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
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleprofile = () => {
        navigate('/ParentProfileUpdate');
    };

    const handledoctor = () => {
        navigate('/ChildDoctorView');
    };

    const handledoctorVisits = () => {
        navigate('/Parent');
    };

    const handleService = () => {
        navigate('/ParentServiceView');
    };

    const handleBookedTherapy = () => {
        navigate('/ParentBookedTherapyView')
    };

    const handleRequsetService = () => {
        navigate('/parentRequestService')
    }

   
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
                            <li className="nav-item px-3 py-2">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" id="username" data-bs-toggle="collapse" className="text-decoration-none text-end">{parsedToken ? parsedToken.userName : 'Name'}</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <div className='row d-flex'>
                <div className='col-2' id="sidebar-nav">
                    <div className="container pt-5">
                        <div className="row flex-nowrap" >
                            <div className=" px-0">
                                <div id="sidebar" className='show border-end pt-2'>
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" id="profile" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleprofile} >
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-gear-fill"><span>View Profile</span></i>
                                            </a>
                                        </button>
                                        <button type="button" id="service" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleService}>
                                            <a href="" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Therapy Services</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleBookedTherapy}>
                                            <a href="" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Booked Therapy</span></i>
                                            </a>
                                        </button>

                                        <button id="homeservice" type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleRequsetService}>
                                            <a href="" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-house-gear-fill"><span>Home Services</span></i>
                                            </a>
                                        </button>

                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handledoctor}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span>Doctors</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handledoctorVisits}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span>Doctors Visits</span></i>
                                            </a>
                                        </button>
                                        <button type="button" id="logout" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={logOut}>
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
                <div style={{ paddingTop: '3rem' }} className='col-10'>
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
                                                                <a href={`http://13.233.162.230:9000/${visit.past_surgeries}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                                    <i className="bi bi-file-arrow-down-fill"></i>
                                                                </a>
                                                            )}
                                                        </p>
                                                        <p>
                                                            Test Results:
                                                            {visit.test_result === "No" ? (
                                                                <span>No</span>
                                                            ) : (
                                                                <a href={`http://13.233.162.230:9000/${visit.test_result}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
                                                                    <i className="bi bi-file-arrow-down-fill"></i>
                                                                </a>
                                                            )}
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
                </div>
            </div>
        </>
    );
}

export default Parent;