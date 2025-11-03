<template>
  <div class="p-4 sm:p-6 md:p-8">
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      layout="vertical"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >

      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <a-row :gutter="32">
          
          <a-col :span="8">
            <div 
              class="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden"
              style="min-height: 250px; border: 1px solid #e0e0e0;"
              @click="onChooseMainImage"
            >
              <div v-if="productImages.mainImage" class="absolute inset-0 w-full h-full">
                <img :src="productImages.mainImage.url" class="w-full h-full object-cover" alt="Main Product Image"/>
                <delete-outlined
                  @click.stop="removeMainImg"
                  class="absolute top-2 right-2 cursor-pointer text-red-500 bg-white/75 rounded-full p-1 text-base hover:scale-110 transition-transform"
                />
              </div>
              
              <div v-else class="text-gray-400 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-2-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-4 font-semibold text-gray-700">Thêm hình ảnh sản phẩm</p>
                <p class="text-sm text-gray-500">phải là 1080x1080 px</p>
              </div>
            </div>
          </a-col>

          <a-col :span="16">

<a-form-item
    label="Sản phẩm"
    name="productId" 
    :rules="[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]"
    class="!mb-4"
>
    <a-row :gutter="8"> 
        <a-col :span="22">
            <a-select
                v-model:value="formState.productId" 
                show-search
                placeholder="Tìm kiếm và chọn sản phẩm"
                :filter-option="false" 
                :not-found-content="fetching ? 'Đang tải...' : 'Không tìm thấy sản phẩm'" 
                style="width: 100%" 
                @search="handleSearch"
                @change="handleProductSelect"
            >
                <a-select-option 
                    v-for="product in productOptions" 
                    :key="product.id" 
                    :value="product.id"
                >
                    {{ product.name }}
                </a-select-option>
            </a-select>
        </a-col>
        
        <a-col :span="2">
            <a-button 
                shape="square" 
                class="variant-add-btn" 
                @click="onAddProduct"
            >
                <plus-outlined />
            </a-button>
        </a-col>
    </a-row>
</a-form-item>

            <a-form-item
              label="Mô tả"
              name="desc"
              :rules="[{ required: true, message: 'Vui lòng không bỏ trống!' }]"
              class="!mb-4"
            >
              <a-textarea 
                v-model:value="formState.desc" 
                :rows="6" 
                placeholder="..."
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      
      <!-- <a-divider style="margin-top: 0; margin-bottom: 24px;">
        <span class="text-lg font-bold"></span>
      </a-divider> -->

<div class="bg-white p-6 rounded-lg shadow-md mb-8">
  <a-row :gutter="32">
    <a-col :span="12">
      <a-form-item label="Thương hiệu" name="brand" class="!mb-4" :rules="[{ required: true, message: 'Vui lòng chọn!' }]">
        <a-row :gutter="8">
          <a-col :span="22">
           <a-select
    v-model:value="formState.brand"
    placeholder="Tìm kiếm tên thương hiệu"
    show-search
    :options="brandOptions"
    class="custom-select-with-button"
    :loading="fetchingBrand" :not-found-content="fetchingBrand ? 'Đang tải...' : 'Không tìm thấy thương hiệu'" :filter-option="false" @search="(val) => handleOptionSearch('brand', val)" @dropdownVisibleChange="(open) => { if(open && brandOptions.length === 0) handleOptionSearch('brand', '', 0) }"
/>
          </a-col>
          <a-col :span="2">
            <a-button 
              shape="square" 
              class="variant-add-btn" 
              @click="onAddBrand"
            >
              <plus-outlined />
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item label="loại" name="category" class="!mb-4" :rules="[{ required: true, message: 'Vui lòng chọn!' }]">
        <a-row :gutter="8">
          <a-col :span="22">
           <a-select
    v-model:value="formState.category"
    placeholder="Tìm kiếm loại"
    show-search
    :options="categoryOptions"
    class="custom-select-with-button"
    :loading="fetchingCategory" :not-found-content="fetchingCategory ? 'Đang tải...' : 'Không tìm thấy loại sản phẩm'" :filter-option="false" @search="(val) => handleOptionSearch('category', val)" @dropdownVisibleChange="(open) => { if(open && categoryOptions.length === 0) handleOptionSearch('category', '', 0) }"
