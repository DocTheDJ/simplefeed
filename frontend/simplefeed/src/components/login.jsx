import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useState, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { ipAddress, getJsonHeader } from '../constants';

function Login(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let {authTokens, loginUser} = useContext(AuthContext);

    return (
        <>
            <Button variant="outline-danger" onClick={handleShow}>
                Login
            </Button>
            <Modal 
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
                className="fade">
                    <div className='custom-modal'>
                        <Modal.Body>
                            <Form className='custom-form' onSubmit={event => loginUser(event, username, password)} id='loginForm'>
                                <Form.Group>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control className='form-control' onChange={(e) => setUsername(e.target.value)} value={username}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control className='form-control' type='password' onChange={(e) => setPassword(e.target.value)} value={password}/>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <Register buttonValue={"Register"} variant={'info'}></Register> */}
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="success" form='loginForm' type='submit'>Login</Button>
                        </Modal.Footer>
                    </div>
            </Modal>
        </>
    );
}

export default Login;