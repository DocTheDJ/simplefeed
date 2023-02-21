import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ipAddress, getJsonHeader } from './constants';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import Login from './components/login';

function Test(){
    const {authTokens, user, logoutUser} = useContext(AuthContext);


    let runGet = async(e) => {
        e.preventDefault();
        console.log('boobs');
        axios.get(ipAddress + 'migrate/', getJsonHeader(authTokens)).then((reponse) => console.log(reponse.data))
    }

    return (
        <div>
            <Login></Login>
            <Button onClick={logoutUser}>Logout</Button>
            <Button onClick={(e) => runGet(e)}></Button>
        </div>
    );
}


export {Test};