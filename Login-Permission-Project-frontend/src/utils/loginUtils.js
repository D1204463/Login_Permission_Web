export async function login(employee_id,password) {
    return fetch("http://localhost:8085/employee/test/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employee_id: employee_id,
            password: password
        })
    });
}