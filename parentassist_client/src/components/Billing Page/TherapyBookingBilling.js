import React, { useEffect, useState } from "react";
import axios from "axios";
import AlertBox from "../Alert";
import { useNavigate, useParams } from "react-router-dom";
import Razorpay from "react-razorpay";
function TherapyBookingBilling(props) {
    const navigate = useNavigate();
    const { selectedDate, parentUserId, doctorId } = props;
    const [appointmentFee] = useState(250);
    const [sectionFee] = useState(500);
    const totalBillAmount = appointmentFee + sectionFee;
    const [paymentStatus, setPaymentStatus] = useState(null);


    const handlePayment = async () => {

        try {
            const initiatePaymentResponse = await axios.post("http://13.233.162.230:9000/initiate-payment", {
                amount: totalBillAmount,
                date: new Date().toISOString(), // Pass the desired date
            });

            const { order_id } = initiatePaymentResponse.data;
            console.log(order_id);

            const options = {
                key: "rzp_test_9jMMbEMH5GTU9V",
                amount: totalBillAmount * 100, // Amount in paise (100 paise = 1 INR)
                currency: "INR",
                name: "ParentAssist",
                description: "Appointment Bill Payment",
                order_id: order_id,
                handler: async (response) => {
                    try {
                        // Send the payment response to your backend for verification
                        const paymentResponse = await axios.post("http://13.233.162.230:9000/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            amount: totalBillAmount,
                            date: new Date().toISOString(),
                            status: response.razorpay_signature,
                            SelectedDate: selectedDate,
                            parent_user_id: parentUserId,
                            doctor_id: doctorId,
                        });
                        console.log("Payment Response:", paymentResponse.data);

                        // Update payment status
                        setPaymentStatus("success");
                    } catch (error) {
                        console.error("Payment Verification Error:", error);
                        // Handle payment verification error
                        setPaymentStatus("failed");
                    }
                },
                // prefill: {
                //     name: "Gaurav Kumar",
                //     email: "gaurav.kumar@example.com",
                //     contact: "9000090000",
                // },
                // notes: {
                //     address: "Razorpay Corporate Office",
                // },
                theme: {
                    color: "#3399cc",
                },
            };

            // Create a new Razorpay instance with the options
            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open(); // Open the Razorpay payment dialog

            // ... create Razorpay instance ...
        } catch (error) {
            console.error("Error initiating payment:", error);
            // Handle payment initiation error
        }
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="card">
                    <div className="card-body text-center">
                        <p>Appointment Fee: <i className="bi bi-currency-rupee"></i>{appointmentFee}</p>
                        <p>Section Fee: <i className="bi bi-currency-rupee"></i>{sectionFee}</p>
                        <p>Total Bill Amount: <i className="bi bi-currency-rupee"></i>{totalBillAmount}</p>
                        <button id="cancel_button" className="btn btn-outline-danger" onClick={async () => {
                                // Show a confirmation dialog before canceling
                                const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
                                if (confirmed) {
                                    // Make an API request to cancel the appointment
                                    const response = await axios.delete(`http://13.233.162.230:9000/cancelTherappyappointment/${doctorId}/${parentUserId}/${selectedDate}`);
                                    if (response.status === 200) {
                                        // Update the UI or handle success as needed
                                        console.log("Appointment cancelled successfully");
                                        // Show a success alert
                                        alert("Appointment cancelled successfully");
                                        navigate("/ParentServiceView");
                                    } else {
                                        console.error("Failed to cancel appointment");
                                    }
                                }
                        }}>Cancel Appointment</button>
                        <button className="btn btn-success ms-2" onClick={handlePayment}>
                            Pay Bill
                        </button>
                        {/* Display payment status */}
                        {paymentStatus === "success" && (
                            <div className="alert alert-success mt-3">
                                Payment Successful! Your appointment is confirmed.
                                {navigate("/ParentServiceView")}
                            </div>
                        )}
                        {paymentStatus === "failed" && (
                            <div className="alert alert-danger mt-3">
                                Payment Failed. Please try again or contact support.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TherapyBookingBilling;