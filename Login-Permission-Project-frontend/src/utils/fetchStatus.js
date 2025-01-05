export async function  fetchStatus ( ) {
    const token = localStorage.getItem('JWT_Token');
    return fetch(`http://localhost:8085/status/test/get`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}