import React, { useContext, useState } from 'react';

function Panels(props){
    return (
        <div className="col-md-12">
            <div className="row mb-5">
                <div className="col-md-3 mb-4 mb-lg-0 stretch-card transparent">
                    <div className="card card-light-blue">
                        <div className="card-body">
                            <p className="mb-4">Počet produktů</p>
                            <p className="fs-30 mb-2">{props.total_products}</p>
                            <p>{props.total_variants} Variant</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 stretch-card transparent">
                    <div className="card card-dark-blue">
                        <div className="card-body">
                            <p className="mb-4">Aktivní produkty</p>
                            <p className="fs-30 mb-2">{props.active_products}</p>
                            <p>{props.active_variants} Variant</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 stretch-card transparent">
                    <div className="card card-tale">
                        <div className="card-body">
                            <p className="mb-4">Zamítnuté produkty</p>
                            <p className="fs-30 mb-2">{props.inactive_products}</p>
                            <p>{props.inactive_variants} Variant</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 stretch-card transparent">
                    <div className="card card-light-danger">
                        <div className="card-body">
                            <p className="mb-4">Chybové produkty</p>
                            <p className="fs-30 mb-2">0</p>
                            <p>{props.faulty_variants} Variant</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Panels;