import React from "react";
import { useState, useEffect } from "react";
import { Dropdown, Modal, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddVideoForm from '../Forms/AddVideoForm'
function AdminAddServices() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [videos, setVideos] = useState([]);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
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
        // Fetch videos from your backend API
        axios.get("http://13.233.162.230:9000/videos")
            .then((response) => {
                setVideos(response.data);
            })
            .catch((error) => {
                console.error("Error fetching videos:", error);
            });
    }, []);

    const handleDeleteVideo = async (videoId) => {
        // Make an API request to delete the video by videoId
        const confirmed = window.confirm("Are you sure you want to Delete the video?");
        if (confirmed) {
            // Make an API request to deactivate the user
            axios.delete(`http://13.233.162.230:9000/deletevideos/${videoId}`)
                .then(() => {
                    // Remove the deleted video from the videos state
                    setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
                    console.log("User Deactivated successfully");
                    // Show a success alert
                    alert("Video Deleted successfully");
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error deleting video:", error);
                });
        }
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
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/Admin">Home</a>
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

            <div className="container mt-24">
                <div>
                    <button
                        className="btn btn-success btn-lg"
                        onClick={() => setShowForm(true)}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add Stress Relief Videos
                    </button>
                </div>
            </div>

            <Container className="mt-5">
                <Row>
                    {videos.map((video) => (
                        <div sty className="col-md-4 mb-4" key={video.stress_relief_video_id}>
                            <div className="card d-flex flex-column h-100">
                                <video
                                    src={`http://13.233.162.230:9000/${video.video}`}
                                    alt={video.stress_relief_video_id}
                                    autoPlay
                                    loop
                                    muted
                                    className="card-img-top"
                                ></video>
                                <div className="card-body flex-grow-1">
                                    <p className="card-text">Description: {video.video_description}</p>
                                    <p className="card-text">Date:{video.date}</p>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="btn btn-danger w-50"
                                        onClick={() => handleDeleteVideo(video.stress_relief_video_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </Row>
            </Container>

            <Modal show={showForm} onHide={() => {
                setShowForm(false);
                window.location.reload();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Stress Relief Video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddVideoForm />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AdminAddServices;