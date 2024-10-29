import { toast } from "sonner";
import axios_instance from "../axios";

const apis = {
    login: async(payload) => {
        return axios_instance
            .post("/auth/token/", payload)
            .catch(() => toast.error("Failed to login!"));
    },
    getScanner: async(details) => {
        return axios_instance
            .get(`/api/users/qr-verify/` + details)
            .catch(() => toast.error("Failed to get scanner details!"));
    },
    getRefreshToken: async(payload) => {
        return axios_instance
            .post(`/auth/token/refresh/`, payload)
            .catch(() => toast.error("Failed to refresh token!"));
    },
    getProfile: async() => {
        return axios_instance
            .get("/api/users/profile/")
            .catch(() => toast.error("Failed to get profile!"));
    },
    getMonthSlotAvailability: async(month, year) => {
        return axios_instance
            .get(`/api/users/pilgrimstats/?month=${month}&year=${year}`)
            .catch(() => toast.error("Failed to get slot availability!"));
    },
    addPilgrims: async(data) => {
        return axios_instance
            .post(`/api/users/pilgrims/`, data)
            .catch(() => toast.error("Failed to add pilgrims!"));
    },
    getBlockedDates: async() => {
        return axios_instance
            .get(`/api/users/blockdates/`)
            .catch(() => toast.error("Failed to get blocked dates!"));
    },
    blockDates: async(dates) => {
        return axios_instance
            .post(`api/users/blockdates/`, dates)
            .catch(() => toast.error("Failed to block dates!"));
    },
    unBlockDates: async(dates) => {
        return axios_instance
            .patch(`/api/users/blockdates/unblock/`, dates)
            .catch(() => toast.error("Failed to unblock dates!"));
    },
    addNewUser: async(data) => {
        return axios_instance
            .post(`/api/users/usersProfile/`, data)
            .catch(() => toast.error("Failed to add new user!"));
    },
    getPilgrimDetails: async(date) => {
        return axios_instance
            .get(`/api/users/pilgrims/?booked_datetime=${date}`)
            .catch(() => toast.error("Failed to get pilgrim details!"));
    },
    getAllUsers: async() => {
        return axios_instance
            .get(`/api/users/usersProfile/`)
            .catch(() => toast.error("Failed to get all users!"));
    },
    deletePilgrim: async(pilgrim_id) => {
        return axios_instance
            .delete(`/api/users/pilgrims/${pilgrim_id}/`)
            .catch(() => toast.error("Failed to delete pilgrim!"));
    },
    updatePilgrims: async(pilgrims) => {
        return axios_instance
            .patch(`/api/users/pilgrims/pilgrim_update/`, pilgrims)
            .catch(() => toast.error("Failed to update pilgrims!"));
    },
    updateUser: async(id, data) => {
        return axios_instance
            .patch(`/api/users/usersProfile/${id}/`, data)
            .catch(() => toast.error("Failed to update user!"));
    },
    deleteUser: async(id) => {
        return axios_instance
            .delete(`/api/users/usersProfile/${id}/`)
            .catch(() => toast.error("Failed to delete user!"));
    },
    downloadLetter: async(payload) => {
        return axios_instance
            .post(`/api/users/vip-darshan-letter/`, payload, {
                responseType: "blob",
            })
            .catch(() => {toast.error("Internal Server Error")});
    },
    resetPassword: async(payload, id) => {
        return axios_instance
            .post(`/api/users/usersProfile/${id}/reset_password/`, payload)
            .catch(() => toast.error("Failed to reset password!"));
    },
    getUserHistory:async(p)=>{

        return axios_instance
            .get(`/api/users/userstats/?page=${p}`)
            .catch(() => toast.error("Failed to fetch user history"));

    },
    getPilgrimsForAdmin: async(month,year,id)=>{

        return axios_instance
            .get(`/api/users/userstats/pilgrims/?month=${month}&year=${year}&user_id=${id}`)
            .catch(() => toast.error("Failed to fetch pilgrims!"));
    },
    getPilgrimsForUser: async(month,year)=>{
        
        return axios_instance
            .get(`api/users/userstats/pilgrims/?month=${month}&year=${year}`)
            .catch(() => toast.error("Failed to fetch pilgrims!"));
    }
};

export default apis;
