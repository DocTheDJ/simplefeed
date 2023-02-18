import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ipAddress, getJsonHeader } from './constants';
import axios from 'axios';
import AuthContext from './context/AuthContext';

function Test(){
    const {authTokens, user} = useContext(AuthContext);

    let runGet = async(e) => {
        e.preventDefault();
        console.log('boobs');
        axios.get(ipAddress + 'product-list/', getJsonHeader(authTokens)).then((response) => {
            console.log(response.data)
        });
    }

    return (
        <div>
            <Button onClick={(e) => runGet(e)}>Test</Button>
        </div>
    );
}

export default Test;