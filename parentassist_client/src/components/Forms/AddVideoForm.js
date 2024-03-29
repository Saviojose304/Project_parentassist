import React, { useState } from 'react';
import '../Register.css'
import axios from 'axios';
import AlertBox from "../Alert";
import format from "date-fns/format";

function AddVideoForm() {
    const [videoFile, setVideoFile] = useState(null);
    const [videoError, setVideoError] = useState('');
    const [description, setDescription] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ variant: 'success', message: '', show: false });
    const currentDate = format(new Date(), "yyyy-MM-dd");

    const validateFile = (file) => {
        const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
        const maxSizeMB = 100; // The maximum file size as needed (in megabytes)

        if (!allowedTypes.includes(file.type)) {
            setVideoError('Invalid file type. Please select a valid video file.');
            return false;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setVideoError('File size exceeds the maximum allowed size.');
            return false;
        }

        return true;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setVideoFile(selectedFile);
        }

    };

    const handleAlertClose = () => {
        setAlertInfo({ ...alertInfo, show: false });
        setSubmitClicked(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (videoFile) {
            setSubmitClicked(true);
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('description', description);
            formData.append('date', currentDate);

            try {
                const response = await axios.post('http://13.233.162.230:9000/adminaddVideo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.status === 200) {
                    setAlertInfo({ variant: 'success', message: 'Video added successfully', show: true });
                }

                // Handle the response as needed (e.g., show a success message)
                console.log('Video added successfully:', response.data);

                // Clear the form inputs
                setVideoFile(null);
                setVideoFile('');
                setDescription('');
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    // Email already registered
                    setAlertInfo({ variant: 'danger', message: 'Error adding video', show: true });
                }
                // Handle errors (e.g., show an error message)
                console.error('Error adding video:', error);
            }
        } else {
            setVideoError('Please select a video file.');
        }

    };
    return (
        <>
            <div className="popup-form">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="videoFile" className="form-label">
                            Video File (supported formats: .mp4, .mov, .avi, etc.):
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="videoFile"
                            accept=".mp4, .mov, .avi, video/*"
                            onChange={handleFileChange}
                            required
                        />
                        <div className="red-text" id="name_err">{videoError}</div> <br />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description:
                        </label>
                        <textarea
                            className="form-control"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Add Video
                    </button>
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

export default AddVideoForm;