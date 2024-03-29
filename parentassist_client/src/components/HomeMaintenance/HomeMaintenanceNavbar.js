import React, { useState, Fragment, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from "@react-oauth/google";

function HomeMaintenanceNavbar({ setLatitude, setLongitude }) {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedLocationInfo, setSelectedLocationInfo] = useState({
        location: 'Kanjirappally',
        latitude: '9.544032399999999',
        longitude: '76.81041661499324',
    });

    useEffect(() => {
        // Fetch locations from the backend
        fetch('http://13.233.162.230:9000/api/distinct-locations')
            .then((response) => response.json())
            .then((data) => {
                setLocations(data);
            })
            .catch((error) => console.error('Error fetching locations:', error));
    }, []);

    const handleLocationSelect = (location, latitude, longitude) => {
        setSelectedLocationInfo({ location, latitude, longitude });
        setLatitude(latitude);
        setLongitude(longitude);

        setDropdownVisible(false);
    };

    const logOut = async () => {
        try {
            googleLogout();
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const navigation = [
        { name: 'SELECT LOCATION', href: '#', current: false, dropdown: true },
        { name: 'HOME', href: '/', current: true },
        token
            ? { name: 'LOGOUT', href: '/LogOut', current: false }
            : { name: 'LOG IN', href: '/Login', current: false },
        !token
            ? { name: 'REGISTER AS SERVICE PROVIDER', href: '/service-registration', current: false }
            : {},
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <>
            <Disclosure as="nav" className="bg-white fixed top-0 w-full z-10">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="flex flex-shrink-0">
                                <div className=" sm:hidden">
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                    <a style={{ color: "#116396" }} className="navbar-brand" href="#">
                                        ParentAssist
                                    </a>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <div key={item.name}>
                                                {item.dropdown ? (
                                                    <Disclosure as="div" className="relative inline-block text-left">
                                                    {({ open }) => (
                                                      <>
                                                        <Disclosure.Button 
                                                        style={{ color: '#116396', fontWeight: '700' }}
                                                          className="rounded-md text-decoration-none py-2 font-medium"
                                                          onClick={() => setDropdownVisible(!dropdownVisible)}
                                                        >
                                                          {selectedLocationInfo.location}
                                                        </Disclosure.Button>
                                    
                                                        <Disclosure.Panel
                                                          className={`absolute z-10 mt-2 space-y-2 bg-white border rounded-md shadow-md ${dropdownVisible ? 'block' : 'hidden'}`}
                                                        >
                                                          {locations.map((location) => (
                                                                <button
                                                                    key={location.location_id}
                                                                    onClick={() =>
                                                                        handleLocationSelect(
                                                                            location.location,
                                                                            location.latitude,
                                                                            location.longitude
                                                                        )
                                                                    }
                                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    {location.location}
                                                                </button>
                                                            ))}
                                                        </Disclosure.Panel>
                                                      </>
                                                    )}
                                                  </Disclosure>
                                                    
                                                ) : (
                                                    <Disclosure.Button
                                                        style={{ color: '#116396', fontWeight: '700' }}
                                                        as="a"
                                                        href={item.href}
                                                        
                                                        className={classNames(
                                                            item.current
                                                                ? 'bg-white-900 block rounded-md text-decoration-none py-2 font-medium '
                                                                : 'block rounded-md text-decoration-none py-2 font-medium'
                                                        )}
                                                        aria-current={item.current ? 'page' : undefined}
                                                        onClick={() => setDropdownVisible(!dropdownVisible)}
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                               
                            </div>
                        </div>
                        <Disclosure.Panel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <div key={item.name}>
                                        {item.dropdown ? (
                                            <div className="relative inline-block text-left">
                                                <Disclosure.Button
                                                    style={{ color: '#116396', fontWeight: '700' }}
                                                    onClick={() => setDropdownVisible(!dropdownVisible)}
                                                    as="button"
                                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    {item.name}
                                                </Disclosure.Button>

                                                <Disclosure.Panel className="space-y-2 bg-white border rounded-md shadow-md">
                                                    {locations.map((location) => (
                                                        <button
                                                            key={location.location_id}
                                                            onClick={() =>
                                                                handleLocationSelect(
                                                                    location.location,
                                                                    location.latitude,
                                                                    location.longitude
                                                                )
                                                            }
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            {location.location}
                                                        </button>
                                                    ))}
                                                </Disclosure.Panel>
                                            </div>
                                        ) : (
                                            <Disclosure.Button
                                                style={{ color: '#116396', fontWeight: '700' }}
                                                as="button"
                                                onClick={() => setDropdownVisible(!dropdownVisible)}
                                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </>
    );
}

export default HomeMaintenanceNavbar;
