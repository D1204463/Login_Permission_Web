export async function getEmployeeIdInfo(token, userId) {
    if(!userId) {
        throw new Error('User ID is required for getting Employee Information');
    }

    const response = await fetch(`http://localhost:8085/employee/test/getEmployeeById/${userId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw new Error('Failed to get Employee Information');
    }

    return response.json();
}