import axios from "axios"

const axiosApi = axios.create({

    baseURL: "https://devops.onetappost.com/api",

})

axiosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("ai-tk") || "";
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("ai-tk");
            if (["/admin", "/account"].some(path => window.location.pathname.startsWith(path))) {
                window.location.href = `/signin?to=${window.location.pathname}`;
                return;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosApi
