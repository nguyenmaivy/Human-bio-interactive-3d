import { TimelineStage } from '../data/drugEffects';

export interface TimelineStageMeta {
  id: TimelineStage;
  label: string;
  icon: string;
  description: string;
}

export const TIMELINE_STAGE_META: Record<TimelineStage, TimelineStageMeta> = {
  start: {
    id: 'start',
    label: 'Bắt đầu',
    icon: '📍',
    description: 'Mới bắt đầu sử dụng'
  },
  '1_week': {
    id: '1_week',
    label: '1 tuần',
    icon: '📅',
    description: 'Cơ thể bắt đầu phụ thuộc'
  },
  '1_month': {
    id: '1_month',
    label: '1 tháng',
    icon: '📆',
    description: 'Tổn thương nhẹ xuất hiện'
  },
  '6_months': {
    id: '6_months',
    label: '6 tháng',
    icon: '📊',
    description: 'Tổn thương rõ rệt'
  },
  '1_year': {
    id: '1_year',
    label: '1 năm',
    icon: '📈',
    description: 'Suy chức năng nghiêm trọng'
  },
  long_term: {
    id: 'long_term',
    label: 'Dài hạn',
    icon: '⚠️',
    description: 'Tổn thương khó hồi phục'
  }
};

export function getTimelineLabel(stage: TimelineStage): string {
  return TIMELINE_STAGE_META[stage].label;
}
