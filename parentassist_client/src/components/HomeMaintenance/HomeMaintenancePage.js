import React, { useState, useEffect } from "react";
import HomeMaintenanceNavbar from "./HomeMaintenanceNavbar";
import ServiceContainer from "./ServiceContainer";
import { useParams } from 'react-router-dom';


function HomeMaintenance() {
    const [latitude, setLatitude] = useState("9.544032399999999");
    const [longitude, setLongitude] = useState("76.81041661499324");

    return (
        <>
            <HomeMaintenanceNavbar setLatitude={setLatitude} setLongitude={setLongitude} />
            <ServiceContainer  latitude={latitude} longitude={longitude}/>
            
        </>
    );
}

export default HomeMaintenance;
