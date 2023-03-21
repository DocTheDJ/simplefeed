import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ipAddress, getJsonHeader, WarningStyle, dataCheck } from '../constants';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';


function Manufacturers(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + 'manufacturers/', getJsonHeader(authTokens)).then((response) => setData(response.data));
    }, [authTokens]);

    return(
        <div class="row justify-content-md-center" >
            <div class="col-lg-7" >
                <div class="card p-4">
                <h1 class="text-center mb-5">Vyrobci</h1>
                <table id="dataTable" class="table table-striped" style={{width:'100%'}}>
                    <thead>
                        <tr>
                            <th>Název vyrobce</th>
                            <th>Nový název vyrobce</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((value) => {
                                return(<ManRow data={value} key={value.id} context={authTokens}></ManRow>);
                            })
                        }
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
}

export default Manufacturers;

function ManRow(props){
    const [name, setName] = useState(props.data.name);
    const [message, setMessage] = useState(null);
    let update = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        let send = true;
        let tmp;
        if(!(tmp = dataCheck(name, formData, 'name'))){
            send &= tmp;
            setMessage('Missing name');
        }
        if(send){
            try{
                axios.post(ipAddress + `update-manufacturer-name/${props.data.id}`, formData, getJsonHeader(props.context)).then((response) => {
                    if(response.status !== 200 || response.data !== 'OK'){
                        alert('Something fucked up');
                    }
                })
            }catch(e){
                console.log(e);
            }
        }
    }
    return (
        <tr>
            <td>{props.data.original_name}</td>
            <td>
                <Form.Group>
                    <Form.Control onChange={(e) => setName(e.target.value)} value={name} type='text'></Form.Control>
                    <Form.Text>{message ? <p style={WarningStyle}>{message}</p> : null}</Form.Text>
                </Form.Group>
            </td>
            <td><Button className='btn btn-primary' onClick={(e) => update(e)}>Update</Button></td>
        </tr>
    );
}