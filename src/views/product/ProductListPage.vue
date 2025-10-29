<template>
  <a-page-header class="rounded-[5px]"
    style="border: 1px solid rgb(235, 237, 240); margin: 20px;; height: 100%; background: white;">
    <template #title>
      <h3 class="text-2xl">Quản lý sản phẩm</h3>
    </template>

    <template #tags>
      <router-link to="/danh-sach-san-pham/them-moi">
        <a-button> Thêm mới </a-button>
      </router-link>
    </template>

    <div class="mb-[30px] w-full bg-white rounded p-[20px] grid justify-center">
      <a-space class="w-fit mx-auto" align="baseline">
        <a-space direction="vertical" class="w-1/2">
          <a-space class="w-full">
            <span class="w-[130px] block font-[600]">Danh mục: </span>
            <a-select v-model:value="filterModel.dmGiay" placeholder="Chọn danh mục" class="min-w-[300px]"
              :options="categoryOpts">
            </a-select>
          </a-space>

          <a-space>
            <span class="w-[130px] block font-[600]">Thương hiệu: </span>
            <a-select v-model:value="filterModel.thuongHieu" placeholder="Chọn thương hiệu" class="min-w-[300px]"
              :options="brandOpts">
            </a-select>
          </a-space>

          <a-space>
            <span class="w-[130px] block font-[600]">Tìm kiếm: </span>
            <a-input v-model:value="filterModel.q" placeholder="Từ khóa..." class="min-w-[150px]">
            </a-input>

            <a-select class="w-[140px]" v-model:value="filterModel.searchKey">
              <a-select-option value="ten">Tên sản phẩm</a-select-option>
              <a-select-option value="maSP">Mã sản phẩm</a-select-option>
            </a-select>
          </a-space>
        </a-space>

        <a-space direction="vertical" class="w-1/2">
          <a-space>
            <span class="w-[130px] block font-[600]">Trạng thái hiển thị:
            </span>
            <a-select v-model:value="filterModel.hienThiWeb" placeholder="Chọn trạng thái hiển thị"
              class="min-w-[300px]">
              <a-select-option :value="'true'">Hiển thị trên web</a-select-option>
              <a-select-option :value="'false'">Ẩn</a-select-option>
            </a-select>
          </a-space>

          <a-space>
            <span class="w-[130px] block font-[600]">Thời gian tạo: </span>
            <a-range-picker v-model:value="filterModel.createdAtRange" class="w-[300px]" />
          </a-space>

          <a-space>
            <span class="w-[130px] block font-[600]">Tình trạng kho: </span>
            <a-select v-model:value="filterModel.tinhTrangKho" placeholder="Chọn trạng thái hiển thị"
              class="min-w-[300px]">
              <a-select-option :value="'AVAIL'">Còn</a-select-option>
              <a-select-option value="EMPTY">Tạm hết</a-select-option>
            </a-select>
          </a-space>
        </a-space>
      </a-space>

      <a-space align="center" class="w-full justify-center mt-[20px]">
        <a-button type="primary" @click="resetFilter">Làm mới</a-button>
        <a-button type="primary" @click="onCallApi">Lọc</a-button>
      </a-space>
    </div>

    <a-table bordered :columns="tblConfig.columns" :dataSource="tblConfig.data" :pagination="tblConfig.pagination"
      :loading="tblConfig.loading" @change="tblConfig.onPageChange" :scroll="{ x: 1300 }">

      <template #bodyCell="{ column, text, record }">

        <template v-if="column.dataIndex === 'anhChinh'">
          <img :src="text?.url" class="h-[110px] w-[103px] mx-auto" /> 
        </template>

        <template v-else-if="column.dataIndex === 'price'">
          <span class="text-red-500">
            {{ _formatVnCurrency(record.giaMoi) }}
          </span>
          <br />
          <span v-if="record.giaCu && record.giaCu > 0">
            <del>{{ _formatVnCurrency(record.giaCu) }}</del>
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'nguoiTao'">
          {{ text?.name }}
        </template>

        <template v-else-if="column.dataIndex === 'tongSp'">
          <span v-if="Number(text || 0) == 0"> Tạm hết </span>
          <span v-else> {{ text }} sản phẩm </span>
        </template>

        <template v-else-if="column.dataIndex === 'loaiSanPham'">
          {{ text?.tenLoaiSanPham }}
        </template>

        <template v-else-if="column.dataIndex === 'thuongHieu'">
          {{ text?.tenThuongHieu }}
        </template>

        <template v-else-if="column.dataIndex === 'ngayTao'">
          {{ dayjs(text).format("HH:MM:ss DD/MM/YYYY") }}
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <div class="flex gap-[10px] items-center justify-center">
            <router-link :to="`/danh-sach-san-pham/sua/${record.id}`">
              <a-tooltip>
                <template #title> Sửa sản phẩm </template>
                <edit-outlined />
              </a-tooltip>
            </router-link>

            <a-popconfirm title="Bạn chắc chắn?" @confirm="onClickDelelteProduct(record.id)">
              <a-tooltip>
                <template #title> Xóa sản phẩm </template>
                <delete-outlined class="text-red-500" />
              </a-tooltip>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>
  </a-page-header>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { onMounted, reactive, ref, inject } from "vue";
