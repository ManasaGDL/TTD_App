import axios_instance from "../axios"
const apis = {
login:(payload)=>{
    return axios_instance.post('/auth/token/',payload
       
    )
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
}
}



export default apis