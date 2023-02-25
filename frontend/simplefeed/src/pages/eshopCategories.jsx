import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import Tile from '../components/categoryTile';

function EshopCategories(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + 'categories', getJsonHeader(authTokens)).then((response) => setData(response.data[0]));
    }, [authTokens]);

    return (
        <div className="row justify-content-md-center" >
            <div className="col-lg-6" >
                <h1 className="text-center">Eshopové kategorie</h1>
                <div className="row d-flex justify-content-center mt-3 mb-2 ">
                    <button className="btn btn-success btn-icon mr-1 js-cat-insert-modal"><span className="mdi mdi-plus"></span></button>
                    <a href="/pull_cats/"><button className="btn btn-primary btn-icon-text"><span className="mdi mdi-reload"></span> Aktualizovat</button></a>
                </div>
                <br/>
                <ul className="list-group" data-target="roots" style={{boxShadow: '10px 10px 71px 0px rgba(0,0,0,0.09)'}}>
                    {
                        data !== null ? 
                            <Tile data={data} key={data.id} context={authTokens} modal={false} setData={setData}></Tile>
                        :
                            <p>Loading categories</p>
                    }
                </ul>
            </div>
        </div>

    );
}

export default EshopCategories;