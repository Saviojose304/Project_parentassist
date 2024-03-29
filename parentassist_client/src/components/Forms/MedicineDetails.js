import React, { useState, useEffect } from "react";
import axios from 'axios';
function MedicineDetails(props) {
    const { onMedicineData, parentId } = props;
    const [selectedMedicineId, setSelectedMedicineId] = useState('');
    const [medicineOptions, setMedicineOptions] = useState([]); // Store medicine names
    const [dropdownClicked, setDropdownClicked] = useState(false);
    const [medicineError, setMedicineError] = useState('');


    const fetchMedicineNames = async () => {
        try {
            const response = await axios.get('http://13.233.162.230:9000/medicineNames');
            if (response.status === 200) {
                const data = response.data; // Assuming the response is an array of objects with medicine_id and name
                setMedicineOptions(data);
            }
        } catch (error) {
            console.error("Error fetching medicine names:", error);
        }
    };  

    useEffect(() => {
        if (props.isSubmissionSuccessful) {
            setSelectedMedicineId("");
        }
    }, [props.isSubmissionSuccessful]);

    const handleDropdownClick = () => {
        if (!dropdownClicked) {
            fetchMedicineNames();
            setDropdownClicked(true);
        }
    };

    const handleMedicineSelection = async (selectedMedicineId) => {
        // Check for duplicate medicine selection
        const isDuplicate = await checkDuplicateMedicineSelection(selectedMedicineId,parentId);
        
        if (isDuplicate) {
            setMedicineError('Medicne Already Selected');
            console.error("Duplicate medicine selection for the same parent and doctor visit.");
        } else {
            // The selected medicine is not a duplicate, set the selected medicine_id
            setSelectedMedicineId(selectedMedicineId);
            // Clear any previous error
            setMedicineError('');
            // Notify the parent component about the selected medicine
            onMedicineData(selectedMedicineId);

        }
    };

    const checkDuplicateMedicineSelection = async (medicineId) => {
        try {
            const response = await axios.get('http://13.233.162.230:9000/checkDuplicateMedicineSelection', {
                params: {
                    parent_id: parentId,
                    medicine_id: medicineId,
                },
            });
    
            if (response.status === 200) {
                const isDuplicate = response.data.isDuplicate;
                return isDuplicate;
            }
        } catch (error) {
            console.error("Error checking for duplicate medicine selection:", error);
            return false; // Assume an error means no duplicate (you can handle this differently if needed)
        }
    };


    return (
        <>
            <select
                className="form-select mx-auto w-50"
                value={selectedMedicineId}
                onChange={(e) => {
                    const selectedMedicineId = e.target.value;
                    handleMedicineSelection(selectedMedicineId);
                }}
                onClick={handleDropdownClick} // Load medicine names onClick
            >
                <option value="" >Select Medicine</option>
                {medicineOptions.map((option) => (
                    <option key={option.medicine_id} value={option.medicine_id} >
                        {option.name}
                    </option>
                ))}
            </select>
            <div className="d-flex justify-content-center align-content-center text-red-500">{medicineError}</div> <br />
        </>
    );
}

export default MedicineDetails;