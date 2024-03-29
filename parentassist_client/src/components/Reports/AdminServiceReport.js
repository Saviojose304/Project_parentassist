import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { Modal } from "react-bootstrap";

function AdminServiceReports({ userId }) {
    const [acceptedServices, setAcceptedServices] = useState([]);
    const [requestedServices, setRequestedServices] = useState([]);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            axios.get(`http://13.233.162.230:9000/getRequestServices?user_id=${userId}`)
                .then((response) => {
                    if (response.status === 200) {
                        const { matchingServiceRequests, servicePaymentDetails } = response.data;

                        const accepted = matchingServiceRequests.filter(service => service.status === "Approved");
                        // For each accepted service, find corresponding payment details
                        const acceptedWithAmount = accepted.map(service => {
                            const paymentDetail = servicePaymentDetails.find(payment => payment.srq_id === service.srq_id);
                            return { ...service, amount: paymentDetail ? paymentDetail.amount : null };
                        });

                        //const requested = matchingServiceRequests.filter(service => service.locationStatus === "" || service.locationStatus === "pending");

                        setAcceptedServices(acceptedWithAmount);
                        //setRequestedServices(requested);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching doctor visit details:", error);
                });
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const year = date.getFullYear();

        // Pad single digit day and month with leading zero
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    //console.log(acceptedServices);

    const openPdfModal = (user) => {
        setSelectedUser(user);
        setShowPdfModal(!showPdfModal);
    };

    const styles = StyleSheet.create({
        page: {
            flexDirection: "row",
            backgroundColor: "#fff",
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
        title: {
            fontSize: 24,
            marginBottom: 10,
        },
        table: {
            display: "table",
            width: "100%",
            borderCollapse: "collapse",
        },
        tableRow: {
            flexDirection: "row",
        },
        tableCellHeader: {
            backgroundColor: "#f2f2f2",
            fontWeight: "bold",
            padding: 5,
            flex: 1,
            border: "1px solid #ccc",
        },
        tableCell: {
            padding: 5,
            fontSize: 12,
            flex: 1,
            border: "1px solid #ccc",
        },
    });


    const generatePdf = () => {
        if (!selectedUser) return null;

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.title}>Service Details</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCellHeader}><Text>Name</Text></View>
                                <View style={styles.tableCellHeader}><Text>Phone</Text></View>
                                <View style={styles.tableCellHeader}><Text>Date</Text> </View>
                                <View style={styles.tableCellHeader}><Text>Service</Text> </View>
                                <View style={styles.tableCellHeader}><Text>Amount</Text> </View>
                            </View>
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCell}><Text>{selectedUser.name}</Text></View>
                                    <View style={styles.tableCell}><Text>{selectedUser.user_phone}</Text></View>
                                    <View style={styles.tableCell}><Text>{formatDate(selectedUser.date)}</Text></View>
                                    <View style={styles.tableCell}><Text>{selectedUser.service_name}</Text></View>
                                    <View style={styles.tableCell}><Text>{selectedUser.amount}</Text></View>
                                </View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    };

   

    return (
        <>
            <div className=" w-full shadow-md shadow-gray-400 rounded-md mt-28 lg:mt-12 bg-white mx-auto ">
                <div className="w-full bg-blue-700 text-white font-semibold text-xl  text-center px-3 py-4">
                    Service Details
                </div>
                <div className="bg-slate-100 w-full">
                    <div className="table-container p-2 overflow-x-auto overflow-y-auto h-96">
                        <thead>
                            <tr>
                                <th className=" text-white bg-blue-500 w-20 p-2">
                                    Sl No
                                </th>
                                <th className=" text-white bg-blue-500 w-36 p-2">
                                    Name
                                </th>
                                <th className=" text-white bg-blue-500 w-40 p-2">
                                    Phone
                                </th>
                                <th className=" text-white bg-blue-500 w-40 p-2">Date</th>
                                <th className=" text-white bg-blue-500 w-40 p-2">
                                    Service
                                </th>
                                <th className=" text-white bg-blue-500 w-64 p-2">
                                    Amount
                                </th>
                                <th className=" text-white bg-blue-500 w-64 p-2">
                                    Report
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {acceptedServices.map((AcList, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {index + 1}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {AcList.name}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {AcList.user_phone}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {formatDate(AcList.date)}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {AcList.service_name}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {AcList.amount}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <button
                                            className="btn btn-primary btn-md"
                                            onClick={() => openPdfModal(AcList)}
                                        >
                                             <i class="bi bi-file-arrow-down-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </div>
                </div>
            </div>

            <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Download PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PDFViewer width="100%" height="500px">
                        {generatePdf()}
                    </PDFViewer>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AdminServiceReports;