<!-- <template>
  <a-modal
    v-model:visible="visible"
    title="Chọn kích cỡ"
    @ok="handleConfirm"
    @cancel="handleCancel"
    width="500px"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <span>Chọn kích cỡ</span>
        <a-button type="link" @click="onAddNewSizeClicked">
          <plus-outlined /> Thêm kích thước
        </a-button>
      </div>
    </template>

  <div class="size-options grid grid-cols-4 gap-3 p-2"> 
      <div
        v-for="size in availableSizes"
        :key="size"
        class="size-item" 
        :class="{ 'size-item-selected': isSizeSelected(size) }"
        @click="toggleSize(size)"
      >
        <div class="size-text">{{ size }}</div> 
        <check-outlined v-if="isSizeSelected(size)" class="check-icon" />
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { PlusOutlined, CheckOutlined } from "@ant-design/icons-vue";

type ISize = number;

const props = defineProps<{
  visible: boolean;
  initialSelectedSizes: ISize[];
}>();

const emits = defineEmits(["update:visible", "confirm", "addNewSize"]);

const visible = ref(props.visible);
const selectedSizes = ref<ISize[]>([]);

const availableSizes = ref<ISize[]>([36, 37, 38, 39, 40, 41, 42, 43, 44]);

watch(() => props.visible, (newVal) => {
    visible.value = newVal;
    if (newVal) {
        selectedSizes.value = [...props.initialSelectedSizes];
    }
});

const isSizeSelected = (size: ISize) => {
  return selectedSizes.value.includes(size);
};

const toggleSize = (size: ISize) => {
  const index = selectedSizes.value.indexOf(size);
  if (index > -1) {
    selectedSizes.value.splice(index, 1);
  } else {
    selectedSizes.value.push(size);
  }
};

const handleCancel = () => {
  emits("update:visible", false);
};

const handleConfirm = () => {
  emits("confirm", selectedSizes.value);
  emits("update:visible", false);
};

const onAddNewSizeClicked = () => {
  emits('addNewSize');
};
</script>

<style scoped>
.size-item {
  @apply relative flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all duration-200;
  @apply border-gray-300 text-gray-800 bg-white;
  height: 40px; /* Chiều cao nhỏ hơn */
  font-weight: 500;
}

.size-item:hover {
  @apply border-blue-400; 
}

/* 🌟 CẬP NHẬT ĐỂ TẠO VIỀN XANH NỔI BẬT GIỐNG ẢNH MẪU 🌟 */
.size-item-selected {
  /* Màu xanh #1890ff của Ant Design (hoặc màu xanh bạn đang dùng cho nút Primary) */
  @apply border-blue-500 bg-blue-500 text-white; 
  /* Loai bo box-shadow để giống viền khối trong ảnh */
}

.size-text {
  /* Căn giữa số */
  @apply text-center; 
}

.check-icon {
  /* Ẩn hoặc đặt dấu tích ở vị trí khác nếu không cần thiết. */
  /* Nếu bạn muốn dấu tích màu trắng, giữ nguyên nhưng đảm bảo nó được nhìn thấy trên nền xanh */
  @apply absolute right-2 text-white; 
  font-size: 14px;
}
</style> -->
<template>
    
</template>
<script>

</script>

<style scoped>

</style>