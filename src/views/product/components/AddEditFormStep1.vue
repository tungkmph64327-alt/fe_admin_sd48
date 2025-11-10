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
            <a-form-item label="Chất liệu" name="chatLieuId" class="!mb-4">
              <a-row :gutter="8">
                <a-col :span="22">
                  <a-select
                    v-model:value="formState.chatLieuId"
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
                  v-for="colorId in formState.selectedColors" 
                  :key="colorId"
                  :style="{ backgroundColor: getColorHex(colorId) }"
                  class="h-10 border-gray-300 text-sm flex items-center justify-center relative"
                >
                  <span 
                    :class="{'text-white': isDarkColor(getColorHex(colorId)), 'text-black': !isDarkColor(getColorHex(colorId))}"
                    class="px-2"
                  >
                    {{ getColorLabel(colorId) }}
                  </span>
                  <close-outlined 
                    @click.stop="removeSelectedVariant('COLOR', colorId)"
                    class="absolute -top-1 -right-1 cursor-pointer text-red-500 bg-white/75 rounded-full p-0.5 text-xs hover:scale-125 transition-transform"
                  />
                </a-button>
                
                <a-button 
                  shape="square" 
                  class="variant-add-btn h-10 w-10" 
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
                  v-for="sizeId in formState.selectedSizes"
                  :key="sizeId"
                  class="h-10 border-gray-300 text-sm relative"
                >
                  <span class="px-2">{{ getSizeLabel(sizeId) }}</span>
                  <close-outlined 
                    @click.stop="removeSelectedVariant('SIZE', sizeId)"
                    class="absolute -top-1 -right-1 cursor-pointer text-red-500 bg-white/75 rounded-full p-0.5 text-xs hover:scale-125 transition-transform"
                  />
                </a-button>
                
                <a-button 
                  shape="square" 
                  class="variant-add-btn h-10 w-10" 
                  @click="onAddSize"
                >
                  <plus-outlined />
                </a-button>
            </a-col>
        </a-row>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-right">
          <a-button type="primary"  @click="onConfirmVariants">
            <template><check-outlined /></template>
            tạo biến thể 
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

    <VariantSelectorModal
        :isVisible="isVariantModalVisible"
        :variantType="currentVariantType"
        :allVariants="allAvailableVariants"
        :initialSelected="currentVariantType === 'COLOR' ? formState.selectedColors : formState.selectedSizes"
        @close="isVariantModalVisible = false"
        @confirm="handleModalConfirm"
        @add-new="handleAddNewVariant"
    />
  </div>
</template>

