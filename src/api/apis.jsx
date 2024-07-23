import axios_instance from "../axios"
const apis = {
login:(payload)=>{
    return axios_instance.post('/auth/token/',payload
       
    )
},
getRefreshToken:(payload)=>{
    return axios_instance.post(`/auth/token/refresh/`,payload)
},
getProfile:()=>{
   
    return axios_instance.get('/api/users/profile/')
},
getMonthSlotAvailability:(month,year)=>{
    return axios_instance.get(`/api/users/pilgrimstats/?month=${month}&year=${year}`)
},
addPilgrims:(data)=>{
    return axios_instance.post(`/api/users/pilgrims/`,data)
},
getBlockedDates:()=>{
    return axios_instance.get(`/api/users/blockdates/`)
},
blockDates:(dates)=>{
    return axios_instance.post(`api/users/blockdates/`,dates)

},
unBlockDates:(dates)=>{
    return axios_instance.patch(`/api/users/blockdates/unblock/`,dates)
},
addNewUser:(data)=>{
    return axios_instance.post(`/api/users/usersProfile/`,data)
},
getPilgrimDetails:(date)=>{
    return axios_instance.get(`/api/users/pilgrims/?booked_datetime=${date}`)
},
getAllUsers:()=>{
    return axios_instance.get(`/api/users/usersProfile/`)
},
deletePilgrim:(pilgrim_id)=>{
    return axios_instance.delete(`/api/users/pilgrims/${pilgrim_id}/`)
},
updatePilgrims:(pilgrims)=>{
  return axios_instance.patch(`/api/users/pilgrims/pilgrim_update/`,pilgrims)
},
updateUser:(id,data)=>{
    return axios_instance.patch(`/api/users/usersProfile/${id}/`,data)
},
deleteUser:(id)=>{
    return axios_instance.delete(`/api/users/usersProfile/${id}/`)
},
downloadLetter:(payload)=>{

    return axios_instance.post(`/api/users/vip-darshan-letter/`,payload, {
        responseType: 'blob', // Specify responseType as 'blob'
    })
}
}



export default apis