/>
          </a-col>
          <a-col :span="2">
            <a-button 
              shape="square" 
              class="variant-add-btn" 
              @click="onAddCategory"
            >
              <plus-outlined />
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-col>

    <a-col :span="12">
  <a-form-item label="Chất liệu" name="chatLieu" class="!mb-4">
    <a-row :gutter="8">
      <a-col :span="22">
        <a-select
          v-model:value="formState.chatLieu"
          placeholder="Tìm kiếm chất liệu"
          show-search
          :options="materialOptions"
          class="custom-select-with-button"
          :loading="fetchingMaterial"
          :not-found-content="fetchingMaterial ? 'Đang tải...' : 'Không tìm thấy chất liệu'"
          :filter-option="false"
          @search="(val) => handleOptionSearch('material', val)"
          @dropdownVisibleChange="(open) => { 
            if (open && materialOptions.length === 0) 
              handleOptionSearch('material', '', 0) 
          }"
        />
      </a-col>
      <a-col :span="2">
        <a-button 
          shape="square" 
          class="variant-add-btn" 
          @click="onAddChatLieu"
        >
          <plus-outlined />
        </a-button>
      </a-col>
    </a-row>
  </a-form-item>
</a-col>

    <a-col :span="12">
      <a-form-item label="Nhãn hiệu" name="productNumber" class="!mb-4" :rules="[{ required: true, message: 'Vui lòng nhập!' }]">
        <a-row :gutter="8">
          <a-col :span="22">
            <a-input
              v-model:value="formState.productNumber"
              placeholder="Tìm kiếm theo tên thương hiệu"
              class="custom-input-with-button"
            />
          </a-col>
          <a-col :span="2">
            <a-button 
              shape="square" 
              class="variant-add-btn" 
              @click="onAddProductNumber"
            >
              <plus-outlined />
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item label="Đế" name="noiSanXuat" class="!mb-4" :rules="[{ required: true, message: 'Vui lòng nhập!' }]">
        <a-row :gutter="8">
          <a-col :span="22">
            <a-input
              v-model:value="formState.noiSanXuat"
              placeholder="Tìm kiếm theo tên đế giày"
              class="custom-input-with-button"
            />
          </a-col>
          <a-col :span="2">
            <a-button 
              shape="square" 
              class="variant-add-btn" 
              @click="onAddNoiSanXuat"
            >
              <plus-outlined />
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      </a-col>
  </a-row>
</div>
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <a-row :gutter="16" class="items-start mb-4">
          <a-col :span="4">
            <span class="font-semibold text-base block pt-1">Màu sắc</span>
          </a-col>
          
          <a-col :span="20" class="flex flex-wrap items-center gap-2">
            <a-button 
              shape="square" 
              class="variant-add-btn" 
              @click="onAddColor"
            >
              <plus-outlined />
            </a-button>
            </a-col>
        </a-row>

        <a-row :gutter="16" class="items-start mb-6">
          <a-col :span="4">
            <span class="font-semibold text-base block pt-1">Kích cỡ</span>
          </a-col>
          
          <a-col :span="20" class="flex flex-wrap items-center gap-2">
            <a-button 
              shape="square" 
              class="variant-add-btn" 
              @click="onAddSize"
            >
              <plus-outlined />
            </a-button>
            </a-col>
        </a-row>

      </div>
      <!-- <a-divider style="margin-top: 0; margin-bottom: 24px;">
        <span class="text-lg font-bold"></span>
      </a-divider> -->

      <div class="bg-white p-6 rounded-lg shadow-md">
             <div class="text-right">
            <a-button type="primary"  @click="onConfirmVariants">
              <template><check-outlined /></template>
              thêm 
            </a-button>
          </div>
      
        <a-table 
          :columns="variantColumns" 
          :data-source="variantData" 
          :pagination="false" 
          class="mt-4 variant-table"
          :row-key="(record: any) => record.key"
        >
          <template #headerCell="{ column }">
            <div class="font-bold text-black text-center py-2" >
              {{ column.title }}
            </div>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'stt'">
              {{ index + 1 }}
            </template>
            <template v-else-if="column.key === 'soLuong'">
              <a-input-number v-model:value="record.soLuong" :min="0" class="w-full" />
            </template>
            <template v-else-if="column.key === 'gia'">
              <a-input-number v-model:value="record.gia" :min="0" class="w-full" />
            </template>
            <template v-else-if="column.key === 'hinhAnh'">
              <a-upload
                :show-upload-list="false"
                class="variant-upload"
                name="file"
              >
                <div v-if="!record.imageUrl" class="flex flex-col items-center justify-center p-2 border border-dashed hover:border-blue-500 cursor-pointer w-20 h-20">
                  <plus-outlined />
                  <div class="text-xs">Upload</div>
                </div>
                <img v-else :src="record.imageUrl" class="w-20 h-20 object-cover" />
              </a-upload>
            </template>
            <template v-else-if="column.key === 'operation'">
              <a-button type="text" danger><delete-outlined class="text-lg" /></a-button>
            </template>
          </template>
        </a-table>
        
      </div>

    </a-form>
    
    <!-- <div class="flex justify-center gap-[15px] mt-8">
      <a-button type="primary" html-type="button" @click="resetFormStep1">Làm mới</a-button>
      <a-button type="primary" html-type="submit" @click="formRef.submit()">Lưu</a-button>
    </div>
     -->
  </div>
