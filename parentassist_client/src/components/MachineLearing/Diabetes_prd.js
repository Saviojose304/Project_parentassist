import React, { useState } from 'react';
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";
import { IoChatbubblesSharp } from "react-icons/io5";
import ChatBot from "../ChatBot/Chatbot";
import axios from "axios";

function Diabetes_prd() {

    const [formData, setFormData] = useState({});
    const [prediction, setPrediction] = useState(null);

    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);
    const user_id = parsedToken.userId;
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [parentsList, setParentsList] = useState([]);
    const [parentDetails, setParentDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            axios.get(`http://localhost:9000/getParentViewData?user_id=${user_id}`)
                .then((response) => {
                    if (response.status === 200) {
                        setParentsList(response.data.results);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching doctor visit details:", error);
                });
        };

        fetchData();
    }, []);

    console.log(parentsList);



    const handleChange = (e) => {
        const name = e.target.name.toLowerCase(); // Convert the key to lowercase
        setFormData({
            ...formData,
            [name]: e.target.value,
        });
    };

    const handlePredict = async () => {
        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pregnancies: formData.pregnancies,
                    glucose: formData.glucose,
                    blood_pressure: formData.blood_pressure,
                    skin_thickness: formData.skin_thickness,
                    insulin: formData.insulin,
                    bmi: formData.bmi,
                    diabetes_pedigree_function: formData.diabetes_pedigree_function,
                    age: formData.age,
                }),
            });

            const data = await response.json();
            setPrediction(data.result);
        } catch (error) {
            console.error('Error during prediction:', error);
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

    const handleParentDetails = () => {
        navigate('/Diabetes_prd')
    };

    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    const closeChatbot = () => {
        setIsChatbotOpen(false);
    };

    const logOut = async () => {
        try {
            googleLogout();
            localStorage.removeItem('token');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleCheck = async (Gender, Age) => {
        axios.get(`http://localhost:9000/getLatestDoctorVisitDetailsChild?user_id=${user_id}&gender=${Gender}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setParentDetails(response.data);

                    const { BMI, BP } = response.data[0];

                    // Set BMI and Age in the formData
                    setFormData({
                        ...formData,
                        bmi: BMI,
                        age: Age,
                        blood_pressure: BP
                    });

                }
            })
            .catch((error) => {
                console.error("Error fetching doctor visit details:", error);
            });

        setIsModalOpen(true);
    }


    return (
        <>

            <header>
                <nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: "#116396" }}>
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand ms-5" href="/">ParentAssist</a>
                        <ul className="navbar-nav ms-auto me-5">
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
                                                <i className="bi bi-people-fill"><span>Diabetes Check</span></i>
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

                        <div className=" w-2/3   shadow-md shadow-gray-400 rounded-md mt-28 lg:mt-12 bg-white mx-auto mb-4">
                            <div className="w-full bg-blue-700 text-white font-semibold text-xl  text-center px-3 py-4">
                                Parents List
                            </div>

                            <div className="max-h-[400px] overflow-y-auto w-full">
                                {parentsList.length > 0 ? (
                                    <table className="bg-white rounded-xl shadow-md mt-2">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="py-3 px-4 text-center text-md font-semibold text-gray-500">
                                                    Name
                                                </th>
                                                <th className="py-3 px-4 text-center text-md font-semibold text-gray-500">
                                                    Age
                                                </th>
                                                <th className="py-3 px-4 text-center text-md font-semibold text-gray-500">
                                                    Phone
                                                </th>
                                                <th className="py-3 px-4 text-center text-md font-semibold text-gray-500">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {parentsList.map((pList, index) => (
                                                <tr key={index}>
                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        {pList.name}
                                                    </td>
                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        {pList.age}
                                                    </td>
                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        {pList.phone}
                                                    </td>
                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            className="btn btn-success"
                                                            onClick={() => handleCheck(pList.Gender,pList.age)}
                                                        >
                                                            Check
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No parents data available.</p>
                                )}
                            </div>

                        </div>




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

            {isModalOpen &&
                < div className="fixed  inset-0 z-50 mt-16 h-[75vh] opacity-1 flex items-center justify-center">
                    <div className="bg-white overflow-y-scroll relative bottom-3  h-[75vh] w-1/2 mt-10 shadow-md shadow-gray-400 p-8 rounded-lg text-center">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            <IoMdClose className="bg-red-500 text-white" size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4">Check Diabetes</h2>

                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Pregnancies:</label>
                            <input
                                type="text"
                                name="pregnancies"
                                onChange={handleChange}
                                required
                                placeholder='Enter  number of pregnancies'
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>
                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Glucose:</label>
                            <input
                                type="text"
                                name="glucose"
                                onChange={handleChange}
                                required
                                placeholder='Enter Glucose'
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>
                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Blood Pressure:</label>
                            <input
                                type="text"
                                name="blood_pressure"
                                readOnly
                                value={formData.blood_pressure}
                                required
                                placeholder='Enter Blood Pressure'
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>
                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Skin Thickness:</label>
                            <input
                                type="text"
                                name="skin_thickness"
                                onChange={handleChange}
                                required
                                placeholder='Enter Skin Thickness'
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>
                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Insulin:</label>
                            <input
                                type="text"
                                name="insulin"
                                onChange={handleChange}
                                required
                                placeholder='Enter Insulin'
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>
                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">BMI:</label>
                            <input
                                type="text"
                                name="bmi"
                                required
                                readOnly
                                value={formData.bmi}
                                placeholder='Enter BMI'
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>
                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Diabetes Pedigree Function:</label>
                            <input
                                type="text"
                                name="diabetes_pedigree_function"
                                onChange={handleChange}
                                required
                                placeholder='Enter Diabetes Pedigree Function'
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>
                        <div className="mb-4 mt-4">
                            <label className="block text-lg text-left font-semibold text-gray-700 mb-2">Age:</label>
                            <input
                                type="text"
                                name="age"
                                onChange={handleChange}
                                required
                                placeholder='Enter Age'
                                readOnly
                                value={formData.age}
                                className="border rounded-md p-2 w-full"
                            />
                            {/* <div className=" text-red-700" id="name_err">{locationError}</div> */}
                        </div>



                        <button
                            onClick={handlePredict}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                            Submit
                        </button>

                        {prediction !== null && (
                            <p className=' font-semibold text-xl mt-2'>Prediction: {prediction}</p>
                        )}

                    </div>
                </div >
            }
        </>
    );
}

export default Diabetes_prd;