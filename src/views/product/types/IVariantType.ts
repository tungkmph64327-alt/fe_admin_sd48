// File: src/views/product/types/IVariantType.ts

// Dựa trên phản hồi JSON 200 OK từ API /kichco/options
export interface KichCo {
    id: number;
    maKichThuoc: string; 
    tenKichThuoc: string; // Tên hiển thị (ví dụ: "Kích cỡ 36")
    trangThai: string;
}

// Dựa trên phản hồi JSON 200 OK từ API /mausac/options
export interface MauSac {
    id: number;
    maMau: string;    // Mã màu (ví dụ: "M001")
    tenMau: string;   // Tên màu (ví dụ: "Trắng")
    moTa: string;     // Mã HEX (ví dụ: "#FFFFFF"). Dùng cho màu nền.
}