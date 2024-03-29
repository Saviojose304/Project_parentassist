import React from "react";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from 'react';
function ChildParentView() {
    const [parentData, setParentData] = useState([]);
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const navigate = useNavigate();
    const user_child_id = parsedToken.userId;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://13.233.162.230:9000/getParentViewData', { params: { user_child_id } });
                setParentData(response.data.results);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [user_child_id]);

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
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/ChildProfile">Home</a>
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
            <div className="row d-flex">
                {Array.isArray(parentData) && parentData.length > 0 ? (
                    parentData.map((data, index) => (
                        <div className="col-6 col-lg-6 col-md-6" key={index}>
                            <div className="card" style={{ width: '25rem', height: '12rem', margin: '10rem 5rem 0 3rem'  }}>
                                <div className="card-body">
                                    <h5 className="card-title">{data.name}</h5>
                                    <p className="card-text">Age: {data.age}</p>
                                    <p className="card-text">Phone: {data.phone}</p>
                                    <a href="#" className="btn btn-primary">More Details</a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p>No parent data available</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default ChildParentView;