<script lang="ts" setup>
import { CloseOutlined, PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import type IFileModel from "@/commons/types/IFileModel";
import fileService from "@/commons/services/FileService";
import { notification } from 'ant-design-vue';
import type IProductType from "../types/IProductType";
import type { FormInstance } from "ant-design-vue/es/form/Form";

// IMPORTS
import CategoryService from "@/views/product/services/CategoryService";
import BrandService from "@/views/product/services/BrandService";
import MaterialService from "@/views/product/services/MaterialService"; 
import VariantService from "@/views/product/services/VariantService"; 
import VariantSelectorModal from './VariantSelectorModal.vue';
import ColorService, { type IColorOption } from '@/views/product/services/ColorService';
import SizeService, { type ISizeOption } from '@/views/product/services/SizeService';

import { 
    IProductTypeReq, 
    IProductTypeRes,
    ISimpleProductOption 
} from "../types/IProductType";
import ProductService from "../services/ProductService";
import { useRoute } from "vue-router";
import type { AxiosResponse } from "axios";

interface ISelectOption {
    value: number;
    label: string; // Mã Hex cho màu, tên cho size
    tenMau?: string; // Tên màu (chỉ có cho màu sắc)
}

const route = useRoute();
const emits = defineEmits(["updateProduct", "redirectStep"]);

const { productOrigin } = defineProps<{
    productOrigin: IProductType | undefined;
}>();

const formRef = ref<FormInstance>();

// --- KHAI BÁO FORMSTATE ---
const formState = reactive<IProductType & { 
    productId?: number, 
    chatLieuId?: number,
    selectedColors: number[], 
    selectedSizes: number[] 
}>({
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
    
    chatLieu: undefined, 
    chatLieuId: undefined, // Dùng để binding với a-select
    
    trongLuong: "",
    congNghe: "",
    tinhNang: "",
    noiSanXuat: "", // Đế
    // 🌟 KHAI BÁO BIẾN THỂ ĐÃ CHỌN 🌟
    selectedColors: [] as number[], // Mảng chứa ID Màu sắc
    selectedSizes: [] as number[],   // Mảng chứa ID Kích cỡ
});

// --- STATE CHO COMBOBOX SẢN PHẨM & TÌM KIẾM SẢN PHẨM ---
const productOptions = ref<ISimpleProductOption[]>([]); 
const fetching = ref(false); 
let searchTimeout: NodeJS.Timeout | null = null; 

// --- STATE CHO THƯƠNG HIỆU, LOẠI SP & CHẤT LIỆU ---
const brandOptions = ref<ISelectOption[]>([]); 
const categoryOptions = ref<ISelectOption[]>([]); 
const materialOptions = ref<ISelectOption[]>([]); 
const fetchingBrand = ref(false); 
const fetchingCategory = ref(false); 
const fetchingMaterial = ref(false); 
let brandSearchTimeout: NodeJS.Timeout | null = null; 
let categorySearchTimeout: NodeJS.Timeout | null = null; 
let materialSearchTimeout: NodeJS.Timeout | null = null; 

const variantType = ref('');
const isVariantModalVisible = ref(false);
const currentVariantType = ref<'COLOR' | 'SIZE' | null>(null);
const allAvailableVariants = ref<ISelectOption[]>([]); 
const availableColors = ref<ISelectOption[]>([]);
const availableSizes = ref<ISelectOption[]>([]);

// 🌟 4. HÀM TẢI DỮ LIỆU (MANG TỪ MODAL SANG COMPONENT CHA) 🌟
const fetchVariants = async (type: 'COLOR' | 'SIZE') => {
    allAvailableVariants.value = [];
    try {
        if (type === 'COLOR') {
            const colors: IColorOption[] = await ColorService.fetchColorOptions();
            allAvailableVariants.value = colors.map((c: IColorOption) => ({
                value: c.id,
                label: c.maHex, 
                tenMau: c.tenMau 
            }));
            // Cập nhật availableColors để getColorLabel có thể sử dụng
            availableColors.value = allAvailableVariants.value as ISelectOption[];
            
        } else {
            const sizes: ISizeOption[] = await SizeService.fetchSizeOptions();
            allAvailableVariants.value = sizes.map((s: ISizeOption) => ({
                value: s.id,
                label: s.tenKichThuoc 
            }));
            // Cập nhật availableSizes để getSizeLabel có thể sử dụng
            availableSizes.value = allAvailableVariants.value as ISelectOption[];
        }
    } catch (error) {
        console.error(`Lỗi khi tải danh sách ${type}:`, error);
    }
};

// 🌟 5. HÀM MỞ MODAL 🌟
const openVariantModal = async (type: 'COLOR' | 'SIZE') => {
    currentVariantType.value = type;
    await fetchVariants(type);
    isVariantModalVisible.value = true;
};

// 🌟 6. HÀM XỬ LÝ KHI MODAL XÁC NHẬN (CONFIRM) 🌟
const handleModalConfirm = (type: 'COLOR' | 'SIZE' | null, confirmedIds: number[]) => {
    if (type === 'COLOR') {
        formState.selectedColors = confirmedIds;
    } else if (type === 'SIZE') {
        formState.selectedSizes = confirmedIds;
    }
    notification.success({ message: `Đã chọn ${confirmedIds.length} ${type === 'COLOR' ? 'Màu sắc' : 'Kích cỡ'}.` });
};

// 🌟 7. HÀM XỬ LÝ KHI NGƯỜI DÙNG MUỐN THÊM MỚI 🌟
const handleAddNewVariant = (type: 'COLOR' | 'SIZE' | null) => {
    console.log(`Mở form/modal thêm mới ${type}`);
};

const loadAllVariants = async () => {
    try {
        const colors: IColorOption[] = await ColorService.fetchColorOptions();
        availableColors.value = colors.map((c: IColorOption) => ({
            value: c.id,
            label: c.maHex,
            tenMau: c.tenMau
        }));
        
        const sizes: ISizeOption[] = await SizeService.fetchSizeOptions();
        availableSizes.value = sizes.map((s: ISizeOption) => ({
            value: s.id,
            label: s.tenKichThuoc
        }));
    } catch (error) {
        console.error("Lỗi tải biến thể:", error);
    }
}

const getColorLabel = (id: number): string => {
    // Ưu tiên tìm trong availableColors trước vì allAvailableVariants có thể chứa dữ liệu SIZE
    const variant = availableColors.value.find((v: ISelectOption) => v.value === id);
    if (variant) {
        return variant.tenMau || variant.label; 
    }
    // Nếu không tìm thấy trong availableColors, thử tìm trong allAvailableVariants (chỉ khi nó chứa COLOR)
    // Nhưng chỉ khi currentVariantType là COLOR để tránh lấy nhầm dữ liệu SIZE
    if (currentVariantType.value === 'COLOR') {
        const variantFromAll = allAvailableVariants.value.find((v: ISelectOption) => v.value === id);
        if (variantFromAll) {
            return variantFromAll.tenMau || variantFromAll.label;
        }
    }
    return 'Unknown Color';
};

const getColorHex = (id: number): string => {
    // Ưu tiên tìm trong availableColors trước vì allAvailableVariants có thể chứa dữ liệu SIZE
    const variant = availableColors.value.find((v: ISelectOption) => v.value === id);
    if (variant) {
        return variant.label || '#ffffff';
    }
    // Nếu không tìm thấy trong availableColors, thử tìm trong allAvailableVariants (chỉ khi nó chứa COLOR)
    if (currentVariantType.value === 'COLOR') {
        const variantFromAll = allAvailableVariants.value.find((v: ISelectOption) => v.value === id);
        if (variantFromAll) {
            return variantFromAll.label || '#ffffff';
        }
    }
    return '#ffffff';
};

/** Lấy tên kích cỡ từ ID */
const getSizeLabel = (id: number): string => {
    // Chỉ tìm trong availableSizes vì allAvailableVariants có thể chứa dữ liệu COLOR (mã hex)
    const variant = availableSizes.value.find((v: ISelectOption) => v.value === id);
    if (variant) {
        return variant.label;
    }
    // Nếu không tìm thấy trong availableSizes, thử tìm trong allAvailableVariants (chỉ khi nó chứa SIZE)
    // Nhưng chỉ khi currentVariantType là SIZE để tránh lấy nhầm dữ liệu COLOR
    if (currentVariantType.value === 'SIZE') {
        const variantFromAll = allAvailableVariants.value.find((v: ISelectOption) => v.value === id);
        if (variantFromAll) {
            return variantFromAll.label;
        }
    }
    return 'N/A';
};

/** Hàm kiểm tra màu tối để hiển thị text màu trắng */
const isDarkColor = (hex: string): boolean => {
    if (!hex || hex.length < 4) return false;
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return false;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255; 
    return luminance < 0.5;
};

/** Mở Modal Chọn Màu */
const onAddColor = () => {
    openVariantModal('COLOR');
}

/** Mở Modal Chọn Kích cỡ */
const onAddSize = () => {
    openVariantModal('SIZE');
}

const removeSelectedVariant = (type: 'COLOR' | 'SIZE', id: number): void => {
    if (type === 'COLOR') {
        formState.selectedColors = formState.selectedColors.filter(colorId => colorId !== id);
    } else if (type === 'SIZE') {
        formState.selectedSizes = formState.selectedSizes.filter(sizeId => sizeId !== id);
    }
};

// --- LOGIC CHO COMBOBOX SẢN PHẨM & TÌM KIẾM API ---
/** Tải dữ liệu danh sách sản phẩm (ID, Name) ban đầu */
const loadProductOptions = async () => {
    fetching.value = true;
    try {
        const data = await ProductService.fetchProductOptions(); 
        productOptions.value = data;
    } catch (error) {
        console.error('Không thể tải danh sách sản phẩm:', error);
    } finally {
        fetching.value = false;
    }
};

/** * Xử lý sự kiện @search trên a-select (Server-side search với Debounce) */
const handleSearch = (value: string) => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    fetching.value = true;
    
    searchTimeout = setTimeout(() => {
        if (!value) {
            loadProductOptions(); 
            return; 
        }
        
        ProductService.searchProductOptions(value) 
            .then((data: ISimpleProductOption[]) => {
                productOptions.value = data;
            })
            .catch(error => {
                console.error("Tìm kiếm sản phẩm thất bại (LỖI CATCH):", error);
            })
            .finally(() => {
                fetching.value = false;
            });
    }, 500); 
};

