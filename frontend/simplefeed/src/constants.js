const ipAddress = "http://127.0.0.1:8000/api/";

const getJsonHeader = (authTokens) => {
    return {headers:{'Content-Type':'application/json','Authorization':'Bearer ' + String(authTokens.access)}};
}


export {
    ipAddress,
    getJsonHeader,
}