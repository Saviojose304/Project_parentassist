import React, { useState } from "react";
import axios from 'axios';
function MedicineDetails() {
    const [medicinename, setMedicinename] = useState('');
    const [medicineOptions, setMedicineOptions] = useState([]); // Store medicine names
    const [dropdownClicked, setDropdownClicked] = useState(false);


    const fetchMedicineNames = async () => {
        try {
            const response = await axios.get('http://localhost:9000/medicineNames');
            if (response.status === 200) {
                const names = response.data; // Assuming the response is an array of medicine names
                setMedicineOptions(names);
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

    return (
        <>
            <select
                className="form-select mx-auto w-50"
                value={medicinename}
                onChange={(e) => setMedicinename(e.target.value)}
                onClick={handleDropdownClick} // Load medicine names onClick
            >
                <option value="">Select Medicine</option>
                {medicineOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </>
    );
}

export default MedicineDetails;