import dayjs, { Dayjs } from "dayjs";
// Đảm bảo ProductService đã có hàm getAll()
import ProductService from "./services/ProductService"; 
import { notification, type PaginationProps } from "ant-design-vue";
// Giả định các types đã được định nghĩa
import type { IProductFilterReq, IProductTypeRes } from "./types/IProductType"; 
import type { AxiosResponse } from "axios";
// Sửa import IAxiosRes
import type { IAxiosRes } from "@/commons/config/axios"; 
// Khai báo import CategoryService/BrandService mặc dù đã được comment
import CategoryService from "./services/CategoryService"; 
import BrandService from "./services/BrandService";
import type ICategoryType from "./types/ICategoryType";
import type IBrandType from "./types/IBrandType";

const _formatVnCurrency = inject("formatVnCurrency", (p: number) => 0);

const tblConfig = reactive<{
  columns: any[];
  loading: boolean;
  data: IProductTypeRes[];
  pagination: PaginationProps;
  onPageChange: Function;
}>({
  columns: [
    { title: "STT", dataIndex: "stt", key: "stt", align: "center", width: '70px' },
    { title: "Ảnh", dataIndex: "anhChinh", key: "anhChinh", align: "center" },
    { title: "Tên sản phẩm", dataIndex: "ten", key: "ten", align: "center" },
    { title: "Giá", dataIndex: "price", key: "price", align: "center" },
    { title: "Số lượng trong kho", dataIndex: "tongSp", key: "tongSp", align: "center" },
    { title: "Danh mục", dataIndex: "loaiSanPham", key: "loaiSanPham", align: "center" },
    { title: "Thương hiệu", dataIndex: "thuongHieu", key: "thuongHieu", align: "center" },
    { title: "Ngày tạo", dataIndex: "ngayTao", key: "ngayTao", align: "center" },
    { title: "Người tạo", dataIndex: "nguoiTao", key: "nguoiTao", align: "center" },
    { title: "Hành động", dataIndex: "action", key: "action", width: 100, fixed: "right", align: "center" },
  ],
  data: [],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  onPageChange: (pagination: { current: number }) => {
    tblConfig.pagination.current = pagination.current;
    onCallApi(); 
  },
});

const onClickDelelteProduct = (id: number) => {
  if (tblConfig.loading) return;
  tblConfig.loading = true;
  ProductService.xoaSP(id)
    .then(() => {
      notification.success({
        message: "Xoá thành công!"
      });
      tblConfig.data = tblConfig.data.filter(i => i.id != id).map((i, index) => ({ ...i, stt: index + 1 }));
    })
    .catch(() => {
      notification.error({
        message: "Xoá thất bại!"
      });
    })
    .finally(() => tblConfig.loading = false)
}

// HÀM onCallApi: GỌI API GET /api/v1/sanpham
const onCallApi = () => {
  if (tblConfig.loading) return;
  tblConfig.loading = true;
  
  ProductService.getAll()
    .then((res: AxiosResponse<IProductTypeRes[]>) => { 
      // res.data là mảng sản phẩm
      const rawData = res.data; 
      
      // Khắc phục lỗi nếu mảng rỗng
      if (rawData.length === 0) {
          notification.warn({
              message: "Không tìm thấy dữ liệu sản phẩm.",
          });
      }

      tblConfig.data = rawData.map(
        (item: IProductTypeRes, index: number) => ({
          ...item,
          stt: index + 1,
        })
      );
      
      tblConfig.pagination.total = rawData.length;
      tblConfig.pagination.current = 1; 
      
      console.log("product. list data (raw): ", rawData);
    })
    .catch((err) => {
      console.error("Lỗi khi tải dữ liệu sản phẩm: ", err);
      // Hiển thị thông báo "Lấy dữ liệu thất bại!" như trong hình
      notification.error({
        message: "Lấy dữ liệu thất bại!",
      });
    })
    .finally(() => (tblConfig.loading = false));
};

const brandOpts = ref();
const categoryOpts = ref();
const filterModel = reactive<{
  ten?: string; 
  maSp?: string;
  dmGiay?: number;
  thuongHieu?: number;
  hienThiWeb?: string;
  tinhTrangKho?: "AVAIL" | "EMPTY";
  createdAtRange?: any[];
  q?: string;
  searchKey?: string;
}>({
  searchKey: "ten", 
});

const resetFilter = () => {
  filterModel.ten = undefined;
  filterModel.maSp = undefined;
  filterModel.dmGiay = undefined;
  filterModel.thuongHieu = undefined;
  filterModel.hienThiWeb = undefined;
  filterModel.createdAtRange = undefined;
  filterModel.q = undefined;
  filterModel.searchKey = "ten";
  tblConfig.pagination.current = 1; 
  onCallApi();
};

onMounted(() => {
  // GỌI API SẢN PHẨM (Mục tiêu chính)
  onCallApi();

  // KHỐI GỌI CATEGORY VÀ BRAND ĐÃ BỊ COMMENT ĐỂ KHẮC PHỤC LỖI UNHANDLED ERROR 
  /* CategoryService.filter(...) */
  /* BrandService.filterBrand(...) */
});
</script>

<style scoped>
/* Bạn có thể thêm style tại đây nếu cần */
</style>