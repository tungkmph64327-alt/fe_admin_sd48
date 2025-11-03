// File: src/services/dataOptionsService.ts

import { Axios, type IAxiosRes } from "@/commons/config/axios";

// Định nghĩa kiểu dữ liệu cho Options trả về từ Backend (Brand/Category/...)
interface IBackendOption {
    id: number;
    name: string;
}

// Định nghĩa kiểu dữ liệu cho Options dùng trong Frontend (Ant Design Select)
interface ISelectOption {
    value: number;
    label: string;
}

/**
 * Lấy danh sách OPTIONS hoặc SEARCH cho bất kỳ entity nào (thuonghieu, loaisanpham, chatlieu)
 * @param {string} entityPath - Đường dẫn entity (ví dụ: 'thuonghieu', 'loaisanpham')
 * @param {string} [keyword] - Từ khóa tìm kiếm (nếu có).
 * @returns {Promise<ISelectOption[]>} - Danh sách options đã được ánh xạ (value: id, label: name).
 */
export async function fetchDataOptions(entityPath: string, keyword = ''): Promise<ISelectOption[]> {
    try {
        let url = `/${entityPath}`;
        let params: { keyword?: string } = {};
        
        if (keyword && keyword.trim().length > 0) {
            // API SEARCH mới: ví dụ /thuonghieu/search
            url += `/search`;
            params.keyword = keyword.trim();
        } else {
            // API OPTIONS mới: ví dụ /thuonghieu/options
            url += `/options`;
        }
        
        // Axios.get sẽ tự động thêm params vào URL (ví dụ: ?keyword=...)
        const response: IAxiosRes<IBackendOption[]> = await Axios.get(url, params);
        
        // Ánh xạ (Map) dữ liệu {id, name} sang {value, label}
        return response.data.map((item) => ({
            value: item.id,
            label: item.name,
        }));
        
    } catch (error) {
        console.error(`[API Error] Lỗi khi tải dữ liệu cho ${entityPath}:`, error);
        return []; 
    }
}