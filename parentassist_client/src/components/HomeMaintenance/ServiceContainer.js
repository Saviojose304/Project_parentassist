import React, { useState, useEffect } from "react";
import ACicon from "../../assets/images/ac.png";
import Buildericon from "../../assets/images/Builder.png";
import carpentaryicon from "../../assets/images/carpentary.png";
import Electricalicon from "../../assets/images/Electrical.png";
import interioricon from "../../assets/images/interior.png";
import paintingicon from "../../assets/images/painting.png";
import pestcontrolicon from "../../assets/images/pestcontrol.png";
import plumbingicon from "../../assets/images/plumbing.png";
import cleaningIcon from "../../assets/images/cleaning.png";
import driverIcon from "../../assets/images/driverIcon.png"
import { IoClose } from "react-icons/io5";
import { useParams } from 'react-router-dom';



function ServiceContainer({ latitude, longitude }) {
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);


    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`https://13.233.162.230:9000/servicesperlocation?latitude=${latitude}&longitude=${longitude}`);
                const data = await response.json();
                console.log(data);
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        if (latitude && longitude) {
            fetchServices();
        }
    }, [latitude, longitude]);

    const getIconForService = (serviceName) => {
        switch (serviceName) {
            case 'Cleaning':
                return cleaningIcon;
            case 'Electrical':
                return Electricalicon;
            case 'Plumbing':
                return plumbingicon;
            case 'Carpentry':
                return carpentaryicon;
            case 'Builder':
                return Buildericon;
            case 'Driver':
                return driverIcon;
            default:
                return Electricalicon;
        }
    };

    const servicesperbox = services.map((service) => ({
        icon: getIconForService(service.service),
        title: service.service,
        count: service.provider_count,
    }));



    return (
        <>
            <div className="container-fluid h-full bg-blue-300 mt-11">
                <div className="container">
                    <h1 className="text-4xl font-bold p-4 mb-2">Our Services</h1>
                    <div className="mx-auto p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {servicesperbox.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded shadow cursor-pointer"
                            >
                                <img src={service.icon} alt={service.title} className="w-16 h-16 mx-auto mb-4" />
                                <h2 className="text-xl font-bold mb-2 text-center">{service.title}</h2>
                                <p className="text-gray-600 text-center">{service.count} Available at your Location</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}

export default ServiceContainer;
