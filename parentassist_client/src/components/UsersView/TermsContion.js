import React from 'react';
import { useNavigate } from 'react-router-dom';
import cardimag from '../hero.png'
function TermsCondition() {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate('/seller-registration'); 
    };
    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    {/* Left side with an image */}
                                    <div className="col-md-4">
                                        <img
                                            src={cardimag} // Replace with your image URL
                                            alt="Medicine Seller"
                                            className="img-fluid"
                                        />
                                    </div>

                                    {/* Right side with terms and conditions */}
                                    <div className="col-md-8">
                                        <h3>Welecome to ParentAssist </h3>
                                        <h5 className="card-title">Terms and Conditions</h5>
                                        <p className="card-text">
                                            By accessing and using this platform, you agree to the
                                            following terms and conditions:
                                        </p>
                                        <ol className="card-text font-bold">
                                            <li>
                                                You must comply with all applicable laws and regulations.
                                            </li>
                                            <li>
                                                Selling unauthorized or illegal medicines is strictly
                                                prohibited.
                                            </li>
                                            <li>
                                                We reserve the right to suspend or terminate your account
                                                for any violation of these terms.
                                            </li>
                                        </ol>
                                        <p className="card-text">
                                            By clicking "Accept," you confirm your understanding and
                                            acceptance of these terms and conditions.
                                        </p>
                                        <button className="btn btn-primary w-50" onClick={handleAccept}>Accept</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TermsCondition;