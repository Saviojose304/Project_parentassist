import React, { useState, useEffect } from "react";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ParentServiceView() {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const parent_user_id = parsedToken.userId;

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

    const filteredVideos = videos.filter((video) =>
        video.video_description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
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
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/Parent">Home</a>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item px-3 ">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Videos"
                                    id="searchinput"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                            </li>

                            <li className="nav-item px-3">
                                <button type="button" id="book_therapy" className="btn btn-success"><a className="text-decoration-none text-white" href="/ParentTherapyBooking">Book Therapy Section</a></button>

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
            <div className="container mt-5 pt-5">
                <div className="row">
                    {filteredVideos.map((video) => (
                        <div className="col-md-4 mb-4" key={video.stress_relief_video_id}>
                            <div className="card" style={{ cursor: "pointer" }}>
                                <div
                                    onClick={() => handleVideoClick(video)}
                                    onMouseOver={(event) => event.target.play()}
                                    onMouseOut={(event) => event.target.pause()}
                                    className="card-body"
                                >
                                    <video
                                        src={`http://13.233.162.230:9000/${video.video}`}
                                        alt={video.stress_relief_video_id}
                                        loop
                                        muted
                                        className="card-img-top"
                                    ></video>
                                    <p className="card-text pt-2">{video.video_description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for displaying the selected video in full size */}
                {selectedVideo && (
                    <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={handleCloseVideo}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <video
                                        src={`http://13.233.162.230:9000/${selectedVideo.video}`}
                                        alt={selectedVideo.stress_relief_video_id}
                                        autoPlay
                                        controls
                                        className="w-100"
                                    ></video>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ParentServiceView;