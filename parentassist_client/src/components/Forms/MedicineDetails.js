import React, { useState, useEffect } from "react";
import axios from 'axios';
function MedicineDetails(props) {
    const { onMedicineData } = props;
    const [medicinename, setMedicinename] = useState('');
    const [medicineOptions, setMedicineOptions] = useState([]); // Store medicine names
    const [dropdownClicked, setDropdownClicked] = useState(false);


    const fetchMedicineNames = async () => {
        try {
            const response = await axios.get('http://localhost:9000/medicineNames');
            if (response.status === 200) {
                const data = response.data; // Assuming the response is an array of objects with medicine_id and name
                setMedicineOptions(data);
            }
        } catch (error) {
            console.error("Error fetching medicine names:", error);
        }
    };

    const handleDropdownClick = () => {
        if (!dropdownClicked) {
            fetchMedicineNames();
            setDropdownClicked(true);
        }
    };

    // useEffect(() => {
    //     // Initialize with the first medicine option (if available)
    //     if (medicineOptions.length > 0) {
    //         setMedicinename(medicineOptions[0].name);
    //         onMedicineData(medicineOptions[0].medicine_id); // Send the initial medicine_id to the parent
    //     }
    // }, [medicineOptions, onMedicineData]);

    return (
        <>
            <select
                className="form-select mx-auto w-50"
                value={medicinename}
                onChange={(e) => {
                    const selectedMedicineName = e.target.value;
                    setMedicinename(selectedMedicineName);
                    // Find the corresponding medicine_id for the selected name
                    const selectedMedicine = medicineOptions.find((option) => option.name === selectedMedicineName);
                    if (selectedMedicine) {
                        onMedicineData(selectedMedicine.medicine_id);
                    }
                }}
                onClick={handleDropdownClick} // Load medicine names onClick
            >
                <option value="">Select Medicine</option>
                {medicineOptions.map((option) => (
                    <option key={option.medicine_id} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
        </>
    );
}

export default MedicineDetails;