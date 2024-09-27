import axios from './axios.custom'

const registerCustomerAPI = (username, password, confirm_password, phone, email, dateOfBirth) => {
    const URL_BACKEND = "/api/v1/customer/register";
    const data = {
        username: username,
        password: password,
        confirm_password: confirm_password,
        phone: phone,
        email: email,
        dateOfBirth: dateOfBirth
    }
    return axios.post(URL_BACKEND, data);
}

const loginCustomerAPI = (userName, password) => {
    const URL_BACKEND = "/user/login";
    const data = {
        userName: userName,
        password: password
    }
    return axios.post(URL_BACKEND, data)
}

const getAllUser = () =>{
    const URL_BACKEND = "/user/all";
    return axios.get(URL_BACKEND);
}

const getAllPermission = () => {
    const URL_BACKEND = "/permition/all";
    return axios.get(URL_BACKEND);
};

const getUserPermissions = (id) => {
    const URL_BACKEND = `/user/${id}`;
    return axios.get(URL_BACKEND);
};

const updatePermissions = (userId, payload) => {
    const URL_BACKEND = `/permition/${userId}/permissions`;
    return axios.post(URL_BACKEND, payload);
};

const deletePermissions = (userId, payload) => {
    const URL_BACKEND = `/permition/${userId}/permissions`;
    return axios.put(URL_BACKEND, payload);
};

export {registerCustomerAPI, loginCustomerAPI, getAllPermission, getAllUser, getUserPermissions, updatePermissions, deletePermissions}