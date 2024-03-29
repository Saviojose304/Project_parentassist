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
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);
    const [symptoms, setSymptoms] = useState(['', '', '', '', '']);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const list_a = ['itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain',
        'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition',
        'spotting_ urination', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings',
        'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough',
        'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache',
        'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain',
        'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes',
        'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise',
        'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure',
        'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate',
        'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain',
        'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes',
        'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts',
        'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness',
        'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance',
        'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine',
        'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression',
        'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
        'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria',
        'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances',
        'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding',
        'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum',
        'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring',
        'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister',
        'red_sore_around_nose', 'yellow_crust_ooze']

    useEffect(() => {
        const fetchData = async () => {
            axios.get(`http://13.233.162.230:9000/getParentViewData?user_id=${user_id}`)
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


    const handleInputChange = (index, value) => {
        const updatedSymptoms = [...symptoms];
        updatedSymptoms[index] = value;
        setSymptoms(updatedSymptoms);
      
        if (value) {
          setSelectedSymptoms([...selectedSymptoms, value]);
        }
      };


    const handlePredict = async () => {

        console.log(symptoms);

        if (hasErrors) {
            console.log('Validation errors. Prediction cancelled.');
            return;
        }


        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symptoms: symptoms }),
            });

            const result = await response.json();
            setPrediction(result)
            console.log(result);
            // Handle the result as needed
        } catch (error) {
            console.error('Error:', error);
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
                                                            onClick={() => handleCheck(pList.Gender, pList.age)}
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
                <div className="fixed inset-0 z-50 mt-16 h-[75vh] opacity-1 flex items-center justify-center">
                    <div className="bg-white overflow-y-scroll relative bottom-3 h-[75vh] w-1/2 mt-10 shadow-md shadow-gray-400 p-8 rounded-lg text-center">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            <IoMdClose className="bg-red-500 text-white" size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Predict Disease</h2>
                        <div>
                            {symptoms.map((symptom, index) => (
                                <div key={index} className="flex mb-4">
                                    <label htmlFor={`symptom${index + 1}`} className="w-1/4 text-right pr-2">
                                        {`Select Symptom ${index + 1}`}
                                    </label>
                                    <select
                                        id={`symptom${index + 1}`}
                                        value={symptom}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className="w-3/4 border-2 border-black focus:border-blue-500"
                                    >
                                        <option value="">Select a symptom</option>
                                        {list_a.map((symptomOption) => (
                                            <option key={symptomOption} value={symptomOption}>
                                                {symptomOption.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            <button
                                onClick={handlePredict}
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                                Submit
                            </button>
                        </div>
                        <p className='font-semibold text-xl mt-2'>
                            Prediction: {prediction ? prediction.disease : 'No prediction available'}
                        </p>
                    </div>
                </div>

            }
        </>
    );
}

export default Diabetes_prd;