// File: src/views/product/services/CategoryService.ts (ĐÃ SỬA)

import { Axios } from "@/commons/config/axios";
import type {ICategoryRequestType} from "@/views/product/types/ICategoryType";
import { fetchDataOptions } from "@/services/dataOptionsService"; // Import hàm chung

// Giữ nguyên baseUrl cho các CRUD API (add, update, delete)
const baseUrl = "/danh-muc-giay";

// [ĐÃ SỬA] Hàm cũ không dùng nữa vì ta đã có API /options và /search riêng biệt
// const filter = (payload: { /* ... */ }) => Axios.get(`${baseUrl}/search`, payload);
// const filterCategory = (payload: { /* ... */ }) => Axios.get(`${baseUrl}/loc-danh-muc`, payload);


const addCategory = (payload: ICategoryRequestType) => Axios.post(`${baseUrl}/add`, payload);
const updateCategory = (payload: ICategoryRequestType) => Axios.put(`${baseUrl}/update/${payload.id}`, payload);
const deleteCategory = (id: number) => Axios.del(`${baseUrl}/delete/${id}`);

/**
 * [THAY THẾ] Hàm mới để lấy danh sách Options/Search cho ComboBox Loại Sản Phẩm
 */
const fetchCategoryOptions = (keyword: string = '') => fetchDataOptions('loaisanpham', keyword);


const categoryService = {
    // [THAY THẾ] Chỉ xuất khẩu hàm mới này để dùng trong ComboBox
    fetchCategoryOptions,
    // filter, // Có thể xóa hoặc giữ nếu còn dùng cho bảng khác
    // filterCategory, // Có thể xóa hoặc giữ nếu còn dùng cho bảng khác
    addCategory,
    updateCategory,
    deleteCategory
};
export default categoryService;