</template>

<script lang="ts" setup>
import {
    PlusOutlined,
    DeleteOutlined,
    CloseOutlined,
    CheckOutlined,
} from "@ant-design/icons-vue";
import { onMounted, reactive, ref, inject } from "vue";
import type IFileModel from "@/commons/types/IFileModel";
import fileService from "@/commons/services/FileService";
import { notification } from "ant-design-vue";
import type IProductType from "../types/IProductType";
import type { FormInstance } from "ant-design-vue/es/form/Form";

// [CẬP NHẬT IMPORTS] - Sử dụng các Service đã sửa
import CategoryService from "@/views/product/services/CategoryService";
import BrandService from "@/views/product/services/BrandService";
import MaterialService from "@/views/product/services/MaterialService"; // <--- THÊM MỚI
import { 
    IProductTypeReq, 
    IProductTypeRes,
    ISimpleProductOption // TYPE CHO COMBOBOX SẢN PHẨM
} from "../types/IProductType";
import ProductService from "../services/ProductService";
import { useRoute } from "vue-router";
import type { AxiosResponse } from "axios";

// [THÊM TYPE MỚI] - Type cho Select Options (value: number, label: string)
interface ISelectOption {
    value: number;
    label: string;
}

const _removeSpecialChars = inject("removeSpecialChars", (val: string) => val);

const route = useRoute();
const emits = defineEmits(["updateProduct", "redirectStep"]);

const { productOrigin } = defineProps<{
    productOrigin: IProductType | undefined;
}>();
const formRef = ref<FormInstance>();

// --- KHAI BÁO FORMSTATE (ĐÃ SỬA CHAT LIEU) ---
const formState = reactive<IProductType & { productId?: number, chatLieuId?: number }>({
    id: 0,
    name: "",
    productId: undefined, 
    
    productNumber: "", // Nhãn hiệu
    isWebDisplay: true,
    sex: "MALE",
    newPrice: 10000,
    oldPrice: 0,
    desc: "",
    category: undefined, // loại (ID)
    brand: undefined, // Thương hiệu (ID)
    mainImage: undefined,
    bgImages: undefined,
    
    // [ĐÃ SỬA] Giữ chatLieu là string cho payload API cũ (nếu cần), 
    // và thêm chatLieuId để binding với Select Box
    chatLieu: null, 
    chatLieuId: undefined, // <--- THÊM MỚI: Dùng để binding với a-select
    
    trongLuong: "",
    congNghe: "",
    tinhNang: "",
    noiSanXuat: "", // Đế
});

