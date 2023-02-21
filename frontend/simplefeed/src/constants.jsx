const ipAddress = "http://127.0.0.1:8000/api/";

const getJsonHeader = (authTokens) => {
    return {headers:{'Content-Type':'application/json','Authorization':'Bearer ' + String(authTokens.access)}};
}

function dataCheck(data, formData, place){
    if(data === '' || data === undefined)
        return false;
    formData.append(place, data);
    return true;
}

const WarningStyle = {
    color: 'red',
}

export {
    ipAddress,
    getJsonHeader,
    dataCheck,
    WarningStyle
}