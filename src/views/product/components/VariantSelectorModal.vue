<template>
  <a-modal 
    :visible="isVisible"
    :title="modalTitle"
    width="600px"
    :destroyOnClose="true"
    @cancel="$emit('close')"
  >
    <!-- Nút thêm mới -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
      <a-button type="link" @click="$emit('add-new', props.variantType)">
        <template #icon><PlusOutlined /></template>
        {{ props.variantType === 'COLOR' ? 'Thêm màu sắc' : 'Thêm kích thước' }}
      </a-button>
    </div>

    <!-- Danh sách biến thể -->
    <div class="variant-grid">
      <template v-for="item in availableVariants" :key="item.value">
        <!-- Nút màu sắc -->
        <a-button
          v-if="props.variantType === 'COLOR'"
          :type="isSelected(item.value) ? 'primary' : 'default'"
          @click="toggleSelection(item.value)"
          class="variant-color-button"
        >
          <div 
            :style="{ backgroundColor: item.label }" 
            class="color-box"
          ></div>
          <span 
            :class="{ 'text-white': isSelected(item.value) && isDarkColor(item.label) }"
          >
            {{ item.tenMau || item.label }}
          </span>
        </a-button>

        <!-- Nút kích cỡ -->
        <a-button
          v-else
          :type="isSelected(item.value) ? 'primary' : 'default'"
          @click="toggleSelection(item.value)"
          class="variant-size-button"
        >
          {{ item.label }}
        </a-button>
      </template>
    </div>

    <template #footer>
      <a-button key="back" @click="$emit('close')">Hủy</a-button>
      <a-button key="submit" type="primary" @click="handleConfirm">Thêm</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";

/** Interface biến thể */
interface ISelectOption {
  value: number;
  label: string;   // Mã màu (hex) hoặc kích cỡ
  tenMau?: string; // Chỉ dùng cho COLOR
}

/** Props */
const props = defineProps<{
  isVisible: boolean;
  variantType: 'COLOR' | 'SIZE' | null;
  allVariants: ISelectOption[];  // Dữ liệu biến thể từ backend
  initialSelected: number[];     // Danh sách ID đã chọn
}>();

/** Emits */
const emits = defineEmits(['close', 'confirm', 'add-new']);

/** Biến tạm lưu danh sách chọn */
const tempSelected = ref<number[]>([]);

/** Khi modal mở lại, khởi tạo lại danh sách chọn tạm */
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    tempSelected.value = [...props.initialSelected];
  }
});

/** Tiêu đề modal */
const modalTitle = computed(() => {
  if (props.variantType === 'COLOR') return 'Chọn màu sắc';
  if (props.variantType === 'SIZE') return 'Chọn kích cỡ';
  return 'Chọn biến thể';
});

/** Danh sách biến thể hiển thị */
const availableVariants = computed(() => {
  if (!props.allVariants) return [];

  if (props.variantType === 'SIZE') {
    // Sắp xếp kích cỡ theo số nếu toàn bộ label là số
    const variantsCopy = [...props.allVariants];
    const isNumeric = variantsCopy.every(v => !isNaN(Number(v.label)));

    if (isNumeric) {
      return variantsCopy.sort((a, b) => Number(a.label) - Number(b.label));
    }
    return variantsCopy;
  }

  // COLOR thì trả nguyên danh sách
  return props.allVariants;
});

/** Kiểm tra đã chọn hay chưa */
const isSelected = (id: number) => {
  return tempSelected.value.includes(id);
};

/** Toggle chọn / bỏ chọn */
const toggleSelection = (id: number) => {
  if (isSelected(id)) {
    tempSelected.value = tempSelected.value.filter(val => val !== id);
  } else {
    tempSelected.value.push(id);
  }
};

/** Xác nhận chọn */
const handleConfirm = () => {
  emits('confirm', props.variantType, tempSelected.value);
  emits('close');
};

/** Kiểm tra độ sáng của màu để quyết định màu chữ */
const isDarkColor = (hex: string) => {
  if (!hex || hex.length < 4) return false;

  // Chuyển mã ngắn sang dài (VD: #abc → #aabbcc)
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  // Tách r/g/b
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return false;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.5;
};
</script>

<style scoped>
.variant-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

/* Nút kích cỡ */
.variant-size-button {
  min-width: 60px;
  height: 40px;
  font-size: 14px;
}

/* Nút màu sắc */
.variant-color-button {
  height: 50px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  min-width: 100px;
}

/* Ô màu nhỏ hiển thị */
.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

/* Text trắng khi nền tối */
.text-white {
  color: white;
}
</style>
