// File: src/views/product/services/BrandService.ts (ĐÃ SỬA)

import { Axios } from "@/commons/config/axios";
import type {IBrandRequestType} from "@/views/product/types/IBrandType";
import { fetchDataOptions } from "@/services/dataOptionsService"; // Import hàm chung

// Giữ nguyên baseUrl cho các CRUD API (add, update, delete)
const baseUrl = "/thuong-hieu";

// [ĐÃ SỬA] Hàm cũ không dùng nữa vì ta đã có API /options và /search riêng biệt
// const filter = (payload: { /* ... */ }) => Axios.get(`${baseUrl}/search`, payload);
// const filterBrand = (payload: { /* ... */ }) => Axios.get(`${baseUrl}/loc-thuong-hieu`, payload);

const addBrand = (payload: IBrandRequestType) => Axios.post(`${baseUrl}/add`, payload);
const updateBrand = (payload: IBrandRequestType) => Axios.put(`${baseUrl}/update/${payload.id}`, payload);
const deleteBrand = (id: number) => Axios.del(`${baseUrl}/delete/${id}`);

/**
 * [THAY THẾ] Hàm mới để lấy danh sách Options/Search cho ComboBox Thương Hiệu
 */
const fetchBrandOptions = (keyword: string = '') => fetchDataOptions('thuonghieu', keyword);


const brandService = {
    // [THAY THẾ] Chỉ xuất khẩu hàm mới này để dùng trong ComboBox
    fetchBrandOptions,
    // filter, // Có thể xóa hoặc giữ nếu còn dùng cho bảng khác
    // filterBrand, // Có thể xóa hoặc giữ nếu còn dùng cho bảng khác
    addBrand,
    updateBrand,
    deleteBrand
};
export default brandService;