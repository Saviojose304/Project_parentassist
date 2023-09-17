import React from "react";
import { useState, useEffect } from "react";
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
    const [pastSurgeries, setPastSurgeries] = useState("No");
    const [pastSurgeriesFile, setPastSurgeriesFile] = useState(null);
    const [testResultFile, setTestResultFile] = useState(null);
    const [description, setDescription] = useState("");
    const [nextCheckupDate, setNextCheckupDate] = useState(date);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageCD, setErrorMessageCD] = useState('');
    const [errorMessageAller, setErrorMessageAller] = useState('');

    const validateLetter = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Medicine cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter a Medicine with at least 3 valid characters';
        }
    };

    const validateCurrentDiseases = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Medicine cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter Current Disease with at least 3 valid characters';
        }
    };

    const validateAllergies = (name) => {
        var letters = /^[A-Za-z ]*$/;
        var regex = /^\s/;
        if (name.length >= 3 && name.match(regex)) {
            return "Medicine cannot start with a space";
        }
        if (name.match(letters) && name.length >= 3) {
            return '';
        } else {
            return 'Please enter Allergy with at least 3 valid characters';
        }
    };

    const handlemedicalcondition = (e) => {
        const newmedicalcondition = e.target.value;
        setMedicalCondition(newmedicalcondition);
        const errormsg = validateLetter(newmedicalcondition);
        setErrorMessage(errormsg);
    };

    const handlecurrentDiseases = (e) => {
        const newcurrentdiseases = e.target.value;
        setCurrentDiseases(newcurrentdiseases);
        const errormsgcurrent = validateCurrentDiseases(newcurrentdiseases);
        setErrorMessageCD(errormsgcurrent);
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
        const errormsgallergies = validateAllergies(newAllergies);
        setErrorMessageAller(errormsgallergies);
    };

    const handlePastSurgeriesFileChange = (e) => {
        const file = e.target.files[0];
        setPastSurgeriesFile(file);
    };

    const handleTestResultFileChange = (e) => {
        const file = e.target.files[0];
        setTestResultFile(file);
    };

    const calculateBMI = () => {
        if (weight && height) {
            const weightInKg = parseFloat(weight);
            const heightInMeters = parseFloat(height) / 100;
            const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
            return bmi;
        }
        return "";
    };
    const handleSubmit = (e) => {
        e.preventDefault();

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
                        <input type="text" id="medicalCondition" placeholder="Medical Condition" value={medicalCondition}
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
                        <input type="number" id="bp" placeholder="BP (mmHg)" value={bp}
                            onChange={(e) => setBp(e.target.value)} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="number" id="sugar" placeholder="Sugar (mg/dL)" value={sugar}
                            onChange={(e) => setSugar(e.target.value)} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="number" id="weight" placeholder="Weight (kg)" value={weight}
                            onChange={(e) => setWeight(e.target.value)} required
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <input type="number" id="height" placeholder="Height (cm)" value={height}
                            onChange={(e) => setHeight(e.target.value)} required
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
                                    type="radio"
                                    id="pastSurgeriesYes"
                                    className="form-check-input"
                                    value="Yes"
                                    checked={pastSurgeries === "Yes"}
                                    onChange={handlePastSurgeriesChange} 
                                />
                                <label className="form-check-label" htmlFor="pastSurgeriesYes">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    id="pastSurgeriesNo"
                                    className="form-check-input"
                                    value="No"
                                    checked={pastSurgeries === "No"}
                                    onChange={handlePastSurgeriesChange}
                                />
                                <label className="form-check-label" htmlFor="pastSurgeriesNo">No</label>
                            </div>
                        </div>
                        {pastSurgeries === "Yes" && (
                            <div className="mt-2">
                                <label htmlFor="pastSurgeriesFile" className="form-label">Upload Past Surgeries File (PDF)</label>
                                <input
                                    type="file"
                                    id="pastSurgeriesFile"
                                    className="form-control"
                                    accept=".pdf"
                                    onChange={handlePastSurgeriesFileChange}
                                />
                            </div>
                        )}
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="testResultFile" className="form-label">Test Result (PDF)</label>
                        <input
                            type="file"
                            id="testResultFile"
                            className="form-control"
                            accept=".pdf"
                            onChange={handleTestResultFileChange}
                            required
                        />
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
            </div>
        </>
    );
}

export default ParentGeneralInfo;