// --- STATE CHO COMBOBOX SẢN PHẨM & TÌM KIẾM SẢN PHẨM ---
const productOptions = ref<ISimpleProductOption[]>([]); 
const fetching = ref(false); 
let searchTimeout: NodeJS.Timeout | null = null; // Khai báo cho Debounce (Sản phẩm)

// --- STATE CHO THƯƠNG HIỆU, LOẠI SP & CHẤT LIỆU ---
const brandOptions = ref<ISelectOption[]>([]); // Dùng cho Thương hiệu
const categoryOptions = ref<ISelectOption[]>([]); // Dùng cho loại
const materialOptions = ref<ISelectOption[]>([]); // <--- THÊM MỚI

const fetchingBrand = ref(false); // Loading cho Thương hiệu
const fetchingCategory = ref(false); // Loading cho Loại sản phẩm
const fetchingMaterial = ref(false); // <--- THÊM MỚI: Loading cho Chất liệu

let brandSearchTimeout: NodeJS.Timeout | null = null; // Timer cho Thương hiệu
let categorySearchTimeout: NodeJS.Timeout | null = null; // Timer cho Loại SP
let materialSearchTimeout: NodeJS.Timeout | null = null; // <--- THÊM MỚI: Timer cho Chất liệu


// --- LOGIC CHO COMBOBOX SẢN PHẨM & TÌM KIẾM API (Giữ nguyên) ---

/** Tải dữ liệu danh sách sản phẩm (ID, Name) ban đầu */
const loadProductOptions = async () => {
    fetching.value = true;
    try {
        const data = await ProductService.fetchProductOptions(); 
        productOptions.value = data;
    } catch (error) {
        console.error('Không thể tải danh sách sản phẩm:', error);
        notification.error({ message: "Lỗi tải danh sách sản phẩm!" });
    } finally {
        fetching.value = false;
    }
};

/** * Xử lý sự kiện @search trên a-select (Server-side search với Debounce) */
const handleSearch = (value: string) => {
    // 1. Luôn xóa timeout cũ để reset debounce
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Đặt cờ loading ngay lập tức
    fetching.value = true;
    
    // 2. Thiết lập Debounce
    searchTimeout = setTimeout(() => {
        // Nếu từ khóa rỗng sau 500ms, tải lại danh sách đầy đủ (nếu cần)
        if (!value) {
            loadProductOptions(); // Tải lại danh sách ban đầu (API /options)
            return; // Dừng hàm tại đây
        }
        
        // GỌI HÀM SERVICE TÌM KIẾM API
        ProductService.searchProductOptions(value) 
            .then((data: ISimpleProductOption[]) => {
                productOptions.value = data;
                notification.destroy(); 
            })
            .catch(error => {
                console.error("Tìm kiếm sản phẩm thất bại (LỖI CATCH):", error);
                notification.error({ message: "Tìm kiếm sản phẩm thất bại!" });
            })
            .finally(() => {
                fetching.value = false;
            });
            
    }, 500); // Debounce 500ms
};

/** Xử lý khi chọn một sản phẩm, tải chi tiết để điền vào form (handleProductSelect) */
const handleProductSelect = (selectedProductId: number) => {
    if (!selectedProductId) return;

    ProductService.getChiTiet(selectedProductId)
        .then((res: AxiosResponse<IProductTypeRes>) => {
            const data = res.data;
            
            // Cập nhật các trường còn lại của formState
            formState.name = data.tieuDe;
            formState.desc = data.moTa;
            formState.brand = data.thuongHieu.id;
            formState.category = data.dmGiay.id;
            formState.productNumber = data.maSP;
            
            // [ĐÃ SỬA] Cập nhật chatLieu và chatLieuId
            formState.chatLieu = data.chatLieu;
            
            // Tìm ID tương ứng trong danh sách options (Nếu có) để điền vào Select
            const selectedMaterial = materialOptions.value.find(o => o.label === data.chatLieu);
            formState.chatLieuId = selectedMaterial ? selectedMaterial.value : undefined; 
            
            formState.noiSanXuat = data.noiSanXuat;
            
            // Cập nhật hình ảnh
            if (data.anhChinh) {
                productImages.mainImage = data.anhChinh;
                formState.mainImage = data.anhChinh.id;
            }
            
            notification.success({ message: `Đã tải thông tin chi tiết cho sản phẩm ID: ${selectedProductId}` });
        })
        .catch(error => {
            console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            notification.error({ message: "Không thể tải chi tiết sản phẩm!" });
        });
};


