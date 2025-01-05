export async function  fetchUnits ( ) {
    const token = localStorage.getItem('JWT_Token');
    return fetch(`http://localhost:8085/unit/test/get`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}