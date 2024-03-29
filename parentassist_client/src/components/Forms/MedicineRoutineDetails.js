import React, { useState } from "react";
import axios from 'axios';
import AlertBox from "../Alert";
import MedicineDetails from "../Forms/MedicineDetails";
function MedicineRoutineDetails(props) {
    const { parentId } = props;
    const [morning, setMorning] = useState(false);
    const [noon, setNoon] = useState(false);
    const [night, setNight] = useState(false);
    const [checkboxError, setCheckboxError] = useState('');
    const [description, setDescription] = useState("");
    const [numberOfDays, setNumberOfDays] = useState("");
    const [submitClicked, setSubmitClicked] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });
    const [selectedMedicineId, setSelectedMedicineId] = useState("");
    const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);



    const handleMedicineData = (medicineId) => {
        setSelectedMedicineId(medicineId);
    };

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!morning && !noon && !night) {
            setCheckboxError('Please check at least one checkbox');
            //setAlertInfo({ variant: 'danger', message: 'Please check at least one checkbox', show: true });
            return;
        }

        const requestData = {
            morning,
            noon,
            night,
            description,
            numberOfDays,
            parentId,
            selectedMedicineId,
        };

        try {
            setSubmitClicked(true);
            setCheckboxError('');
            // Send a POST request to save the data to your database
            const response = await axios.post('http://13.233.162.230:9000/saveMedicineRoutine', requestData);
            if (response.status === 200) {
                setAlertInfo({ variant: 'success', message: 'Subimitted successfully', show: true });
                setIsSubmissionSuccessful(true);
            }
            else{
                setAlertInfo({ variant: 'danger', message: 'Submission  Failed', show: true });
            }
            setMorning(false);
            setNoon(false);
            setNight(false);
            setDescription('');
            setNumberOfDays('');
        } catch (error) {
            console.error("Error saving medicine routine:", error);
            // Handle errors, e.g., show an error message to the user
            setAlertInfo({ variant: 'danger', message: 'Submission  Failed', show: true });
        }

    };

    return (
        <>
            <MedicineDetails onMedicineData={handleMedicineData} parentId={parentId} isSubmissionSuccessful={isSubmissionSuccessful} />
            <form onSubmit={handleSubmit}>
                <div style={{ marginLeft: '15px' }}>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td>Morning</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={morning}
                                        onChange={() => setMorning(!morning)}
                                        
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Noon</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={noon}
                                        onChange={() => setNoon(!noon)}
                                        
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Night</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={night}
                                        onChange={() => setNight(!night)}
                                        
                                    />
                                </td>
                            </tr>
                            <div className="d-flex justify-content-center align-content-center text-red-500">{checkboxError}</div> <br />
                            <tr>
                                <td>Description</td>
                                <td>
                                    <select
                                        className="form-select"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="beforeFood">Before Food</option>
                                        <option value="afterFood">After Food</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Number of Days</td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={numberOfDays}
                                        min={1}
                                        onChange={(e) => setNumberOfDays(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
        </>
    );
}

export default MedicineRoutineDetails;