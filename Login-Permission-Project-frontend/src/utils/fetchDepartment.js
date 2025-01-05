export async function  fetchDepartment ( ) {
    const token = localStorage.getItem('JWT_Token');
    return fetch(`http://localhost:8085/department/test/get`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}