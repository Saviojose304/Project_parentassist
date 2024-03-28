import React from 'react'
import { Fragment } from 'react'
import { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon,  XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { googleLogout } from "@react-oauth/google";
function Header() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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
        { name: 'HOME', href: '/', current: true },
        { name: 'ABOUT', href: '#about', current: false },
        { name: 'SERVICES', href: '#service', current: false },
        { name: 'CONTACT US', href: '#contact', current: false },
        token
            ? { name: 'LOGOUT', href:'/LogOut', current: false } 
            : { name: 'LOG IN', href: '/Login', current: false },
        !token
            ? { name: 'SIGN UP', href: '/Register', current: false }
            : {  },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const [show, setshow] = useState(true);
    const toggleClass = () => {
        setshow(show);
    };


    return (
        <>
            {/* <nav className="navbar navbar-expand-md fixed-top navbar-light bgclr">
                <div className="container-fluid">
                    <a style={{ color: "#116396" }} className="navbar-brand ms-5" href="#">ParentAssist</a>
                    <button style={{ color: "#116396" }} className="shadow-none navbar-toggler" onClick={() => setshow(!show)} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        {show ? <Menu /> : <Close />}
                    </button>
                    <div className={show ? 'collapse navbar-collapse' : 'collapse navbar-collapse active'}>
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item ">
                                <a style={{ color: "#116396" }} className="nav-link" aria-current="page" href="#">HOME</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: "#116396" }} className="nav-link" href="#about">ABOUT</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: "#116396" }} className="nav-link" href="#service">SERVICES</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: "#116396" }} className="nav-link" href="#contact">CONTACT US</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: "#116396" }} className="nav-link" href="/Login">LOG IN</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: "#116396" }} className="nav-link" href="/Register">SIGN UP</a>
                            </li>
                        </ul>
                        <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            
                            <a href="#" style={{ color: "#116396",fontWeight:"700" }} className="rounded-md text-decoration-none py-2   font-medium">HOME</a>
                            <a href="#" style={{ color: "#116396",fontWeight:"700" }} className="rounded-md text-decoration-none py-2  font-medium">ABOUT</a>
                            <a href="#" style={{ color: "#116396",fontWeight:"700" }} className="rounded-md text-decoration-none py-2  font-medium">SERVICES</a>
                            <a href="#" style={{ color: "#116396",fontWeight:"700" }} className="rounded-md text-decoration-none py-2  font-medium">CONTACT US</a>
                            <a href="/Login" style={{ color: "#116396",fontWeight:"700"}} className="rounded-md text-decoration-none py-2 font-medium">LOG IN</a>
                            <a href="/Register" style={{ color: "#116396",fontWeight:"700",paddingRight:"25px" }} className="rounded-md text-decoration-none py-2 font-medium">SIGN UP</a>
                        </div>
                    </div>
                    </div>
                </div>
            
        </nav> */}
            <Disclosure as="nav" className="bg-white fixed top-0 w-full z-10">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2">
                                        
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-between sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <a style={{ color: "#116396" }} className="navbar-brand ms-5" href="#">ParentAssist</a>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block items-center justify-end flex-1">
                                        <div className="flex space-x-4 justify-content-end">
                                            {navigation.map((item) => (
                                                <a
                                                    style={{ color: "#116396", fontWeight: "700" }}
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current ? 'bg-white-900 rounded-md text-decoration-none py-2 font-medium ' : 'rounded-md text-decoration-none py-2 font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        style={{ color: "#116396", fontWeight: "700" }}
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-white-900 rounded-md text-decoration-none py-2 font-medium ' : 'block rounded-md text-decoration-none py-2 font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

        </>
    )
}

export default Header