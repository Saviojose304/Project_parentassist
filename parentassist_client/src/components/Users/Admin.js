import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css'


function Admin() {

    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const token = JSON.parse(localStorage.getItem('token'))
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token !== null) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/Login'); // Navigate to login if no token is present
        }
    }, [navigate]);

    const handleusers = async () => {
        setShow(!show);
        axios.get('http://localhost:9000/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching data: ', error));
    }

    const Logout = async () => {
        try {
            localStorage.removeItem('token');
            console.log(token);
            navigate('/'); // Navigate to the home   page after logout
        } catch (error) {
            console.log(error);
        }
    }

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };


    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="#">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
                            {/* <li className="nav-item px-3">
                                <a style={{ color: "white" }} href="#" className="text-decoration-none">Name</a>
                            </li> */}
                            <li className="nav-item px-3">
                                <a style={{ color: "white" }} href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="text-decoration-none" onClick={toggleSidebar}>{token ? token.email : ''}</a>
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
                                <div id="sidebar" className={isSidebarOpen ? 'collapse collapse-horizontal ' : 'show border-end pt-2'}>
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleusers}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"></i><span>Users</span>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-bootstrap"></i> <span>Providers</span>
                                            </a>
                                        </button>
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={Logout}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-box-arrow-right"></i> <span >Logout</span>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className={isSidebarOpen ? 'col-12' : 'col-10 pt-2'}>
                    <main className="col overflow-auto h-100">
                        <div className="bg-light border rounded-3 p-5">
                            <h1>Admin Dashboard</h1>

                            <div style={{display: show ? 'block':'none'}}>
                                <h3>User Table</h3>
                                <table className='table-success table-striped table-hover'>
                                    <thead>
                                        <tr className='table-success'>
                                            <th scope="col">User ID</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">User Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr className='table-success' key={user.user_id}>
                                                <td>{user.user_id}</td>
                                                <td>{user.email}</td>
                                                <td>{user.user_status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

export default Admin;
