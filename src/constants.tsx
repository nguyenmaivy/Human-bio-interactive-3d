import { SubstanceEffect } from '../types';

export const SUBSTANCES: SubstanceEffect[] = [
  {
    id: 'food',
    name: 'Thức ăn (Glucose)',
    description: 'Chuyển hóa năng lượng bình thường.',
    category: 'stimulant',
    biologicalProcess: 'Quá trình tiêu hóa và hấp thụ đường vào máu.',
    peakTime: 30 * 60, // 30 mins
    duration: 120 * 60, // 2 hours
    metricsDelta: {
      heartRate: 5,
      dopamineLevel: 10,
      temperature: 0.2
    },
    chronicDamageRate: 0.00001
  },
  {
    id: 'meth',
    name: 'Ma túy đá (Methamphetamine)',
    description: 'Kích thích cực mạnh hệ thần kinh trung ương.',
    category: 'stimulant',
    biologicalProcess: 'Giải phóng ồ ạt Dopamine, gây co mạch và tăng nhịp tim cấp tính.',
    peakTime: 15 * 60, // 15 mins
    duration: 12 * 60 * 60, // 12 hours
    metricsDelta: {
      heartRate: 60,
      bloodPressure: { systolic: 40, diastolic: 25 },
      dopamineLevel: 90,
      toxinLevel: 40,
      respirationRate: 15,
      temperature: 2.5
    },
    chronicDamageRate: 0.002 // Fast degradation
  },
  {
    id: 'heroine',
    name: 'Heroin',
    description: 'Ức chế hệ thần kinh trung ương và hô hấp.',
    category: 'depressant',
    biologicalProcess: 'Gắn vào thụ thể opioid, làm chậm nhịp thở và gây mê man.',
    peakTime: 5 * 60, // 5 mins
    duration: 4 * 60 * 60, // 4 hours
    metricsDelta: {
      heartRate: -20,
      bloodPressure: { systolic: -20, diastolic: -15 },
      dopamineLevel: 80, // False sense of pleasure
      toxinLevel: 30,
      respirationRate: -10,
      temperature: -1.0
    },
    chronicDamageRate: 0.0005
  },
  {
    id: 'mdma',
    name: 'Thuốc lắc (MDMA/Ecstasy)',
    description: 'Tăng cảm giác thân mật và kích động.',
    category: 'hallucinogen',
    biologicalProcess: 'Tăng vọt Serotonin và Dopamine, gây mất nước và tăng thân nhiệt.',
    peakTime: 45 * 60, // 45 mins
    duration: 6 * 60 * 60, // 6 hours
    metricsDelta: {
      heartRate: 30,
      bloodPressure: { systolic: 20, diastolic: 10 },
      dopamineLevel: 70,
      toxinLevel: 25,
      respirationRate: 8,
      temperature: 3.0
    },
    chronicDamageRate: 0.0008
  }
];

export const INITIAL_METRICS = {
  heartRate: 72,
  bloodPressure: { systolic: 120, diastolic: 80 },
  dopamineLevel: 10,
  toxinLevel: 0,
  respirationRate: 16,
  temperature: 36.6,
  organHealth: 100
};

import { OrganData, OrganType } from './types';

export const ORGAN_INFO: Record<OrganType, OrganData> = {
  brain: {
    id: 'brain',
    name: 'Bộ não (Cortex)',
    description: 'Trung tâm điều khiển của cơ thể, xử lý thông tin và cảm xúc.',
    functions: ['Suy nghĩ', 'Vận động', 'Cảm xúc', 'Điều khiển nhịp sinh học'],
    vulnerabilities: 'Rất nhạy cảm với sự thay đổi Dopamine và thiếu oxy. Ma túy có thể làm thay đổi cấu trúc neural vĩnh viễn.'
  },
  heart: {
    id: 'heart',
    name: 'Trái tim',
    description: 'Máy bơm máu chính, cung cấp oxy và dưỡng chất cho toàn cơ thể.',
    functions: ['Bơm máu', 'Duy trì huyết áp', 'Lưu thông hormone'],
    vulnerabilities: 'Áp lực nhịp tim cao kéo dài (do chất kích thích) gây suy tim và đột quỵ.'
  },
  lungs: {
    id: 'lungs',
    name: 'Hệ hô hấp (Phổi)',
    description: 'Nơi trao đổi khí, cung cấp oxy vào máu và thải CO2.',
    functions: ['Trao đổi khí', 'Duy trì pH máu', 'Lọc bụi bẩn'],
    vulnerabilities: 'Chất ức chế làm chậm nhịp thở đến mức ngừng thở (Heroin).'
  },
  liver: {
    id: 'liver',
    name: 'Gan',
    description: 'Nhà máy hóa chất lớn nhất cơ thể, có nhiệm vụ thải độc.',
    functions: ['Khử độc', 'Tổng hợp protein', 'Dự trữ năng lượng'],
    vulnerabilities: 'Quá tải độc tố dẫn đến xơ gan và suy gan cấp tính.'
  },
  stomach: {
    id: 'stomach',
    name: 'Hệ tiêu hóa',
    description: 'Nơi xử lý thức ăn và hấp thụ dinh dưỡng ban đầu.',
    functions: ['Tiêu hóa', 'Hấp thụ trung gian', 'Miễn dịch'],
    vulnerabilities: 'Nhiều loại thuốc gây co thắt dạ dày và tổn thương niêm mạc.'
  },
  kidneys: {
    id: 'kidneys',
    name: 'Thận',
    description: 'Lọc máu và cân bằng nước/điện giải.',
    functions: ['Lọc máu', 'Sản xuất nước tiểu', 'Điều hòa huyết áp'],
    vulnerabilities: 'Mất nước cực độ (do MDMA) có thể gây suy thận cấp.'
  }
};
