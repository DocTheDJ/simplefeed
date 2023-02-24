import React from 'react';

function Descriptions(props){
    return (
        <div className="row">
            <div className="col-lg-4">
                <div className="card" >
                    <div className="card-body">
                        <h3>Krátký popis</h3>
                        <br/>
                        <p className="lead">
                            {props.data.short_description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card">
                    <div className="card-body">
                        <h3>Dlouhý popis</h3>
                        <br/>
                        {props.data.description}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Descriptions;