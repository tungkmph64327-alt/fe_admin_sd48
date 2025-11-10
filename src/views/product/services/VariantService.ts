// File: src/views/product/services/VariantService.ts (Giả định)

// Type cho Select Options (value: ID, label: Tên/Giá trị)
interface ISelectOption {
    value: number;
    label: string;
}

// Giả lập dữ liệu: Mã màu HTML cho COLOR, Số size cho SIZE
const DUMMY_COLORS: ISelectOption[] = [
    { value: 1, label: '#FF6347' }, // Tomato
    { value: 2, label: '#4682B4' }, // SteelBlue
    { value: 3, label: '#3CB371' }, // MediumSeaGreen
    { value: 4, label: '#FFD700' }, // Gold
    { value: 5, label: '#FA8072' }, // Salmon
    { value: 6, label: '#9370DB' }, // MediumPurple
    { value: 7, label: '#000000' }, // Black
    { value: 8, label: '#FFFFFF' }, // White
];

const DUMMY_SIZES: ISelectOption[] = [
    { value: 36, label: '36' }, { value: 37, label: '37' }, { value: 38, label: '38' }, 
    { value: 39, label: '39' }, { value: 40, label: '40' }, { value: 41, label: '41' }, 
    { value: 42, label: '42' }, { value: 43, label: '43' }, { value: 44, label: '44' },
];

const VariantService = {
    fetchColorOptions: (): Promise<ISelectOption[]> => new Promise(resolve => 
        setTimeout(() => resolve(DUMMY_COLORS), 200)
    ),
    fetchSizeOptions: (): Promise<ISelectOption[]> => new Promise(resolve => 
        setTimeout(() => resolve(DUMMY_SIZES), 200)
    ),
};

export default VariantService;