/** Xử lý click nút '+' bên cạnh ComboBox Sản phẩm */
const onAddProduct = () => {
    notification.info({ message: "Mở modal/chuyển trang để thêm sản phẩm mới." });
};


// --- LOGIC CHO OPTIONS TỔNG QUÁT (THƯƠNG HIỆU, LOẠI SẢN PHẨM, CHẤT LIỆU) ---

/**
 * Hàm chung xử lý Debounce và gọi API Options/Search cho Brand/Category/Material
 * @param {'brand' | 'category' | 'material'} entityName - Tên entity
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {number} [debounceTime=300] - Thời gian debounce (ms)
 */
const handleOptionSearch = (
    entityName: 'brand' | 'category' | 'material', // <--- ĐÃ SỬA
    keyword: string, 
    debounceTime = 300
) => {
    let timeoutRef: NodeJS.Timeout | null;
    let optionsRef: typeof brandOptions; 
    let fetchingRef: typeof fetchingBrand;
    let serviceFunc: (keyword: string) => Promise<ISelectOption[]>; 

    // 1. Phân biệt Service, State và Path
    if (entityName === 'brand') {
        timeoutRef = brandSearchTimeout;
        optionsRef = brandOptions;
        fetchingRef = fetchingBrand;
        serviceFunc = BrandService.fetchBrandOptions; 
    } else if (entityName === 'category') { 
        timeoutRef = categorySearchTimeout;
        optionsRef = categoryOptions;
        fetchingRef = fetchingCategory;
        serviceFunc = CategoryService.fetchCategoryOptions; 
    } else { // 'material' <--- THÊM LOGIC CHO CHẤT LIỆU
        timeoutRef = materialSearchTimeout;
        optionsRef = materialOptions;
        fetchingRef = fetchingMaterial;
        serviceFunc = MaterialService.fetchMaterialOptions; 
    }

    // 2. Xóa Timeout cũ
    if (timeoutRef) {
        clearTimeout(timeoutRef);
    }
    
    // Đặt cờ loading
    fetchingRef.value = true;
    
    // 3. Logic gọi API
    const callApi = () => {
        serviceFunc(keyword)
            .then((data: ISelectOption[]) => {
                optionsRef.value = data;
            })
            .catch((error: any) => {
                console.error(`Tìm kiếm ${entityName} thất bại:`, error);
            })
            .finally(() => {
                fetchingRef.value = false;
            });
    };
    
    // 4. Thiết lập Debounce
    const newTimer = setTimeout(callApi, debounceTime);
    if (entityName === 'brand') {
        brandSearchTimeout = newTimer;
    } else if (entityName === 'category') {
        categorySearchTimeout = newTimer;
    } else { // 'material' <--- CẬP NHẬT TIMER MỚI
        materialSearchTimeout = newTimer;
    }
};


// --- VALIDATE & ACTIONS (Giữ nguyên) ---
const newPriceValidator = (rule: any, value: string, callback: Function) => {
    if (!value) return callback("Vui lòng không bỏ trống!");
    if (productOrigin && formState.oldPrice > 0)
        if (Number(formState.newPrice) >= Number(formState.oldPrice))
            return callback("Giá mới phải nhỏ hơn giá cũ!");
    return callback();
};

const onChangeOldPrice = () => {
    formRef.value?.validateFields("newPrice");
};

const resetFormStep1 = () => {
    formRef.value?.resetFields();
    productImages.bgImages = [];
    productImages.mainImage = undefined;
};


// --- SELECTBOX OPTIONS KHÁC (Giữ nguyên) ---
const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};


// --- IMAGE HANDLING (Giữ nguyên) ---
const productImages = reactive<{
    mainImage?: IFileModel;
    bgImages: IFileModel[];
}>({
    mainImage: undefined,
    bgImages: [],
});

