// src/views/product/services/ProductService.ts

import { Axios } from "@/commons/config/axios";
// SỬA: Import ISimpleProductOption từ file types của bạn
import type { EProductVariation, IProductTypeReq, IProductVariationReqType, IProductFilterReq, ISimpleProductOption } from "../types/IProductType";

// Giả định axios đã cấu hình baseURL là /api/v1
// và BE Controller dùng @RequestMapping("/api/v1/sanpham")
const baseUrl = "/sanpham"; 

// --- CÁC HÀM HIỆN TẠI ---

const getAll = () => Axios.get(baseUrl); 

const addStep1 = (payload: IProductTypeReq) => Axios.post(`${baseUrl}/save-step1`, payload);
const saveStep2 = (payload: IProductVariationReqType) => Axios.post(`${baseUrl}/save-step2`, payload);
const xoaSP = (id: number) => Axios.del(`${baseUrl}/delete/${id}`);
const thayDoiPhanLoaiSanPham = (id: number, type: EProductVariation) => Axios.patch(`${baseUrl}/thay-doi-phan-loai/${id}?type=${type}`);
const xoaPhanLoai = (id: number) => Axios.del(`${baseUrl}/phan-loai/${id}`);
const luuSoLuongChoPhanLoaiSp = (id: number, soLuong: number) => Axios.patch(`${baseUrl}/phan-loai/${id}/so-luong?soLuong=${soLuong}`);

// --- HÀM MỚI CHO COMBOBOX VÀ TÌM KIẾM ---

/**
 * Gọi API GET /api/v1/sanpham/options 
 * Trả về danh sách ID và Tên sản phẩm cho Dropdown (thường là list đầy đủ)
 */
const fetchProductOptions = (): Promise<ISimpleProductOption[]> => {
    return Axios.get<ISimpleProductOption[]>(`${baseUrl}/options`).then(res => res.data);
};

/**
 * [HÀM MỚI] Gọi API GET /api/v1/sanpham/search?keyword=...
 * Trả về danh sách sản phẩm được lọc theo tên/từ khóa
 */
const searchProductOptions = (keyword: string): Promise<ISimpleProductOption[]> => {
    // Gọi trực tiếp URL, tránh lỗi params[keyword]
    return Axios.get<ISimpleProductOption[]>(
        `${baseUrl}/search?keyword=${encodeURIComponent(keyword)}`
    ).then(res => res.data);
};



// --- CÁC HÀM KHÁC ---
const getChiTiet = (id: number) => Axios.get(`${baseUrl}/${id}`);
const getAllBienTheGiaTri = (id: number) => Axios.get(`${baseUrl}/public/get-all-gia-tri-bien-the/${id}`);
const getAllPhanLoaiTheoSanPham = (id: number) => Axios.get(`${baseUrl}/${id}/phan-loai`);
const getAllReviewTheoSanPham = (id: number) => Axios.get(`${baseUrl}/${id}/phan-loai`);
const locSP = (payload: IProductFilterReq, page: number = 0, size: number = 10, sort: string = "id,desc") => Axios.post(`${baseUrl}/filter?page=${page}&size=${size}&sort=${sort}`, payload);


const productService = {
    getAll,
    // [QUAN TRỌNG] Thêm hàm mới vào đối tượng export
    fetchProductOptions, 
    searchProductOptions, // <-- HÀM TÌM KIẾM MỚI

    addStep1,
    saveStep2,
    xoaSP,
    xoaPhanLoai,
    luuSoLuongChoPhanLoaiSp,

    getChiTiet,
    getAllBienTheGiaTri,
    thayDoiPhanLoaiSanPham,
    getAllPhanLoaiTheoSanPham,
    getAllReviewTheoSanPham,
    locSP,

    
};

export default productService;