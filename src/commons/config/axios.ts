import { getCookie } from "@/commons/utils/Utils";
import axios, { type AxiosInstance } from "axios";

let axiosInstance: AxiosInstance | null = null;
function getInstance(): AxiosInstance {
    if (axiosInstance != null) {
        return axiosInstance
    }
    axiosInstance = axios.create({
        // ĐÃ SỬA: Chuyển CỔNG từ 8082 sang 8080 và thêm /api để khớp với Backend
        baseURL: "http://localhost:8080/api/v1", // <-- Dòng cần chú ý

        // baseURL: "https://shoes.orisu.lol/v1", // Dòng comment gốc
        // baseURL: "http://localhost:8082/v1", // Dòng lỗi gốc
        headers: {
        },
    });

    //hook interceptor cài ở đây
    axiosInstance.interceptors.request.use((config) => {
        const token: string | null = localStorage.getItem('loggedUser');
        if (token)
            config.headers.set("x-api-token", token);
        return config;
    })

    axiosInstance.interceptors.response.use((response: any) => {
        return response;
    },
        async (error: { response: { data: { code: string; }, status: number }; }) => {
            // if (error.response.status === 401) {
            //     localStorage.removeItem('token');
            //     window.location.href = '/signin';
            // }

            // if (error.response.data)
            //     if (error.response.data.code === "code-4") {
            //         window.location.href =
            //             "/login?redirectTo=" + window.location.pathname;
            //     }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
}

function get(endpointApiUrl: string, payload = {}, opts = {}) {
    return getInstance().get(endpointApiUrl, {
        params: payload,
        ...opts
    });
}

function post(endpointApiUrl: string, payload = {}, opts = {}) {
    return getInstance().post(endpointApiUrl, payload, opts);
}

function put(endpointApiUrl: string, payload = {}, opts = {}) {
    return getInstance().put(endpointApiUrl, payload, opts);
}
function patch(endpointApiUrl: string, payload = {}, opts = {}) {
    return getInstance().patch(endpointApiUrl, payload, opts);
}

function del(endpointApiUrl: string, opts = {}) {
    return getInstance().delete(endpointApiUrl, opts);
}

export interface IAxiosRes<T> {
    data: T
};

export interface IAxiosPageRes<T> {
    data: {
        content: T[],
        number: number,
        totalElements: number,
        numberOfElements: number,
        // Dòng này được thêm vào vì bạn đã cung cấp log BE truy vấn DB thành công
        // nhưng có thể thiếu 'totalPages' hoặc 'size' trong response, hãy kiểm tra lại
    }
};

export const Axios = {
    axiosInstance,
    get,
    post,
    put,
    patch,
    del,
};