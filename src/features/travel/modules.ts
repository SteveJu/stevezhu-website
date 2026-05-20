import type { TravelModule, TravelRecord } from './types';

export const initialTravels: TravelRecord[] = [];
export const companionStorageKey = 'stevezhu_travel_companions';
export const maxAiImageBytes = 6 * 1024 * 1024;

export const travelModules: TravelModule[] = [
  {
    id: 'flight',
    label: '机票',
    icon: 'flight',
    fields: [
      { label: '出发日期', placeholder: '选择出发日期', type: 'date' },
      { label: '出发时间', placeholder: '选择出发时间', type: 'time' },
      { label: '到达日期', placeholder: '选择到达日期', type: 'date' },
      { label: '到达时间', placeholder: '选择到达时间', type: 'time' },
      { label: '出发机场', placeholder: 'EWR / LGA / JFK', datalistId: 'travel-airport-options' },
      { label: '到达机场', placeholder: '输入机场代码', datalistId: 'travel-airport-options' },
      { label: '航班号', placeholder: '例如 UA123 / DL456' },
      { label: '费用', placeholder: '机票总价', type: 'number', isCost: true },
      { label: '备注', placeholder: '行李、座位、转机注意事项', type: 'textarea' },
    ],
  },
  {
    id: 'car',
    label: '租车',
    icon: 'car',
    fields: [
      { label: '提车日期', placeholder: '选择提车日期', type: 'date' },
      { label: '提车时间', placeholder: '选择提车时间', type: 'time' },
      { label: '还车日期', placeholder: '选择还车日期', type: 'date' },
      { label: '还车时间', placeholder: '选择还车时间', type: 'time' },
      { label: '提车地点', placeholder: '机场 / 门店地址' },
      { label: '还车地点同提车地点', placeholder: '', type: 'checkbox' },
      {
        label: '还车地点',
        placeholder: '异地还车地点',
        disabledWhen: { label: '还车地点同提车地点', value: 'true' },
      },
      { label: '租车公司', placeholder: 'Hertz / Avis / Budget / Sixt / Enterprise', datalistId: 'travel-rental-company-options' },
      { label: '价格', placeholder: '租车价格', type: 'number', isCost: true },
      { label: '备注', placeholder: '保险、ETC、国际驾照、停车规则', type: 'textarea' },
    ],
  },
  {
    id: 'hotel',
    label: '酒店',
    icon: 'hotel',
    fields: [
      { label: '住宿类型', placeholder: '选择类型', type: 'select' },
      { label: '名字', placeholder: '酒店 / Airbnb 名字' },
      { label: '入住日期', placeholder: '选择入住日期', type: 'date' },
      { label: '入住时间', placeholder: '选择入住时间', type: 'time' },
      { label: '退房日期', placeholder: '选择退房日期', type: 'date' },
      { label: '退房时间', placeholder: '选择退房时间', type: 'time' },
      { label: '地点', placeholder: '完整地址或区域' },
      {
        label: 'Brand',
        placeholder: 'Marriott / Hyatt / Hilton',
        datalistId: 'travel-hotel-brand-options',
        disabledWhen: { label: '住宿类型', value: 'Airbnb' },
      },
      { label: '费用', placeholder: '住宿总价', type: 'number', isCost: true },
      { label: '备注', placeholder: '早餐、停车、寄存行李、会员权益', type: 'textarea' },
    ],
  },
  {
    id: 'restaurant',
    label: '餐厅',
    icon: 'restaurant',
    fields: [
      { label: '名字', placeholder: '餐厅 / 咖啡店 / 酒吧名称' },
      { label: '地点', placeholder: '地址或区域' },
      { label: '开始日期', placeholder: '选择开始日期', type: 'date' },
      { label: '开始时间', placeholder: '选择开始时间', type: 'time' },
      { label: 'Period', placeholder: '默认 1 小时，可改', type: 'number' },
      { label: '是否已经订位', placeholder: '', type: 'checkbox' },
      { label: '备注', placeholder: '预约号、想点的菜、营业时间、dress code', type: 'textarea' },
    ],
  },
  {
    id: 'activity',
    label: '活动',
    icon: 'activity',
    fields: [
      { label: '活动名称', placeholder: '景点 / 演出 / 展览 / 拍照点' },
      { label: '日期', placeholder: '选择日期', type: 'date' },
      { label: '时间', placeholder: '选择时间', type: 'time' },
      { label: '地点', placeholder: '地址或区域' },
      { label: '是否需要门票', placeholder: '', type: 'checkbox' },
      { label: '是否已经订票', placeholder: '', type: 'checkbox' },
      { label: '价格', placeholder: '门票或预计花费', type: 'number', isCost: true },
      { label: '备注', placeholder: '预约要求、链接、路线、拍照灵感', type: 'textarea' },
    ],
  },
];

export const travelFieldOptions: Record<string, string[]> = {
  住宿类型: ['酒店', 'Airbnb'],
};

export const travelDefaultValues: Record<TravelModule['id'], Record<string, string>> = {
  flight: {
    出发机场: 'EWR',
  },
  car: {
    还车地点同提车地点: 'true',
    租车公司: 'Hertz',
  },
  hotel: {
    住宿类型: '酒店',
    Brand: 'Marriott',
  },
  restaurant: {
    Period: '1',
  },
  activity: {
    是否需要门票: 'false',
    是否已经订票: 'false',
  },
};

export const travelDateFields: Record<TravelModule['id'], string> = {
  flight: '出发日期',
  car: '提车日期',
  hotel: '入住日期',
  restaurant: '开始日期',
  activity: '日期',
};

export const travelTimeFields: Record<TravelModule['id'], string> = {
  flight: '出发时间',
  car: '提车时间',
  hotel: '入住时间',
  restaurant: '开始时间',
  activity: '时间',
};

const airportOptions = ['EWR', 'LGA', 'JFK', 'SFO', 'LAX', 'ORD', 'ATL', 'DFW', 'SEA', 'BOS'];
const rentalCompanyOptions = ['Hertz', 'Avis', 'Budget', 'Sixt', 'Enterprise', 'National', 'Alamo'];
const hotelBrandOptions = ['Marriott', 'Hyatt', 'Hilton', 'IHG', 'Accor', 'Four Seasons', 'Aman'];

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2).toString().padStart(2, '0');
  const minute = index % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

const datalistOptions: Record<string, string[]> = {
  'travel-airport-options': airportOptions,
  'travel-rental-company-options': rentalCompanyOptions,
  'travel-hotel-brand-options': hotelBrandOptions,
};

export const travelDatalists = [
  { id: 'travel-time-options', options: timeOptions },
  ...Object.entries(datalistOptions).map(([id, options]) => ({ id, options })),
];

export const getModule = (moduleId: TravelModule['id']) => {
  return travelModules.find((travelModule) => travelModule.id === moduleId) ?? travelModules[0];
};
