import React, { useContext, useState } from 'react';
import AuthContext from './context/AuthContext';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import {Test} from './test';
import "./cssModules";
import Header from './header';
import Navigation from './navigation';
import Overview from './pages/overview';

function NavBar(){
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // let {loginUser} = useContext(AuthContext);
    return (
        <div class="container-scroller">
            <Header></Header>
            <div class="container-fluid page-body-wrapper">
                <Navigation></Navigation>
                <div class="main-panel">
                    <div class="content-wrapper">
                        <Overview></Overview>
                    </div>
                </div>
            </div>
            {/* <div>
                <Form onSubmit={event => loginUser(event, username, password)} id='loginForm'>
                    <Form.Group>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control onChange={(e) => setUsername(e.target.value)} value={username}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type='password' onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </Form.Group>
                    <Form.Group>
                        <Button form="loginForm" type='submit'>Login</Button>
                    </Form.Group>
                </Form>
            </div>
            <Test/> */}
        </div>
    );
}

export default NavBar;