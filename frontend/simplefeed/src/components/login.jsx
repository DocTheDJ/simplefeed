import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useState, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { ipAddress } from '../constants';

function Login(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let {loginUser} = useContext(AuthContext);

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
                            <Register loginUser={loginUser}></Register>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="success" form='loginForm' type='submit'>Login</Button>
                        </Modal.Footer>
                    </div>
            </Modal>
        </>
    );
}

export default Login;


function Register(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    let register = async(e) => {
        e.preventDefault();
        let t = {
            username: username,
            password: password,
        }
        axios.post(ipAddress + 'register-user/', t).then((response) => {
            if(response.status !== 200 || response.statusText !== 'User is registered'){
                alert('Something fucked up');
            }else{
                props.loginUser(e, username, password);
                handleClose();
            }
        });
    }

    return(
        <>
            <Button variant="outline-danger" onClick={handleShow}>
                Register
            </Button>
            <Modal 
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
                className="fade">
                    <div className='custom-modal'>
                        <Modal.Body>
                            <Form className='custom-form' onSubmit={event => register(event)} id='regForm'>
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
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="success" form='regForm' type='submit'>Register</Button>
                        </Modal.Footer>
                    </div>
            </Modal>
        </>
    );
}