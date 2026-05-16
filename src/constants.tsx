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
    name: 'Não',
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
    name: 'Phổi',
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
  skin: {
    id: 'skin',
    name: 'Da',
    description: 'Tầng ngoài cùng bảo vệ cơ thể khỏi tác động bên ngoài.',
    functions: ['Bảo vệ', 'Điều hòa thân nhiệt', 'Cảm giác'],
    vulnerabilities: 'Ma túy đá gây lông dạ và tổn thương da trầm trọng, để lại sẹo vĩnh viễn.'
  },
  nervous_system: {
    id: 'nervous_system',
    name: 'Hệ thần kinh',
    description: 'Mạng lưới truyền tín hiệu giữa não, tủy sống và toàn bộ cơ thể.',
    functions: ['Truyền tín hiệu', 'Điều khiển vận động', 'Phản xạ', 'Cảm giác'],
    vulnerabilities: 'Các chất gây nghiện có thể làm rối loạn dẫn truyền thần kinh, giảm khả năng điều phối và gây tổn thương lâu dài.'
  }
};
