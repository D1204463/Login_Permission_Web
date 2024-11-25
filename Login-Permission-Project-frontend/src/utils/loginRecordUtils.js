export async function getLoginRecord(token){
    return  fetch(`http://localhost:8085/api/loginRecord/getLoginRecord`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
}