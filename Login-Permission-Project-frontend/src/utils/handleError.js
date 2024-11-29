export async function handleError(response) {
    let errorMessage;
    try {
        const errorData = await response.json();
        errorMessage = errorData.message;
    } catch (e) {
        errorMessage = await response.text();
    }
    return errorMessage;

}