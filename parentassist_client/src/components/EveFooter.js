import { BsFacebook } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai"
import './Home.css'


function EveFooter() {

    const mystyle = {
        textDecoration: 'none'
    };

    return (
        <>
            {/* Footer */}
            <footer id="contact" className="text-center p-5 bg_clr text-lg-start text-muted">
                {/* Section: Social media */}
                {/* <section className="bg-dark text-center text-white"> */}
                    {/* <div className="container p-4 pb-0"> */}
                        {/* <section className="mb-4"> */}
                            {/* Facebook */}
                            {/* <a
                                className="btn text-white btn-floating m-1"
                                style={{fontSize: "3.2em"}}
                                href="#!"
                                role="button"
                            ><BsFacebook />
                            </a> */}

                            {/* Instagram */}
                            {/* <a
                                className="btn text-white btn-floating m-1"
                                style={{fontSize:"3.2em" }}
                                href="#!"
                                role="button"
                            ><AiFillInstagram />
                            </a> */}
                        {/* </section> */}
                    {/* </div> */}
                {/* </section> */}
                {/* Section: Social media */}

                {/* Section: Links */}
                <section className="">
                    <div className="container  text-center text-md-start mt-5">
                        {/* Grid row */}
                        <div className="row mt-3">
                            {/* Grid column */}
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4 text-white">
                                {/* Content */}
                                <h6 className="text-uppercase fw-bold mb-4">
                                    <i className="fas fa-gem me-3 text-white"></i> ParentAssist 
                                </h6>
                                <p>
                                    Caring Support for Senior Parents
                                </p>
                                {/* <p>
                                    Construction | Commercial | Residential | Interior |<br />
                                     Elecctrical | Industrial | Mechanical  
                                </p> */}
                            </div>
                            {/* Grid column */}

                            {/* Grid column */}
                            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4 text-white">
                                {/* Links  */}
                                <h6 className="text-uppercase fw-bold mb-4">
                                    We Do
                                </h6>
                                <p>
                                    <a style={mystyle} href="#!" className="text-reset">Health Maintenance</a>
                                </p>
                                <p>
                                    <a style={mystyle} href="#!" className="text-reset">Stress Relief Techniques</a>
                                </p>
                                <p>
                                    <a style={mystyle} href="#!" className="text-reset">Home Maintenance</a>
                                </p>
                                <p>
                                    <a style={mystyle} href="#!" className="text-reset">Insurance</a>
                                </p>
                            </div>
                            {/* Grid column */}

                            {/* Grid column */}
                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4 text-white">
                                {/* Links  */}
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Useful links
                                </h6>
                                <p>
                                    <a style={mystyle} href="#About" className="text-reset">About</a>
                                </p>
                                <p>
                                    <a style={mystyle} href="#ourwork" className="text-reset">Services</a>
                                </p>
                                <p>
                                    <a style={mystyle} href="#what" className="text-reset">Home</a>
                                </p>
                            
                            </div>
                            {/* Grid column */}

                            {/* Grid column */}
                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4 text-white">
                                {/* Links */}
                                <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                                <p><i className="fas fa-home me-3 text-secondary"></i> ParentAssist Kottayam, Kerala, India</p>
                                <p><i className="fas fa-phone me-3 text-secondary"></i> + 91 7845 121 100</p>
                                <p><i className="fas fa-print me-3 text-secondary"></i> + 91 7810 456 100</p>
                                <p><i className="fas fa-print me-3 text-secondary"></i>parentassistcare@gmail.com</p>
                            </div>
                            {/* Grid column */}
                        </div>
                        {/* Grid row */}
                    </div>
                </section>
                {/* Section: Links  --> */}

                {/* Copyright */}
                <div className="text-center text-white p-4" style={{ backgroundcolor: "rgba(0, 0, 0, 0.025)" }}>
                    © 2023 Copyright
                </div>
                {/* Copyright */}
            </footer>
            {/* Footer */}
        </>
    );
}

export default EveFooter;