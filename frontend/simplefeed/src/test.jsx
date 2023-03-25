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
        axios.get(ipAddress + 'migrate/', getJsonHeader(authTokens)).then((reponse) => console.log(reponse.data))
    }

    let addDefault = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + 'add-default/', getJsonHeader(authTokens)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }
        })
    }

    let importAll = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + 'import-all/', getJsonHeader(authTokens)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'started'){
                alert('Something fucked up');
            }
        })
    }

    return (
        <div>
            {
                user === null || user === undefined ? 
                    <Login></Login>
                :
                    <>
                        <Button onClick={logoutUser}>Logout</Button>
                        <Button onClick={(e) => runGet(e)}>Migrate</Button>
                        <Button onClick={(e) => addDefault(e)}>Add defaults</Button>
                        <Button onClick={(e) => importAll(e)}>Import data</Button>
                    </>
            }
        </div>
    );
}


export {Test};