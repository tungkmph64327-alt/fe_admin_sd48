// File: src/views/product/services/MaterialService.ts

import { fetchDataOptions } from "@/services/dataOptionsService"; 
// Axios và các hàm CRUD khác (add, update, delete) có thể được thêm vào sau

const MaterialService = {
    /**
     * Lấy danh sách Options/Search cho ComboBox Chất liệu
     * Sử dụng entityPath là 'chatlieu'
     */
    fetchMaterialOptions(keyword: string = '') {
        return fetchDataOptions('chatlieu', keyword);
    },
    // ... (Thêm các hàm CRUD khác nếu cần)
};

export default MaterialService;