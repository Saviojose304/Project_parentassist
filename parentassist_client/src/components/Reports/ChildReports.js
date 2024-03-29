import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Modal, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
function ChildReports() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [gender, setGender] = useState('male');
    const [showFatherDetails, setShowFatherDetails] = useState(true);
    const [showMotherDetails, setShowMotherDetails] = useState(false);
    const [doctorVisits, setDoctorVisits] = useState([]);
    const [medicineRoutine, setMedicineRoutine] = useState([]);
    const [addedDoctor, setAddedDoctor] = useState([]);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPdfModal, setShowPdfModal] = useState(false);
    const user_id = parsedToken.userId;
    const navigate = useNavigate();

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
        axios.get(`http://13.233.162.230:9000/getLatestDoctorVisitDetailsChildReport?user_id=${user_id}&gender=${gender}`)
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
        axios.get(`http://13.233.162.230:9000/getMedicineRoutineDetailsChildReport?user_id=${user_id}&gender=${gender}`)
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

    const toggleFatherDetails = async () => {
        setShowFatherDetails(true);
        setShowMotherDetails(false);

        const updatedGender = 'male';
        setGender(updatedGender);

        setDoctorVisits([]);
        setMedicineRoutine([]);

        axios.get(`http://13.233.162.230:9000/getLatestDoctorVisitDetailsChildReport?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setDoctorVisits(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });

        axios.get(`http://13.233.162.230:9000/getMedicineRoutineDetailsChildReport?user_id=${user_id}&gender=${updatedGender}`)
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
        axios.get(`http://13.233.162.230:9000/getLatestDoctorVisitDetailsChildReport?user_id=${user_id}&gender=${updatedGender}`)
            .then((response) => {
                if (response.status === 200) {
                    setDoctorVisits(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });

        // Fetch medicine routine details for the parent's doctor visits with the updated gender
        axios.get(`http://13.233.162.230:9000/getMedicineRoutineDetailsChildReport?user_id=${user_id}&gender=${updatedGender}`)
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
            marginBottom: 5,
            marginTop: 10
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
            flexDirection:"row",
            justifyContent: "space-between",
            marginBottom: 5,
        },
        cardBodyColumn: {
            width: "50%",
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
                        {doctorVisits
                            .filter((visit) => {
                                const searchValue = searchQuery.toLowerCase();
                                const visitInfo = `${visit.doctor_name} ${visit.medical_condition} ${visit.formatted_date}`.toLowerCase();
                                return visitInfo.includes(searchValue);
                            })
                            .map((visit, index) => (
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
                                            </View>
                                            <View style={styles.cardBodyColumn}>
                                            <Text style={styles.cardBodyContent}>Height: {visit.height}</Text>
                                                <Text style={styles.cardBodyContent}>BMI: {visit.BMI}</Text>
                                                <Text style={styles.cardBodyContent}>Allergies: {visit.allergies}</Text>
                                                <Text style={styles.cardBodyContent}>Description: {visit.description}</Text>
                                                <Text style={styles.cardBodyContent}>Next Visit: {visit.formatted_next_visit_date}</Text>
                                            </View>
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



    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/ChildProfile">ParentAssist</a>
                        <div className="nav-item w-50 px-3 pt-1">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Doctor Name or Visit Date"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3 py-2">
                                <Button variant="primary" onClick={toggleFatherDetails}>Father Details</Button>
                            </li>
                            <li className="nav-item px-3 py-2">
                                <Button variant="success" onClick={toggleMotherDetails}>Mother Details</Button>
                            </li>
                            {/* <li className="nav-item px-3 py-2">
                                <Button variant="info" onClick={toggleDoctorDetails}>Added Doctor</Button>
                            </li> */}
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
            <section className="mt-5">
                {showFatherDetails && (
                    <main className="col overflow-auto h-100">
                        <div className="bg-light border rounded-3 p-5">
                            <div className="d-flex">
                                <h2>Doctor Visits History</h2>
                                <div className="nav-item px-3">
                                    <button
                                        className="btn btn-primary btn-md"
                                        onClick={openPdfModal}><i className="bi bi-file-arrow-down-fill"></i>Download Details
                                    </button>
                                </div>
                            </div>
                            {doctorVisits
                                .filter((visit) => {
                                    const searchValue = searchQuery.toLowerCase();
                                    const visitInfo = `${visit.doctor_name} ${visit.medical_condition} ${visit.formatted_date}`.toLowerCase();
                                    return visitInfo.includes(searchValue);
                                })
                                .map((visit, index) => (
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
                            <div className="d-flex">
                                <h2>Doctor Visits</h2>
                                <div className="nav-item px-3">
                                    <button
                                        className="btn btn-primary btn-md"
                                        onClick={openPdfModal}><i className="bi bi-file-arrow-down-fill"></i>Download Details
                                    </button>
                                </div>
                            </div>
                            {doctorVisits
                                .filter((visit) => {
                                    const searchValue = searchQuery.toLowerCase();
                                    const visitInfo = `${visit.doctor_name} ${visit.medical_condition} ${visit.formatted_date}`.toLowerCase();
                                    return visitInfo.includes(searchValue);
                                })
                                .map((visit, index) => (
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
            </section>

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

export default ChildReports;
