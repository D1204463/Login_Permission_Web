export async function  fetchPosition ( ) {
    const token = localStorage.getItem('JWT_Token');
    return fetch(`http://localhost:8085/Position/get`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}