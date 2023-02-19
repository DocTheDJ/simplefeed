import React from 'react';

function FeedList(props){
    return (
        <div className="col-md-12 grid-margin stretch-card">
            <div className="card position-relative">
                <div className="card-body">
                    <div id="detailedReports" className="carousel slide detailed-report-carousel position-static pt-2" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {
                                props.suppliers?.map((supplier, key) => {
                                    return (<Feed data={supplier} key={key} first={key === 0}></Feed>)
                                })
                            }
                        </div>
                        <a className="carousel-control-prev" href="#detailedReports" role="button" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        </a>
                        <a className="carousel-control-next" href="#detailedReports" role="button" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        </a>
                        </div>
                    </div>
                </div>
          </div>
    );
}

function Feed(props){
    let bigClass = "carousel-item"
    if(props.first){
        bigClass += " active";
    }
    const active_percentage = props.data.active_count / props.data.total_count
    const inactive_percentage = props.data.inactive_count / props.data.total_count

    return (
        <div className={bigClass}>
            <div className="row">
                <div className="col-md-12 col-xl-3 d-flex flex-column justify-content-start">
                    <div className="ml-xl-4 mt-3">
                        <p className="card-title">Statistiky dodavatele</p>
                        <h2 className="font-weight-500 mb-xl-4 text-primary "> {props.data.name}</h2>
                        <hr/>
                        <p>
                            <strong>Poslední aktualizace:</strong> {props.data.updated_on}
                        </p>
                        <p>
                            <strong>Následující aktualizace:</strong> unknown
                        </p>
                        <button className="btn btn-primary mt-3">Zobrazit detail</button>
                    </div>  
                </div>
                <div className="col-md-12 col-xl-9">
                    <div className="row">
                        <div className="col-md-6 border-right">
                            <div className="table-responsive mb-3 mb-md-0 mt-3">
                                <table className="table table-borderless report-table">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted">Počet produktů</td>
                                            <td className="w-100 px-0">
                                                <div className="progress progress-md mx-4">
                                                    <div className="progress-bar bg-primary" role="progressbar" style={{width: '100%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="font-weight-bold mb-0">
                                                    {props.data.total_count}
                                                </h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Aktivní produkty</td>
                                            <td className="w-100 px-0">
                                                <div className="progress progress-md mx-4">
                                                    <div className="progress-bar bg-warning" role="progressbar" style={{width: active_percentage+'%'}} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="font-weight-bold mb-0">
                                                    {props.data.active_count}
                                                </h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Zamítnuté produkty</td>
                                            <td className="w-100 px-0">
                                                <div className="progress progress-md mx-4">
                                                    <div className="progress-bar bg-danger" role="progressbar" style={{width: inactive_percentage+'%'}} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="font-weight-bold mb-0">
                                                    {props.data.inactive_count}
                                                </h5>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="chartjs-size-monitor">
                                <div className="chartjs-size-monitor-expand">
                                    <div className="">
                                    </div>
                                </div>
                                <div className="chartjs-size-monitor-shrink">
                                    <div className="">
                                    </div>
                                </div>
                            </div>
                            <canvas id="north-america-chart" style={{display: 'block', width: '570px', height: '285px'}} className="chartjs-render-monitor" width="570" height="285"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedList;