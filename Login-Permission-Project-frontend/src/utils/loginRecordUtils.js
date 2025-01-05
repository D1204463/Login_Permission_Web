export async function getLoginRecord(token, employeeId) {
    return fetch(`http://localhost:8085/api/loginRecord/getLoginRecord/${employeeId}`, {
        method: "GET",  
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}