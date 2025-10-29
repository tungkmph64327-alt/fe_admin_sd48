import { Axios } from "@/commons/config/axios";
import type { EProductVariation, IProductTypeReq, IProductVariationReqType, IProductFilterReq } from "../types/IProductType";

// Thay đổi baseUrl để gọi trực tiếp /api/v1/sanpham (như trong BE)
const baseUrl = "/san-pham"; // Giả định axios đã cấu hình baseURL là /api/v1

// [MỚI] Thêm hàm getAll để gọi API cơ bản không phân trang
// API này gọi GET /api/v1/sanpham
const getAll = () => Axios.get(`/sanpham`); // SỬA: Bỏ baseUrl vì BE dùng /api/v1/sanpham

const addStep1 = (payload: IProductTypeReq) => Axios.post(`${baseUrl}/save-step1`, payload);
const saveStep2 = (payload: IProductVariationReqType) => Axios.post(`${baseUrl}/save-step2`, payload);
const xoaSP = (id: number) => Axios.del(`${baseUrl}/delete/${id}`);
const thayDoiPhanLoaiSanPham = (id: number, type: EProductVariation) => Axios.patch(`${baseUrl}/thay-doi-phan-loai/${id}?type=${type}`);
const xoaPhanLoai = (id: number) => Axios.del(`${baseUrl}/phan-loai/${id}`);
const luuSoLuongChoPhanLoaiSp = (id: number, soLuong: number) => Axios.patch(`${baseUrl}/phan-loai/${id}/so-luong?soLuong=${soLuong}`);


const getChiTiet = (id: number) => Axios.get(`${baseUrl}/${id}`);
const getAllBienTheGiaTri = (id: number) => Axios.get(`${baseUrl}/public/get-all-gia-tri-bien-the/${id}`);
const getAllPhanLoaiTheoSanPham = (id: number) => Axios.get(`${baseUrl}/${id}/phan-loai`);
const getAllReviewTheoSanPham = (id: number) => Axios.get(`${baseUrl}/${id}/phan-loai`);
const locSP = (payload: IProductFilterReq, page: number = 0, size: number = 10, sort: string = "id,desc") => Axios.post(`${baseUrl}/filter?page=${page}&size=${size}&sort=${sort}`, payload);

const productService = {
    // [MỚI] Thêm hàm getAll vào đối tượng export
    getAll,

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