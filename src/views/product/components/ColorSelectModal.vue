<!-- <template>
  <a-modal
    v-model:visible="visible"
    title="Chọn màu sắc"
    @ok="handleConfirm" @cancel="handleCancel"
    width="500px"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <span>Chọn màu sắc</span>
        <a-button type="link" @click="onAddColorClicked"> 
          <plus-outlined /> Thêm màu sắc
        </a-button>
      </div>
    </template>

    <div class="color-options grid grid-cols-3 gap-3 p-2"> 
      <div
        v-for="color in availableColors"
        :key="color.id"
        class="color-option-item"
        :class="{ 'selected': isColorSelected(color.id) }"
        @click="toggleColorSelection(color)"
      >
        <div class="flex items-center justify-start w-full"> 
            <span
              class="color-circle"
              :style="{ backgroundColor: color.hexCode }"
            ></span>
            <span class="color-name">{{ color.name }}</span>
            
            <check-outlined v-if="isColorSelected(color.id)" class="absolute right-2 text-blue-500" />
            </div>
      </div>
    </div>

    </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons-vue';
// import ColorService, { IColorOption } from '../services/ColorService'; // Cần import ColorService thật
// import { notification } from 'ant-design-vue'; // Nếu bạn muốn dùng thông báo

// Giao diện (Interface) Màu sắc
interface IColor {
    id: number;
    name: string;
    hexCode: string;
}

const props = defineProps<{
    visible: boolean;
    // Nhận mảng đối tượng màu sắc đã chọn từ form chính (để set trạng thái ban đầu)
    initialSelectedColors: IColor[]; 
}>();

// Emits:
// - 'update:visible': dùng để đóng mở modal
// - 'confirm': PHÁT RA DỮ LIỆU CUỐI CÙNG (selectedColors.value)
// - 'addNewColor': yêu cầu mở modal tạo màu mới
const emits = defineEmits(['update:visible', 'confirm', 'addNewColor']);

const visible = ref(props.visible);
const selectedColors = ref<IColor[]>([]); // Sẽ được khởi tạo từ props

// Dữ liệu màu sắc mẫu (Bạn sẽ thay thế bằng hàm loadAvailableColors() từ ColorService)
const availableColors = ref<IColor[]>([
    { id: 1, name: 'Trắng', hexCode: '#FFFFFF' },
    { id: 2, name: 'Đen', hexCode: '#000000' },
    { id: 3, name: 'Đỏ', hexCode: '#FF0000' },
    { id: 4, name: 'Xanh dương', hexCode: '#0000FF' },
    { id: 5, name: 'Vàng', hexCode: '#FFFF00' },
    { id: 6, name: 'Hồng', hexCode: '#FFC0CB' },
    { id: 7, name: 'Xám', hexCode: '#808080' },
    { id: 8, name: 'Tím', hexCode: '#800080' },
    { id: 9, name: 'Xanh lá', hexCode: '#008000' },
]);

// 1. WATCH: Khi `props.visible` thay đổi (Modal mở/đóng)
watch(() => props.visible, (newVal) => {
    visible.value = newVal;
    if (newVal) {
        // RẤT QUAN TRỌNG: Khởi tạo lại selectedColors bằng mảng mới từ props khi modal mở
        selectedColors.value = [...props.initialSelectedColors];
    }
});

// 2. WATCH: Khi `props.initialSelectedColors` thay đổi từ component cha (Không cần thiết nếu bạn chỉ dùng watch ở mục 1)
// watch(() => props.initialSelectedColors, (newVal) => {
//     selectedColors.value = [...newVal];
// }, { deep: true });

const isColorSelected = (colorId: number) => {
    return selectedColors.value.some(c => c.id === colorId);
};

const toggleColorSelection = (color: IColor) => {
    if (isColorSelected(color.id)) {
        selectedColors.value = selectedColors.value.filter(c => c.id !== color.id);
    } else {
        selectedColors.value.push(color);
    }
};

// HÀM QUAN TRỌNG: Gửi dữ liệu về form chính khi nhấn OK
const handleConfirm = () => {
    // 🌟 PHÁT SỰ KIỆN 'confirm' KÈM DỮ LIỆU 🌟
    emits('confirm', selectedColors.value); 
    
    // Đóng modal
    emits('update:visible', false);
};

const handleCancel = () => {
    emits('update:visible', false);
};

const onAddColorClicked = () => {
  emits('addNewColor');
};

// onMounted(() => {
//    // Gọi API loadAvailableColors() tại đây
// });
</script>

<style scoped>
.color-options { align-items: flex-start; }
/* ... (Giữ nguyên hoặc chỉnh sửa CSS) ... */
.color-option-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 12px; 
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  background-color: #fff;
  width: 100%;
}
.color-option-item:hover {
  border-color: #40a9ff;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
}
.color-option-item.selected {
  border-color: #1890ff; 
  background-color: #e6f7ff; 
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ccc; 
  margin-right: 8px; 
  flex-shrink: 0; 
}
.color-name {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> -->
<template>
    
</template>
<script>

</script>

<style scoped>

</style>