import React from 'react'
import { useState } from 'react'
import { Menu, Close } from '@material-ui/icons';


function Header() {
    const [show, setshow] = useState(true);
    const toggleClass = () => {
        setshow(show);
    };

    const token = localStorage.getItem('token');
    console.log(token);

    return (
        <>
            <nav className="navbar navbar-expand-md fixed-top navbar-light bgclr">
                <div className="container-fluid">
                    <a style={{ color: "#116396" }} className="navbar-brand ms-5" href="#">ParentAssist</a>
                    <button style={{ color: "#116396" }} className="shadow-none navbar-toggler" onClick={() => setshow(!show)} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        {/* <span className="navbar-toggler-icon"></span> */}
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
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header