import React from "react";
import './About.css';
import picss from './about-us-bg.png'
import healthpic from './HMO-2-1.jpg'
import stresspic from './stress-relief.jpg'
import homemaintenance from '../assets/images/homemaintenance.jpg'
function About() {
    return (
        <>
            <section className="pb-3 pt-5" id="about">
                <div className="container">
                    <div className="row">
                        <div className="col-12 py-3">
                            <div className="bg-img-about-us">
                                <h1 className="text-center" style={{ color: "#116396" }}>ABOUT US</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="bg-holder bg-size bg-img-about">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6 order-lg-1 mb-5 mb-lg-0">
                                <img className="fit-cover rounded-circle w-100" src={picss} alt="imgparent" />
                            </div>
                            <div className="col-md-6 text-center text-md-start">
                                <h2 className="fw-bold mb-4" style={{ color: "#116396" }}>
                                    We are developing a ParentAssist
                                    <br className="d-none d-sm-block" />
                                    system around you
                                </h2>
                                <p>
                                    Welcome to ParentAssist, your all-inclusive platform designed to
                                    <br className="d-none d-sm-block" />
                                    meet the diverse needs of
                                    individuals aged 45-70 and their adult children.
                                    <br className="d-none d-sm-block" />
                                    From proactive health management, medication reminders, and stress relief
                                    <br className="d-none d-sm-block" />
                                    techniques,to seamless home maintenance services
                                    personalized insurance
                                    <br className="d-none d-sm-block" />
                                    management,and innovative medication insights, ParentAssist is your
                                    <br className="d-none d-sm-block" />
                                    comprehensive solution for fostering well-being,family
                                    <br className="d-none d-sm-block" />
                                    connections, and peace of mind.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="pb-3 pt-5" id="service">
                <div className="container">
                    <div className="row">
                        <div className="col-12 py-3">
                            <div>
                                <h1 className="text-center" style={{ color: "#116396" }}>Our Services</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="bg-holder bg-size bg-img-service">
                    <div className="container mb-4">
                        <div className="card">
                            <div className="row no-gutters">
                                <div className="col-md-6">
                                    <img src={healthpic} className="card-img" alt="health_maintain_image" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body">
                                        <h2 className="fw-bold mb-4" style={{ color: "#116396" }}>
                                            Health Maintenance
                                        </h2>
                                        <p>
                                            Health Maintenance empowers parents to take charge of their well-being
                                            <br className="d-none d-sm-block" />
                                            by adding their medical information, personalized doctor details, and
                                            <br className="d-none d-sm-block" />
                                            managing appointments. The Medication Reminders feature ensures timely
                                            <br className="d-none d-sm-block" />
                                            intake of prescribed medicines through email or WhatsApp notifications and dosage instructions.
                                        </p>
                                        <a href="/Login" className="btn btn-primary">
                                            Get Service
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="card">
                            <div className="row no-gutters">
                                <div className="col-md-6">
                                    <img src={stresspic} className="card-img" alt="health_maintain_image" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body">
                                        <h2 className="fw-bold mb-4" style={{ color: "#116396" }}>
                                            Stress Relief Techniques
                                        </h2>
                                        <p>
                                            Experience ultimate tranquility through our Stress Relief Techniques service.
                                            <br className="d-none d-sm-block" />
                                            Our carefully crafted relaxation methods and therapy sections with well talented
                                            <br className="d-none d-sm-block" />
                                            doctors are designed to alleviate stress,promote a peaceful state of mind,
                                            <br className="d-none d-sm-block" />
                                            and rejuvenate your spirit,helping you navigate life's challenges with calmness and clarity.
                                        </p>
                                        <a href="/Login" className="btn btn-primary">
                                            Get Service
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="card">
                            <div className="row no-gutters">
                                <div className="col-md-6">
                                    <img src={homemaintenance} className="card-img" alt="health_maintain_image" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body">
                                        <h2 className="fw-bold mb-4" style={{ color: "#116396" }}>
                                            Home Maintenance
                                        </h2>
                                        <p>
                                            Discover serenity with our Home Maintenance service. Our skilled professionals 
                                            <br className="d-none d-sm-block" /> 
                                            deliver seamless solutions, ensuring your space remains a haven. From routine  
                                            <br className="d-none d-sm-block" />
                                            upkeep to specialized tasks, we handle it all. Experience the ease of a well-maintained
                                            <br className="d-none d-sm-block" /> 
                                            home, allowing you to focus on what truly matters. Your comfort, our priority. 
                                            <br className="d-none d-sm-block" /> 
                                            Welcome to worry-free living with us!
                                        </p>
                                        <a href="/HomeMaintenancePage" className="btn btn-primary">
                                            Get Service
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6 text-center text-md-start">
                                <section className="icons_prop">
                                    <span className="orange icon_size"><i class="bi bi-clipboard2-pulse-fill"></i></span>
                                </section>
                                <h2 className="fw-bold mb-4" style={{ color: "#116396" }}>
                                    Health Maintenance
                                </h2>
                                <p>
                                    Health Maintenance empowers parents to take charge of their well-being
                                    <br className="d-none d-sm-block" />
                                    by adding their medical information, personalized doctor details, and
                                    <br className="d-none d-sm-block" />
                                    managing appointments. The Medication Reminders feature ensures timely
                                    <br className="d-none d-sm-block" />
                                    intake of prescribed medicines through email or WhatsApp notifications and dosage instructions.
                                </p>
                            </div>
                            <div className="col-md-6 text-center text-md-start">
                                <section className="icons_prop">
                                    <span className="orange icon_size"><i class="bi bi-emoji-angry-fill"></i></span>
                                </section>
                                <h2 className="fw-bold mb-4" style={{ color: "#116396" }}>
                                    Stress Relief Techniques
                                </h2>
                                <p>
                                    Experience ultimate tranquility through our Stress Relief Techniques service.
                                    <br className="d-none d-sm-block" />
                                    Our carefully crafted relaxation methods and therapy sections with well talented 
                                    <br className="d-none d-sm-block" />
                                    doctors are designed to alleviate stress,promote a peaceful state of mind, 
                                    <br className="d-none d-sm-block" />
                                    and rejuvenate your spirit,helping you navigate life's challenges with calmness and clarity.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
        </>
    );
}

export default About;