import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ipAddress, getJsonHeader, dataCheck } from './constants';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import Login from './components/login';
import Form from 'react-bootstrap/Form';

function Test(){
    const {authTokens, user, logoutUser} = useContext(AuthContext);
    const [operation, setOperation] = useState('+');
    const [value, setValue] = useState(null);
    const [unit, setUnit] = useState(1);
    const [from, setFrom] = useState(null);

    let runGet = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + 'migrate/', getJsonHeader(authTokens)).then((reponse) => console.log(reponse.data))
    }

    let addDefault = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + 'add-default/', getJsonHeader(authTokens)).then((response) => {
            if(response.status !== 200 || response.data !== 'OK'){
                alert('Something fucked up');
            }
        })
    }

    let importAll = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + 'import-all/', getJsonHeader(authTokens)).then((response) => {
            if(response.status !== 200 || response.data !== 'started'){
                alert('Something fucked up');
            }
        })
    }

    let test = async(e) => {
        e.preventDefault()
        axios.get(ipAddress + 'test/', getJsonHeader(authTokens)).then((response) => {
            if(response.status !== 200 || response.data !== 'OK'){
                alert('Something fucked up');
            }
        })
    }

    let createRule = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        let send = true;
        let tmp;
        if(!(tmp = dataCheck(operation, formData, 'operation'))){
            send &= tmp;
        }
        if(!(tmp = dataCheck(value, formData, 'value'))){
            send &= tmp;
        }
        if(!(tmp = dataCheck(unit, formData, 'unit'))){
            send &= tmp;
        }
        if(!(tmp = dataCheck(from, formData, 'from'))){
            send &= tmp;
        }
        if(send){
            axios.post(ipAddress + 'create_rule/', formData, getJsonHeader(authTokens)).then((response) => {
                if(response.status !== 200 || response.data !== 'OK'){
                    console.log(response);
                    alert('Something fucked up');
                }
            })
        }
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
                        <Button onClick={(e) => test(e)}>Test</Button>
                        <Button onClick={(e) => createRule(e)}>Crete rule</Button>
                        <Form>
                            <Form.Select onChange={(e) => setOperation(e.target.value)} value={operation}>
                                <option value={'+'}>+</option>
                                <option value={'-'}>-</option>
                                <option value={'-'}>*</option>
                            </Form.Select>
                            <Form.Control onChange={(e) => setValue(e.target.value)} value={value}></Form.Control>
                            <Form.Select onChange={(e) => setUnit(e.target.value)} value={unit}>
                                <option value={1}>%</option>
                                <option value={2}>Kc vc. DPH</option>
                                <option value={3}>Kc bez DPH</option>
                            </Form.Select>
                            <Form.Select onChange={(e) => setFrom(e.target.value)} value={from}>
                                <option value={'rec_price'}>Prodejni cena</option>
                                <option value={'pur_price'}>Nakupni cena</option>
                                <option value={'price'}>Beznou cenu</option>
                            </Form.Select>
                        </Form>
                    </>
            }
        </div>
    );
}


export {Test};