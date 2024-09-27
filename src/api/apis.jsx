import { toast } from "sonner";
import axios_instance from "../axios";

const apis = {
    login: (payload) => {
        return axios_instance
            .post("/auth/token/", payload)
            .catch(() => toast.error("Failed to login!"));
    },
    getScanner: (details) => {
        return axios_instance
            .get(`/api/users/qr-verify/` + details)
            .catch(() => toast.error("Failed to get scanner details!"));
    },
    getRefreshToken: (payload) => {
        return axios_instance
            .post(`/auth/token/refresh/`, payload)
            .catch(() => toast.error("Failed to refresh token!"));
    },
    getProfile: () => {
        return axios_instance
            .get("/api/users/profile/")
            .catch(() => toast.error("Failed to get profile!"));
    },
    getMonthSlotAvailability: (month, year) => {
        return axios_instance
            .get(`/api/users/pilgrimstats/?month=${month}&year=${year}`)
            .catch(() => toast.error("Failed to get slot availability!"));
    },
    addPilgrims: (data) => {
        return axios_instance
            .post(`/api/users/pilgrims/`, data)
            .catch(() => toast.error("Failed to add pilgrims!"));
    },
    getBlockedDates: () => {
        return axios_instance
            .get(`/api/users/blockdates/`)
            .catch(() => toast.error("Failed to get blocked dates!"));
    },
    blockDates: (dates) => {
        return axios_instance
            .post(`api/users/blockdates/`, dates)
            .catch(() => toast.error("Failed to block dates!"));
    },
    unBlockDates: (dates) => {
        return axios_instance
            .patch(`/api/users/blockdates/unblock/`, dates)
            .catch(() => toast.error("Failed to unblock dates!"));
    },
    addNewUser: (data) => {
        return axios_instance
            .post(`/api/users/usersProfile/`, data)
            .catch(() => toast.error("Failed to add new user!"));
    },
    getPilgrimDetails: (date) => {
        return axios_instance
            .get(`/api/users/pilgrims/?booked_datetime=${date}`)
            .catch(() => toast.error("Failed to get pilgrim details!"));
    },
    getAllUsers: () => {
        return axios_instance
            .get(`/api/users/usersProfile/`)
            .catch(() => toast.error("Failed to get all users!"));
    },
    deletePilgrim: (pilgrim_id) => {
        return axios_instance
            .delete(`/api/users/pilgrims/${pilgrim_id}/`)
            .catch(() => toast.error("Failed to delete pilgrim!"));
    },
    updatePilgrims: (pilgrims) => {
        return axios_instance
            .patch(`/api/users/pilgrims/pilgrim_update/`, pilgrims)
            .catch(() => toast.error("Failed to update pilgrims!"));
    },
    updateUser: (id, data) => {
        return axios_instance
            .patch(`/api/users/usersProfile/${id}/`, data)
            .catch(() => toast.error("Failed to update user!"));
    },
    deleteUser: (id) => {
        return axios_instance
            .delete(`/api/users/usersProfile/${id}/`)
            .catch(() => toast.error("Failed to delete user!"));
    },
    downloadLetter: (payload) => {
        return axios_instance
            .post(`/api/users/vip-darshan-letter/`, payload, {
                responseType: "blob",
            })
            .catch(() => {toast.error("Internal Server Error")});
    },
    resetPassword: (payload, id) => {
        return axios_instance
            .post(`/api/users/usersProfile/${id}/reset_password/`, payload)
            .catch(() => toast.error("Failed to reset password!"));
    },
};

export default apis;
