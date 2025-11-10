// src/views/product/services/SizeService.ts

import type { AxiosResponse } from "axios";
// SỬ DỤNG ĐƯỜNG DẪN ĐƯỢC XÁC NHẬN
import { Axios } from "@/commons/config/axios"; 

// INTERFACE: Khớp với KichThuoc.java
export interface ISizeOption {
    id: number; 
    maKichThuoc: string;
    tenKichThuoc: string; 
    trangThai: string;
}

// API PATH: Khớp với KichThuocController.java
const API_PATH = "/kichco"; 

class SizeService {

    /**
     * Lấy danh sách kích cỡ từ backend
     * GET /api/v1/kichco/options
     */
    public fetchSizeOptions(): Promise<ISizeOption[]> {
        return Axios.get<ISizeOption[]>(`${API_PATH}/options`)
            .then((res: AxiosResponse<ISizeOption[]>) => {
                return res.data;
            });
    }
}

export default new SizeService();