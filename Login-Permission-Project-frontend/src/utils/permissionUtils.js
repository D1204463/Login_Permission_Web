export async function getPermissions(token, userId) {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const response = await fetch(`http://localhost:8085/Permission/test/getById/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch permissions');
    }
    
    return response.json();
}