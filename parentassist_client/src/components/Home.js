import './Home.css'
import Header from './Header';
import About from './About';
import EveFooter from './EveFooter';
import pic from './hero.png'
function Home() {
    return (
        <>
            <Header />
            <section className='py-xxl-5 pb-0' id='home'>
                <div className="bg-img">
                    <div className='head-pad '>
                        <div className='container cont-mg'>
                            <div className='row d-flex my-lg-3 mx-auto my-md-3 my-sm-3 pt-lg-5 pt-md-5 pt-sm-5'>
                                <div className='col-md-5 text-md-start text-center'>
                                    <h1 className='text-center p-3 fs-1 fst-italic fw-bold' style={{color:"#116396"}}>ParentAssist
                                        <br/><h4 className='text-center p-1'>We're determined for your better life.</h4>
                                    </h1>
                                </div>
                                <div className='col-md-5 text-lg-end text-md-end text-sm-end'>
                                    <img className='image img-size' src={pic} alt='hero_load'></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <About />
            <EveFooter />
        </>
    );
}

export default Home;