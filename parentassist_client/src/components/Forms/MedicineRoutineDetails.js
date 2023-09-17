import React, { useState } from "react";

function MedicineRoutineDetails() {
    const [morning, setMorning] = useState(false);
    const [noon, setNoon] = useState(false);
    const [night, setNight] = useState(false);
    const [description, setDescription] = useState("");
    const [numberOfDays, setNumberOfDays] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, you can send the data to the server or perform any other action here
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div style={{marginLeft:'15px'}}>
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
                            <tr>
                                <td>Description</td>
                                <td>
                                    <select
                                        className="form-select"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
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
                                        onChange={(e) => setNumberOfDays(e.target.value)}
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
        </>
    );
}

export default MedicineRoutineDetails;