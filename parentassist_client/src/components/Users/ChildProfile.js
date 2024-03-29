import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Dropdown, Modal, Button, Card } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { IoChatbubblesSharp } from "react-icons/io5";
import ChatBot from "../ChatBot/Chatbot";
import { Page, Document, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import axios from "axios";
function ChildProfile() {

    const [gender, setGender] = useState('male');
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    // const user_id = parsedToken.userId;

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showFatherDetails, setShowFatherDetails] = useState(true);
    const [showMotherDetails, setShowMotherDetails] = useState(false);
    const [doctorVisits, setDoctorVisits] = useState([]);
    const [medicineRoutine, setMedicineRoutine] = useState([]);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token === null) {
            setIsAuthenticated(false);
            navigate('/'); // Navigate to login if no token is present
        } else {
            setIsAuthenticated(true);
            const parsedToken = JSON.parse(token);
            const user_id = parsedToken.userId;

            // Fetch latest doctor visit details for the parent
            axios.get(`http://13.233.162.230:9000/getLatestDoctorVisitDetailsChild?user_id=${user_id}&gender=${gender}`)
                .then((response) => {
                    if (response.status === 200) {
                        setDoctorVisits(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching doctor visit details:", error);
                });

            // Fetch medicine routine details for the parent's doctor visits
            axios.get(`http://13.233.162.230:9000/getMedicineRoutineDetailsChild?user_id=${user_id}&gender=${gender}`)
                .then((response) => {
                    if (response.status === 200) {
                        setMedicineRoutine(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching medicine routine details:", error);
                });
        }
    }, [navigate, gender]);

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
        navigate('/ChildProfile')
    };

    const handledoctor = () => {
        navigate('/ChildDoctorView')
    };

    const handleReports = () => {
        navigate('/ChildReports')
    }

    const handleService = () => {
        navigate('/requestService')
    }

    const toggleFatherDetails = async () => {
        setShowFatherDetails(true);
        setShowMotherDetails(false);

        const updatedGender = 'male';
        setGender(updatedGender);

        setDoctorVisits([]);
        setMedicineRoutine([]);

        const user_id = parsedToken.userId;

        axios.get(`http://13.233.162.230:9000/getLatestDoctorVisitDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setDoctorVisits(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });

        axios.get(`http://13.233.162.230:9000/getMedicineRoutineDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
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

        const user_id = parsedToken.userId;

        // Fetch latest doctor visit details for the parent with the updated gender
        axios.get(`http://13.233.162.230:9000/getLatestDoctorVisitDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setDoctorVisits(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });

        // Fetch medicine routine details for the parent's doctor visits with the updated gender
        axios.get(`http://13.233.162.230:9000/getMedicineRoutineDetailsChild?user_id=${user_id}&gender=${updatedGender}`)
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

    const handleParentDetails = () => {
        navigate('/Diabetes_prd')
    };

    const styles = StyleSheet.create({
        page: {
            flexDirection: "row",
            backgroundColor: "#fff",
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
        title: {
            fontSize: 24,
            marginBottom: 10,
        },
        card: {
            marginBottom: 20,
            border: "1px solid #ccc",
            borderRadius: 5,
        },
        cardBody: {
            padding: 10,
        },
        cardHeader: {
            backgroundColor: "#f2f2f2",
            padding: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        cardHeaderText: {
            fontSize: 14,
        },
        cardBodyContent: {
            fontSize: 12,
        },
        cardBodyRow: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
        },
        cardBodyColumn: {
            width: "48%",
        },
        medicineRoutineTable: {
            flexDirection: "row",
            marginTop: 10,
        },
        tableRow: {
            flexDirection: "row",
        },
        medicineRoutineTableHeaderCell: {
            backgroundColor: "#f2f2f2",
            padding: 5,
            flex: 1,
            border: "1px solid #ccc",
            fontWeight: "bold",
            fontSize: 12,
        },
        medicineRoutineTableCell: {
            padding: 5,
            flex: 1,
            border: "1px solid #ccc",
            fontSize: 12,
        },
    });


    const generatePdf = () => {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.title}>Latest Doctor Visit</Text>
                        {doctorVisits.map((visit, index) => (
                            <View style={styles.card} key={visit.doctor_visit_id}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardHeaderText}>Visited Date: {visit.formatted_date}</Text>
                                    <Text style={styles.cardHeaderText}> Doctor Name: {visit.doctor_name}</Text>
                                </View>
                                <View style={styles.cardBody}>
                                    <View style={styles.cardBodyRow}>
                                        <View style={styles.cardBodyColumn}>
                                            <Text style={styles.cardBodyContent}>Medical Condition: {visit.medical_condition}</Text>
                                            <Text style={styles.cardBodyContent}>Current Disease: {visit.current_diseases}</Text>
                                            <Text style={styles.cardBodyContent}>BP: {visit.BP}</Text>
                                            <Text style={styles.cardBodyContent}>Sugar: {visit.sugar}</Text>
                                            <Text style={styles.cardBodyContent}>Weight: {visit.weight}</Text>
                                            <Text style={styles.cardBodyContent}>Height: {visit.height}</Text>
                                            <Text style={styles.cardBodyContent}>BMI: {visit.BMI}</Text>
                                            <Text style={styles.cardBodyContent}>Allergies: {visit.allergies}</Text>
                                        </View>
                                        <View style={styles.cardBodyColumn}>
                                            <Text style={styles.cardBodyContent}>Description: {visit.description}</Text>
                                            <Text style={styles.cardBodyContent}>Next Visit: {visit.formatted_next_visit_date}</Text>
                                        </View>

                                        <Text style={styles.title}>Medicine Routine</Text>
                                        <View style={styles.medicineRoutineTable}>
                                            <View style={styles.medicineRoutineTableHeaderCell}><Text>Medicine Name</Text></View>
                                            <View style={styles.medicineRoutineTableHeaderCell}><Text>Morning</Text></View>
                                            <View style={styles.medicineRoutineTableHeaderCell}><Text>Noon</Text></View>
                                            <View style={styles.medicineRoutineTableHeaderCell}><Text>Night</Text></View>
                                            <View style={styles.medicineRoutineTableHeaderCell}><Text>Route Description</Text></View>
                                            <View style={styles.medicineRoutineTableHeaderCell}><Text>Prescribed Date</Text></View>
                                            <View style={styles.medicineRoutineTableHeaderCell}><Text>Days</Text></View>
                                        </View>
                                        {medicineRoutine
                                            .filter((medRoutine) => medRoutine.doctor_visit_id === visit.doctor_visit_id)
                                            .map((filteredMedRoutine) => (
                                                <View style={styles.tableRow} key={filteredMedRoutine.doctor_visit_id}>
                                                    <View style={styles.medicineRoutineTableCell}><Text>{filteredMedRoutine.medicine_name}</Text></View>
                                                    <View style={styles.medicineRoutineTableCell}><Text>{filteredMedRoutine.morning}</Text></View>
                                                    <View style={styles.medicineRoutineTableCell}><Text>{filteredMedRoutine.noon}</Text></View>
                                                    <View style={styles.medicineRoutineTableCell}><Text>{filteredMedRoutine.night}</Text></View>
                                                    <View style={styles.medicineRoutineTableCell}><Text>{filteredMedRoutine.rout_descp}</Text></View>
                                                    <View style={styles.medicineRoutineTableCell}><Text>{filteredMedRoutine.formatted_doctor_visit_date}</Text></View>
                                                    <View style={styles.medicineRoutineTableCell}><Text>{filteredMedRoutine.days}</Text></View>
                                                </View>
                                            ))}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );
    };

    const openPdfModal = () => {
        setShowPdfModal(true);
    };
    const closePdfModal = () => {
        setShowPdfModal(false);
    };

    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    const closeChatbot = () => {
        setIsChatbotOpen(false);
      };


    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success" onClick={toggleFatherDetails}>Father Details</button>
                            </li>
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success" onClick={toggleMotherDetails}>Mother Details</button>
                            </li>
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/ParentRegister"><i className="bi bi-plus-lg"></i>Add Parent</a></button>
                            </li>
                            <li className="nav-item px-3">
                                <button type="button" className="btn btn-success"><a className="text-decoration-none text-white" href="/DoctorRegister"><i className="bi bi-plus-lg"></i>Add Doctor</a></button>
                            </li>
                            <li className="nav-item px-3 py-2">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" >{parsedToken ? parsedToken.userName : 'Name'}</a>
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
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleParentDetails}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Disease Prediction</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handledoctor}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-activity"><span>Doctors</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleReports}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-file-earmark-pdf"><span>Reports</span></i>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleService}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i class="bi bi-house-gear-fill"><span>Service</span></i>
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
                        {showFatherDetails && (
                            <main className="col overflow-auto h-100">
                                <div className="bg-light border rounded-3 p-5">
                                    <h2>Father Details</h2>
                                    <div className="d-flex">
                                        <h2>Doctor Visits</h2>
                                        <div className="nav-item px-3">
                                            <button
                                                className="btn btn-primary btn-md"
                                                onClick={openPdfModal}><i className="bi bi-file-arrow-down-fill"></i>Download Details
                                            </button>
                                        </div>
                                    </div>
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
                                                                    <a href={`http://13.233.162.230:9000/${visit.test_result}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
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
                                    <h2>Mother Details</h2>
                                    <div className="d-flex">
                                        <h2>Doctor Visits</h2>
                                        <div className="nav-item px-3">
                                            <button
                                                className="btn btn-primary btn-md"
                                                onClick={openPdfModal}><i className="bi bi-file-arrow-down-fill"></i>Download Details
                                            </button>
                                        </div>
                                    </div>
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
                                                                    <a href={`http://13.233.162.230:9000/${visit.test_result}`} target="_blank" rel="noopener noreferrer" className="btn btn-success mx-2 w-20 mt-3">
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

                        <button
                            className="btn btn-primary floating-button font-extrabold"
                            onClick={toggleChatbot}
                            style={{ position: 'fixed', bottom: '20px', right: '20px' }}
                        >
                            <IoChatbubblesSharp />
                        </button>

                        {/* Render the Chatbot component when isChatbotOpen is true */}
                        {isChatbotOpen && <ChatBot onClose={closeChatbot} />}
                    </div>
                </div>
            </div >

            <Modal show={showPdfModal} onHide={closePdfModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Download PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PDFViewer width="100%" height="500px">
                        {generatePdf()}
                    </PDFViewer>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ChildProfile;