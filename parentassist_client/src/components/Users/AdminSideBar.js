import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function AdminSideBar() {

    const token = JSON.parse(localStorage.getItem('token'))
    const navigate = useNavigate();
    
    const handleservice = () => {
        navigate('/AdminAddServices')
    };

    const Logout = async () => {
        try {
            localStorage.removeItem('token');
            console.log(token);
            navigate('/'); // Navigate to the home   page after logout
        } catch (error) {
            console.log(error);
        }
    }
    return ( 
        <>
         <div className="container mt-9 pt-5">
                        <div className="row flex-nowrap" >
                            <div className=" px-0">
                                <div id="sidebar" className="show border-end pt-2">
                                    <div className="d-grid  mx-auto ">
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleservice}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline-block text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-people-fill"><span>Services</span></i>
                                            </a>
                                        </button>
                                        {/* <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={handleReports}>
                                            <a href="#" className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-file-earmark-pdf"><span>Reports</span></i>
                                            </a>
                                        </button> */}
                                        <button type="button" className="btn border-light btn-outline-primary" style={{ width: "100%", borderRadius: "0px" }} onClick={Logout}>
                                            <a href='' className="text-decoration-none list-group-item border-end-0 d-inline text-truncate" data-bs-parent="#sidebar">
                                                <i className="bi bi-box-arrow-right"><span >Logout</span></i>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        </>
     );
}

export default AdminSideBar;