let isUploadMainImg = false;
const onChooseMainImage = () => {
    if (isUploadMainImg) return;

    const inputTag = document.createElement("input");
    inputTag.accept = "image/png,image/jpg,image/jpeg";
    inputTag.type = "file";
    inputTag.multiple = false;
    inputTag.addEventListener("change", ({ target }: any) => {
        const { files } = target;

        const formData = new FormData();
        formData.append("file", files[0]);

        isUploadMainImg = true;
        fileService
            .uploadFile(formData)
            .then(({ data }: { data: IFileModel }) => {
                productImages.mainImage = data;
                formState.mainImage = productImages.mainImage.id;
                formRef.value?.validateFields('mainImage');
            })
            .catch((err) => {
                console.log("upload failed!", err);
            })
            .finally(() => (isUploadMainImg = false));
    });
    inputTag.click();
};
const removeMainImg = () => {
    productImages.mainImage = undefined;
    formState.mainImage = undefined;
    formRef.value?.validateFields('mainImage');
};

// --- VARIANT LOGIC (Phần 3 & 4) (Giữ nguyên) ---
const onAddColor = () => {
    notification.info({ message: "Mở modal chọn/thêm màu sắc." });
}
const onAddSize = () => {
    notification.info({ message: "Mở modal chọn/thêm kích cỡ." });
}
const onConfirmVariants = () => {
    notification.info({ message: "Đang tạo bảng biến thể..." });
}

// Logic cho các nút '+' bên cạnh các trường khác (Giữ nguyên)
const onAddBrand = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Thương hiệu." }); };
const onAddCategory = () => { notification.info({ message: "Mở modal/chuyển trang để thêm loại." }); };
const onAddChatLieu = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Chất liệu." }); };
const onAddProductNumber = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Nhãn hiệu." }); };
const onAddNoiSanXuat = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Đế/Nơi sản xuất." }); };


const variantColumns = [
    { title: "#", dataIndex: "stt", key: "stt", width: '5%', align: 'center' },
    { title: "Tên", dataIndex: "ten", key: "ten", width: '30%' },
    { title: "Số lượng", dataIndex: "soLuong", key: "soLuong", width: '15%', align: 'center' },
    { title: "Giá", dataIndex: "gia", key: "gia", width: '15%', align: 'center' },
    { title: "Hành động", dataIndex: "operation", key: "operation", width: '10%', align: 'center' },
    { title: "Hình ảnh", dataIndex: "hinhAnh", key: "hinhAnh", width: '25%', align: 'center' },
];

const variantData = ref([]); 

// --- FORM SUBMIT LOGIC (ĐÃ SỬA CHAT LIEU) ---
const onFinish = (values: any) => {
    console.log("Success:", values);

    // [ĐÃ SỬA]: Lấy tên Chất liệu từ Options nếu đã chọn ID
    let finalChatLieu = formState.chatLieu;
    if (formState.chatLieuId) {
        const selectedOption = materialOptions.value.find(o => o.value === formState.chatLieuId);
        if (selectedOption) {
            finalChatLieu = selectedOption.label;
        }
    }

    const payload: IProductTypeReq = {
        id: formState.id == 0 ? undefined : formState.id,
        tieuDe: formState.name,
        maSP: formState.productNumber,
        dmGiay: {
            id: formState.category as number,
        },
        thuongHieu: {
            id: formState.brand as number,
        },
        hienThiWeb: formState.isWebDisplay,
        gioiTinh: formState.sex,
        giaMoi: formState.newPrice,
        giaCu: formState.oldPrice,
        anhChinh: formState.mainImage as number,
        anhPhu: formState.bgImages || [] as number[],
        moTa: formState.desc,
        chatLieu: finalChatLieu, // <--- SỬ DỤNG GIÁ TRỊ TÊN MỚI
        trongLuong: formState.trongLuong,
        congNghe: formState.congNghe,
        tinhNang: formState.tinhNang,
        noiSanXuat: formState.noiSanXuat,
    };

    console.log("product payload: ", payload);
    ProductService.addStep1(payload)
        .then((res: AxiosResponse<IProductTypeRes>) => {
            console.log("product. step1 data: ", res.data);
            notification.success({
                message: "Lưu thành công!",
            });
            formState.id = res.data.id;
            emits("updateProduct", {
                id: res.data.id,
                loaiBienThe: res.data.loaiBienTe,
            });

            emits("redirectStep", 1);
        })
        .catch((err) => {
            console.log("product. step1 err: ", err);
            notification.error({
                message: "Lưu sản phẩm thất bại!",
            });
        });
};