/** Xử lý khi chọn một sản phẩm, tải chi tiết để điền vào form (handleProductSelect) */
const handleProductSelect = (selectedProductId: number) => {
    if (!selectedProductId) return;
    ProductService.getChiTiet(selectedProductId)
        .then((res: AxiosResponse<IProductTypeRes>) => {
            const data = res.data;
            
            formState.name = data.tieuDe;
            formState.desc = data.moTa;
            formState.brand = data.thuongHieu.id;
            formState.category = data.dmGiay.id;
            formState.productNumber = data.maSP;
            
            formState.chatLieu = data.chatLieu;
            const selectedMaterial = materialOptions.value.find((o: ISelectOption) => o.label === data.chatLieu);
            formState.chatLieuId = selectedMaterial ? selectedMaterial.value : undefined; 
            
            formState.noiSanXuat = data.noiSanXuat;
            
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

const onAddProduct = () => {
    notification.info({ message: "Mở modal/chuyển trang để thêm sản phẩm mới." });
};

// --- LOGIC CHO OPTIONS TỔNG QUÁT (THƯƠNG HIỆU, LOẠI SẢN PHẨM, CHẤT LIỆU) ---
const handleOptionSearch = (
    entityName: 'brand' | 'category' | 'material', 
    keyword: string, 
    debounceTime = 300
) => {
    let timeoutRef: NodeJS.Timeout | null;
    let optionsRef: typeof brandOptions; 
    let fetchingRef: typeof fetchingBrand;
    let serviceFunc: (keyword: string) => Promise<ISelectOption[]>; 

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
    } else { // 'material' 
        timeoutRef = materialSearchTimeout;
        optionsRef = materialOptions;
        fetchingRef = fetchingMaterial;
        serviceFunc = MaterialService.fetchMaterialOptions;
    }

    if (timeoutRef) {
        clearTimeout(timeoutRef);
    }
    
    fetchingRef.value = true;
    
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
    
    const newTimer = setTimeout(callApi, debounceTime);
    if (entityName === 'brand') {
        brandSearchTimeout = newTimer;
    } else if (entityName === 'category') {
        categorySearchTimeout = newTimer;
    } else { // 'material' 
        materialSearchTimeout = newTimer;
    }
};

// --- IMAGE HANDLING ---
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

// --- VARIANT LOGIC (Tạo Bảng) ---
const onConfirmVariants = () => {
    if (formState.selectedColors.length === 0 && formState.selectedSizes.length === 0) {
        notification.warning({ message: "Vui lòng chọn ít nhất một Màu sắc hoặc Kích cỡ để tạo biến thể." });
        return;
    }
    
    const colors = formState.selectedColors.map(id => ({ id, label: getColorLabel(id), hex: getColorHex(id) }));
    const sizes = formState.selectedSizes.map(id => ({ id, label: getSizeLabel(id) }));
    
    const newVariants: any[] = [];
    
    if (colors.length > 0 && sizes.length > 0) {
        let keyCounter = 0;
        colors.forEach(color => {
            sizes.forEach(size => {
                newVariants.push({
                    key: `c${color.id}-s${size.id}`,
                    ten: `${color.label} / Size ${size.label}`,
                    colorId: color.id,
                    sizeId: size.id,
                    soLuong: 0,
                    gia: formState.newPrice,
                    imageUrl: null,
                });
            });
        });
    } else if (colors.length > 0) {
        colors.forEach(color => {
            newVariants.push({
                key: `c${color.id}`,
                ten: `${color.label}`,
                colorId: color.id,
                sizeId: null,
                soLuong: 0,
                gia: formState.newPrice,
                imageUrl: null,
            });
        });
    } else if (sizes.length > 0) {
        sizes.forEach(size => {
            newVariants.push({
                key: `s${size.id}`,
                ten: `Size ${size.label}`,
                colorId: null,
                sizeId: size.id,
                soLuong: 0,
                gia: formState.newPrice,
                imageUrl: null,
            });
        });
    }
    
    variantData.value = newVariants;
    notification.success({ 
        message: `Đã tạo ${newVariants.length} biến thể.` 
    });
}

const variantColumns = [
    { title: "#", dataIndex: "stt", key: "stt", width: '5%', align: 'center' },
    { title: "Tên", dataIndex: "ten", key: "ten", width: '30%' },
    { title: "Số lượng", dataIndex: "soLuong", key: "soLuong", width: '15%', align: 'center' },
    { title: "Giá", dataIndex: "gia", key: "gia", width: '15%', align: 'center' },
    { title: "Hành động", dataIndex: "operation", key: "operation", width: '10%', align: 'center' },
    { title: "Hình ảnh", dataIndex: "hinhAnh", key: "hinhAnh", width: '25%', align: 'center' },
];

const variantData = ref<any[]>([]); 

// Logic cho các nút '+' bên cạnh các trường khác 
const onAddBrand = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Thương hiệu." }); };
const onAddCategory = () => { notification.info({ message: "Mở modal/chuyển trang để thêm loại." }); };
const onAddChatLieu = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Chất liệu." }); };
const onAddProductNumber = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Nhãn hiệu." }); };
const onAddNoiSanXuat = () => { notification.info({ message: "Mở modal/chuyển trang để thêm Đế/Nơi sản xuất." }); };

// --- FORM SUBMIT LOGIC ---
const onFinish = (values: any) => {
    console.log("Success:", values);
    let finalChatLieu = formState.chatLieu;
    if (formState.chatLieuId) {
        const selectedOption = materialOptions.value.find((o: ISelectOption) => o.value === formState.chatLieuId);
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
        chatLieu: finalChatLieu,
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
                loaiBienThe: res.data.loaiBienThe,
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

// --- ON MOUNT ---
onMounted(() => {
    loadProductOptions(); 
    handleOptionSearch('brand', '', 0); 
    handleOptionSearch('category', '', 0); 
    handleOptionSearch('material', '', 0); 
    loadAllVariants(); 
    
    if (route.params.id) {
        ProductService.getChiTiet(Number(route.params.id))
            .then((res: AxiosResponse<IProductTypeRes>) => {
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
                    chatLieu: res.data.chatLieu, 
                    trongLuong: res.data.trongLuong,
                    congNghe: res.data.congNghe,
                    tinhNang: res.data.tinhNang,
                    noiSanXuat: res.data.noiSanXuat,
                };
                
                Object.keys(pss).forEach((k: string) => {
                    // @ts-ignore
                    formState[k] = pss[k];
                });
                
                if (pss.chatLieu) {
                      setTimeout(() => {
                          const selectedMaterial = materialOptions.value.find((o: ISelectOption) => o.label === pss.chatLieu);
                          formState.chatLieuId = selectedMaterial ? selectedMaterial.value : undefined;
                      }, 300);
                }
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
.variant-table .ant-table-thead th {
  padding: 0;
}
</style>