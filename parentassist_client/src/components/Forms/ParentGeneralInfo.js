import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import AlertBox from "../Alert";
import '../Register.css'
function ParentGeneralInfo(props) {
    const { parentId } = props;
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [medicalCondition, setMedicalCondition] = useState("");
    const [currentDiseases, setCurrentDiseases] = useState("");
    const [bp, setBp] = useState("");
    const [sugar, setSugar] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [allergies, setAllergies] = useState("");
    const [parentbmi, setParentbmi] = useState('');
    const [pastSurgeries, setPastSurgeries] = useState("No");
    const [pastSurgeriesFile, setPastSurgeriesFile] = useState(null);
    const [testResultFile, setTestResultFile] = useState(null);
    const [description, setDescription] = useState("");
    const [nextCheckupDate, setNextCheckupDate] = useState(date);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageCD, setErrorMessageCD] = useState('');
    const [uploadFileError, setUploadFileError] = useState('');
    const [uploadFileTestError, setUploadFileTestError] = useState('');
    const [errorMessageAller, setErrorMessageAller] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token); // Parse the token string to an object
    const doctor_user_id = parsedToken.userId;

    const validateLetter = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            setErrorMessage("Medicine cannot start with a space");
            return false;
        }
        if (name.match(letters) && name.length >= 3) {
            return true;
        } else {
            setErrorMessage('Please enter a Medicine with at least 3 valid characters');
            return false;
        }
    };

    const validateCurrentDiseases = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            setErrorMessageCD("Medicine cannot start with a space");
            return false;
        }
        if (name.match(letters) && name.length >= 3) {
            return true;
        } else {
            setErrorMessageCD('Please enter Current Disease with at least 3 valid characters');
            return false;
        }
    };

    const validateAllergies = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            setErrorMessageAller("Medicine cannot start with a space");
            return false;
        }
        if (name.match(letters) && name.length >= 3) {
            return true;
        } else {
            setErrorMessageAller('Please enter Allergy with at least 3 valid characters');
            return false;
        }
    };

    const validateFileSurg = (file) => {
        const allowedTypes = ['application/pdf'];
        const maxSizeMB = 100; // The maximum file size as needed (in megabytes)

        if (!allowedTypes.includes(file.type)) {
            setUploadFileError('Invalid file type. Please select a valid video file.');
            return false;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setUploadFileError('File size exceeds the maximum allowed size.');
            return false
        }

        return true;
    };

    const validateFileTest = (file) => {
        const allowedTypes = ['application/pdf'];
        const maxSizeMB = 2; // The maximum file size as needed (in megabytes)

        if (!allowedTypes.includes(file.type)) {
            setUploadFileTestError('Invalid file type. Please select a valid video file.');
            return false;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setUploadFileTestError('File size exceeds the maximum allowed size.');
            return false
        }

        return true;
    };

    const handlemedicalcondition = (e) => {
        const newmedicalcondition = e.target.value;
        setMedicalCondition(newmedicalcondition);
        if (validateLetter(newmedicalcondition)) {
            setErrorMessage('')
        }
    };

    const handlecurrentDiseases = (e) => {
        const newcurrentdiseases = e.target.value;
        setCurrentDiseases(newcurrentdiseases);
        if (validateCurrentDiseases(newcurrentdiseases)) {
            setErrorMessageCD('');
        }
    };

    const handlePastSurgeriesChange = (e) => {
        setPastSurgeries(e.target.value);
        if (e.target.value === "No") {
            setPastSurgeriesFile(null);
        }
    };

    const handleallergies = (e) => {
        const newAllergies = e.target.value;
        setAllergies(newAllergies);
        if (validateAllergies(newAllergies)) {
            setErrorMessageAller('');
        }

    };

    const handlePastSurgeriesFileChange = (e) => {
        const file = e.target.files[0];
        if (validateFileSurg(file)) {
            setPastSurgeriesFile(file);
        }
    };

    const handleTestResultFileChange = (e) => {
        const file = e.target.files[0];
        if (validateFileTest(file)) {
            setTestResultFile(file);
        }
    };

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };

    const handleweight = (e) => {
        setWeight(e.target.value);
    };

    const handleheight = (e) => {
        setHeight(e.target.value);
    };

    useEffect(() => {
        const newBMI = calculateBMI();
        setParentbmi(newBMI);
    }, [weight, height]);


    const calculateBMI = () => {
        if (weight && height) {
            const weightInKg = parseFloat(weight);
            const heightInMeters = parseFloat(height) / 100;
            const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
            return bmi;
        }
        return "";
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitClicked(true);

        try {
            const formData = new FormData();
            formData.append("date", date);
            formData.append("medicalCondition", medicalCondition);
            formData.append("currentDiseases", currentDiseases);
            formData.append("bp", bp);
            formData.append("sugar", sugar);
            formData.append("weight", weight);
            formData.append("height", height);
            formData.append("parentbmi", parentbmi);
            formData.append("allergies", allergies);
            formData.append("pastSurgeries", pastSurgeries);
            formData.append("file1", pastSurgeriesFile);
            formData.append("file2", testResultFile);
            formData.append("nextCheckupDate", nextCheckupDate);
            formData.append("description", description);
            formData.append("parentId", parentId);
            formData.append("doctor_user_id", doctor_user_id);

            // Send a POST request to your Express API
            const response = await axios.post("http://13.233.162.230:9000/parentGeneralInfo", formData);

            if (response.status === 200) {
                //console.log(response.data.message);
                setAlertInfo({ variant: 'success', message: 'Subimitted successfully', show: true });

            } else {
                setAlertInfo({ variant: 'danger', message: 'Submission  Failed', show: true });
            }
            setMedicalCondition('');
            setCurrentDiseases('');
            setBp('');
            setSugar('');
            setWeight("");
            setHeight("");
            setAllergies('');
            setPastSurgeriesFile('')
            setTestResultFile('');
            setDescription('');
        } catch (error) {
            console.error(error);
            setAlertInfo({ variant: 'danger', message: 'submission  Failed', show: true });
        }

    };
    return (
        <>
            <div className="container mx-auto mt-5">
                <form onSubmit={handleSubmit} className="row">
                    <div className="mb-3 col-md-6">
                        <span><i class="bi bi-calendar-check-fill icon"></i></span>
                        <input type="text" id="date" value={date} readOnly />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="text" id="medicalCondition" placeholder="Medical Symptoms" value={medicalCondition}
                            onChange={handlemedicalcondition} required
                        />
                        <div style={{ color: 'red' }} id="name_err">{errorMessage}</div> <br />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="text" id="currentDiseases" placeholder="Current Diseases" value={currentDiseases}
                            onChange={handlecurrentDiseases} required
                        />
                        <div style={{ color: 'red' }} id="name_err">{errorMessageCD}</div> <br />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="number" id="bp" min={1} placeholder="BP (mmHg)" value={bp}
                            onChange={(e) => setBp(e.target.value)} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="number" id="sugar" min={1} placeholder="Sugar (mg/dL)" value={sugar}
                            onChange={(e) => setSugar(e.target.value)} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="number" id="weight" min={1} placeholder="Weight (kg)" value={weight}
                            onChange={handleweight} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="number" id="height" min={1} placeholder="Height (cm)" value={height}
                            onChange={handleheight} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="text" id="bmi" placeholder="BMI" value={calculateBMI()} readOnly />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="text" id="allergies" placeholder="Allergies" value={allergies}
                            onChange={handleallergies} required
                        />
                        <div style={{ color: 'red' }} id="name_err">{errorMessageAller}</div> <br />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label">Past Surgeries</label>
                        <div>
                            <div className="form-check form-check-inline">
                                <input
                                    style={{ width: '30%' }}
                                    type="radio"
                                    id="pastSurgeriesYes"
                                    value="Yes"
                                    checked={pastSurgeries === "Yes"}
                                    onChange={handlePastSurgeriesChange}
                                />
                                <label className="form-check-label" htmlFor="pastSurgeriesYes">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    style={{ width: '30%' }}
                                    type="radio"
                                    id="pastSurgeriesNo"
                                    value="No"
                                    checked={pastSurgeries === "No"}
                                    onChange={handlePastSurgeriesChange}
                                />
                                <label className="form-check-label" htmlFor="pastSurgeriesNo">No</label>
                            </div>
                        </div>
                        {pastSurgeries === "Yes" && (
                            <div className="mt-2">
                                <label htmlFor="pastSurgeriesFile" className="form-label">Upload Past Surgeries File (supported format: .pdf)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="file1"
                                    name="file1"
                                    accept=".pdf"
                                    onChange={handlePastSurgeriesFileChange}
                                />
                            </div>
                        )}
                        <div style={{ color: 'red' }} id="name_err">{uploadFileError}</div> <br />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label htmlFor="testResultFile" className="form-label">Test Result (supported format: .pdf)</label>
                        <input
                            type="file"
                            id="file2" name="file2"
                            className="form-control"
                            accept=".pdf"
                            onChange={handleTestResultFileChange}

                        />
                        <div style={{ color: 'red' }} id="name_err">{uploadFileTestError}</div> <br />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="chekupdate" className="form-label">Next Checkup Date</label> <br />
                        <span><i class="bi bi-calendar-check-fill icon"></i></span>
                        <input type="date" id="nextCheckupDate" placeholder="Next Checkup Date" name="chekupdate" min={date} value={nextCheckupDate}
                            onChange={(e) => setNextCheckupDate(e.target.value)} required
                        />
                    </div>
                    <div className="text-center mb-5">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
                <div className="p-2">
                    {submitClicked && (
                        <AlertBox
                            variant={alertInfo.variant}
                            message={alertInfo.message}
                            onClose={handleAlertClose}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default ParentGeneralInfo;