const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    notification.error({
        message: "Vui lòng kiểm tra lại các trường bị lỗi!",
        description: "Các trường có dấu sao (*) là bắt buộc.",
    });
};

// --- ON MOUNT (ĐÃ SỬA) ---
onMounted(() => {
    // 1. Tải danh sách Sản phẩm cho ComboBox
    loadProductOptions(); 
    
    // 2. [THAY THẾ] Logic tải Thương Hiệu, Loại SP & CHẤT LIỆU ban đầu
    handleOptionSearch('brand', '', 0); 
    handleOptionSearch('category', '', 0); 
    handleOptionSearch('material', '', 0); // <--- THÊM MỚI
    
    // 3. Logic Edit sản phẩm (ĐÃ SỬA ÁNH XẠ CHẤT LIỆU)
    if (route.params.id) {
        ProductService.getChiTiet(Number(route.params.id))
            .then((res: AxiosResponse<IProductTypeRes>) => {
                // ... (Các trường khác giữ nguyên)
                const pss: IProductType = {
                    id: res.data.id,
                    name: res.data.tieuDe,
                    productNumber: res.data.maSP,
                    category: res.data.dmGiay.id,
                    brand: res.data.thuongHieu.id,
                    sex: res.data.gioiTinh,
                    newPrice: res.data.giaMoi,
                    oldPrice: res.data.giaCu,
                    mainImage: res.data.anhChinh.id,
                    bgImages: res.data.anhPhu.map((i) => i.id),
                    desc: res.data.moTa,
                    isWebDisplay: res.data.hienThiWeb || true,
                    loaiBienThe: res.data.loaiBienThe,
                    chatLieu: res.data.chatLieu, // Vẫn là string
                    trongLuong: res.data.trongLuong,
                    congNghe: res.data.congNghe,
                    tinhNang: res.data.tinhNang,
                    noiSanXuat: res.data.noiSanXuat,
                };
                
                // [THÊM MỚI] Đợi Options Chất liệu tải xong rồi mới ánh xạ giá trị Edit
                // Tạm thời, ta chỉ ánh xạ pss.chatLieu vào formState.chatLieu 
                // và sẽ cập nhật formState.chatLieuId sau khi options tải xong
                
                Object.keys(pss).forEach((k: string) => {
                    // @ts-ignore
                    formState[k] = pss[k];
                });
                
                // CẬP NHẬT chatLieuId SAU KHI OPTIONS ĐÃ TẢI
                // Do handleOptionSearch('material') là async, ta cần dùng watch hoặc đợi (nhưng đợi là không nên)
                // Cách đơn giản nhất là gọi lại hàm mapping sau khi đã fill form
                if (pss.chatLieu) {
                     setTimeout(() => {
                        const selectedMaterial = materialOptions.value.find(o => o.label === pss.chatLieu);
                        formState.chatLieuId = selectedMaterial ? selectedMaterial.value : undefined;
                     }, 300); // Đợi 1 chút cho options tải xong
                }

                // ... (Các logic cập nhật khác)
                formState.productId = res.data.id; 
                productImages.bgImages = res.data.anhPhu;
                productImages.mainImage = res.data.anhChinh;

                emits("updateProduct", {
                    id: res.data.id,
                    loaiBienThe: res.data.loaiBienThe,
                });
            });
    }
});
</script>

<style>
/* Đảm bảo Ant Design Table header có màu cam #ff5733 */
/* .variant-table .ant-table-thead > tr > th {
  background-color: #ff5733 !important;
  color: white !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
} */
/* .variant-table .ant-table-thead > tr > th:last-child {
  border-right: none;
} */

/* Ẩn tiêu đề cột mặc định để dùng header custom */
.variant-table .ant-table-thead th {
    padding: 0;
}
</style>
