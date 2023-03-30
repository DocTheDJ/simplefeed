import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import {Tab, Tabs} from 'react-bootstrap';

function Availabilities(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + 'supp-availab/', getJsonHeader(authTokens)).then((response) =>{
            setData(response.data)
        });
    }, [authTokens]);

    return(
        <div className="row justify-content-md-center" >
            <div className="col-lg-9" >
                <div className="card p-4">
                <h1 className="text-center mb-4">Skladová dostupnost</h1>
                <br/>
                {
                    data !== null ? 
                        data.length === 0 ? 
                            <p>There are no supplier availabilities</p>
                        :
                            <AvailabilityTabs data={data} context={authTokens}></AvailabilityTabs>
                    :
                        <p>Loading availabilities</p>
                }
                </div>
            </div>
        </div>
    );
}

export default Availabilities;

function AvailabilityTabs(props){
    const [tabkey, setTabKey] = useState(props.data[0].name);
    return(
        <Tabs activeKey={tabkey} onSelect={(e) => setTabKey(e)}>
            {
                props.data.map((value) => {
                    return(
                        <Tab eventKey={value.name} title={value.name} key={`tab_${value.id}`}>
                            <AvailabilityTable data={value.availabilities} context={props.context}></AvailabilityTable>
                        </Tab>
                    );
                })
            }
        </Tabs>
    );
}

function AvailabilityTable(props){
    return(
        <>
            <div className="d-flex justify-content-center">
                <button className="btn btn-success btn-md">Vytvořit dostupnost</button>
            </div>
            <br/>
            <table id="dataTable" className="table table-striped" style={{width:'100%'}}>
                <thead>
                    <tr>
                        <th>Název dostupnosti</th>
                        <th>Nový název dostupnost</th>
                        <th>Možnost zakoupit</th>
                        <th>Dodací lhůta</th>
                        <th></th>
                    </tr>
                </thead>    
                <tbody>
                    {
                        props.data === null ?
                            <p>Loading availabilities</p>
                        :
                            props.data.length > 0 ?
                                props.data.map((value) => {
                                    return(<TableRow data={value} context={props.context} key={`avai_${value.id}`}></TableRow>);
                                })
                            :
                                <p>No availabilities to show</p>
                    }
                </tbody>
            </table>
        </>
    );
}

function TableRow(props){
    const [buyable, setBuyable] = useState(props.data.buyable);
    const [name, setName] = useState(props.data.name === null ? '' : props.data.name);
    const [days, setDays] = useState(props.data.arrives_in === null ? '' : props.data.arrives_in);
    const [active, setActive] = useState(props.data.active)

    let updateBuyable = async(e) => {
        e.preventDefault();
        setBuyable(!buyable);
        axios.get(ipAddress + `availability-buyable/${props.data.id}/${+(!buyable)}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.data !== 'OK'){
                alert('Somthing fucked up');
            }
        });
    }

    let updateNames = async(e) => {
        e.preventDefault();
        let t = {
            name: name,
            arrives_in: days,
        }
        axios.post(ipAddress + `availability-names/${props.data.id}`, t, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.data !== 'OK'){
                alert('Somthing fucked up');
            }
        });
    }

    let updateActive = async(e) => {
        e.preventDefault();
        setActive(!active);
        axios.get(ipAddress + `availability-active/${props.data.id}/${+(!active)}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.data !== 'OK'){
                alert('Somthing fucked up');
            }
        });
    }
    return(
        <tr>
            <td>{ props.data.original_name }</td>
            <td><Form.Control type='text' className="form-control" value={name} onChange={(e) => setName(e.target.value)}></Form.Control></td>
            <td>
                {
                    buyable ?
                        <Button className='btn btn-inverse-success' onClick={(e) => updateBuyable(e)}>Ano</Button>
                    :
                        <Button className='btn btn-inverse-danger' onClick={(e) => updateBuyable(e)}>Ne</Button>
                }
            </td>
            <td><Form.Control type="Number" placeholder="Počet dní" className="form-control" value={days} onChange={(e) => setDays(e.target.value)}></Form.Control></td>
            <td>
                <Button type="button" className="btn btn-inverse-warning btn-icon" onClick={(e) => updateNames(e)}>
                    <i className="ti-pencil-alt ">
                    </i>
                </Button>
                {
                    active ?
                        <Button className="btn btn-inverse-success btn-icon js-discontinue-availability" onClick={(e) => updateActive(e)}>
                            <i className="ti-na" ref={el => {if(el) {el.style.setProperty('marginRight', '100px', 'important');}}}></i>
                        </Button>
                    :
                        <Button className="btn btn-inverse-danger btn-icon js-discontinue-availability" onClick={(e) => updateActive(e)}>
                            <i className="ti-na" ref={el => {if(el) {el.style.setProperty('marginRight', '100px', 'important');}}}></i>
                        </Button>
                }
                {/* {% if a.active %} */}
                    {/* <button type="button" className="btn btn-inverse-success btn-icon js-discontinue-availability" data-name="{{a.id}}" data-way="3" data-data="0">
                        <i style="margin-right: 100px!important;"className="ti-na"></i>
                    </button>
                {% else %}
                    <button type="button" className="btn btn-inverse-danger btn-icon js-discontinue-availability" data-name="{{a.id}}" data-way="3" data-data="1">
                        <i style="margin-right: 100px!important;"className="ti-na"></i>
                    </button> */}
                {/* {% endif %} */}
            </td>
        </tr>
    );
}