function Resetpass() {
    return (
        <>
            <div className='h-100 justify-content-center d-flex align-content-center p-5'>
                <Card className="text-center" style={{ width: '500px' }}>
                    <Card.Header className="h5 text-white" style={{ backgroundColor: "#116396" }}>Password Reset</Card.Header>
                    <Card.Body className="px-5">
                        <div className="form-outline">
                            <input type="password" id="repass" value={repass} className="form-control my-3" placeholder='Enter your password' onChange={setpass} required />
                        </div>
                        <div className="form-outline">
                            <input type="password" id="crepass" value={crepass} className="form-control my-3" placeholder='Re-enter your password' onChange={setconpass} required />
                        </div>
                        <Button href="#" onClick={sendmail} className="btn w-50" style={{ backgroundColor: "#116396" }}>
                            Reset password
                        </Button>
                        <div className="d-flex justify-content-between mt-4">
                            <Button href='/Login' className='btn w-25 btn-light text-light' style={{ backgroundColor: "#116396" }}>Log In</Button>
                            <Button href='/Register' className='btn w-25 btn-light text-light' style={{ backgroundColor: "#116396" }}>Register</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default Resetpass;