// src/views/product/services/ColorService.ts

import type { AxiosResponse } from "axios";
// SỬ DỤNG ĐƯỜNG DẪN ĐƯỢC XÁC NHẬN
import { Axios } from "@/commons/config/axios"; 

// Interface khớp với SimpleColorDto.java
export interface IColorOption {
    id: number;     
    tenMau: string; 
    maHex: string;  
}

// API PATH: Khớp với MauSacController.java
const API_PATH = "/mausac"; 

class ColorService {

    /**
     * Lấy danh sách màu sắc (ID, tenMau, maHex) từ backend
     * GET /api/v1/mausac/options
     */
    public fetchColorOptions(): Promise<IColorOption[]> {
        return Axios.get<IColorOption[]>(`${API_PATH}/options`)
            .then((res: AxiosResponse<IColorOption[]>) => {
                return res.data;
            });
    }
}

export default new ColorService();