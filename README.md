<div align="center">
  <h1>Human Bio Interactive 3D</h1>
  <p><strong>Mô phỏng tác hại của ma túy lên cơ thể người bằng mô hình 3D tương tác</strong></p>
  <p>
    <a href="#tinh-nang">Tính năng</a> -
    <a href="#tech-stack">Tech Stack</a> -
    <a href="#quick-start">Quick Start</a> -
    <a href="#kien-truc">Kiến trúc</a>
  </p>
</div>

---

## Giới Thiệu

**Human Bio Interactive 3D** là ứng dụng web mô phỏng tác động của các chất gây nghiện lên cơ thể người theo từng cơ quan và từng mốc thời gian. Dự án ưu tiên trải nghiệm trực quan: người dùng chọn chất, chọn timeline, chọn cơ quan trên model 3D hoặc thanh cơ quan phía dưới để xem chi tiết tổn thương.

Định hướng dài hạn của dự án là tiến gần trải nghiệm kiểu BioDigital Human: cơ thể trong suốt, hotspot cơ quan, layer toggle, panel chi tiết, và model `.glb` có shape key cho các giai đoạn tổn thương.

## Tính Năng

### MVP Hiện Tại

- Chọn 5 chất theo scope Plan:
  - Heroin
  - Cocaine
  - Ma túy đá (Methamphetamine)
  - Cần sa
  - Thuốc lắc (MDMA)
- Timeline 6 mốc luôn hiển thị:
  - Bắt đầu
  - 1 tuần
  - 1 tháng
  - 6 tháng
  - 1 năm
  - Dài hạn
- Chọn 6 cơ quan:
  - Tim
  - Gan
  - Não
  - Phổi
  - Hệ thần kinh
  - Da
- Model 3D primitive bằng React Three Fiber.
- Thanh chọn cơ quan dưới model với nút `Tất cả`.
- Panel chi tiết cơ quan:
  - Mức độ tổn thương
  - Phần trăm chức năng cơ quan
  - Triệu chứng
  - Mô tả y khoa
  - Nguồn tham khảo
- Empty state “Đang hoàn thiện mapping” khi chưa có dữ liệu y khoa cho tổ hợp drug x organ x stage.

### Sắp Tới

- Hoàn thiện data mapping cho đủ 5 drugs x 6 organs x 6 stages.
- Thay model primitive bằng anatomy `.glb`.
- Dùng shape key/morph target trong Blender để nhúng 6 giai đoạn vào một file `.glb`.
- Thêm layer toggle: da, nội tạng, hệ thần kinh, hệ xương, hotspot.
- Thêm detail view riêng cho từng cơ quan.
- Tối ưu hiệu năng bundle và lazy-load 3D assets.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **3D**: Three.js + React Three Fiber + Drei
- **UI**: Tailwind CSS
- **Animation**: Motion
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App mặc định chạy tại:

```text
http://localhost:3000
```

### Build

```bash
npm run build
```

Script build đang dùng `vite build --emptyOutDir=false` để tránh lỗi Windows khi có file cũ trong `dist` bị process khác giữ.

### Type Check

```bash
npm run lint
```

### Clean

```bash
npm run clean
```

Nếu Windows đang khóa file trong `dist`, script sẽ in warning nhưng không làm hỏng workflow.

## Kiến Trúc

```text
src/
├── components/
│   ├── DrugSelector.tsx         # Chọn chất gây nghiện
│   ├── HumanModel.tsx           # Model 3D primitive và hotspot cơ quan
│   ├── OrganInfoPanel.tsx       # Panel chi tiết cơ quan
│   ├── OrganSelector.tsx        # Thanh chọn cơ quan dưới model
│   ├── TimelinePanel.tsx        # Timeline 6 mốc
│   └── WarningCard.tsx          # Cảnh báo giáo dục/y tế
├── config/
│   ├── damage.ts                # Màu và nhãn damage level
│   ├── organs.ts                # Danh sách cơ quan, icon, label
│   └── timeline.ts              # Label/icon/mô tả timeline
├── data/
│   └── drugEffects.ts           # Drug x Organ x Stage mapping
├── lib/
│   └── utils.ts                 # Helper className
├── App.tsx                      # Layout và state chính
├── constants.tsx                # Initial metrics + organ info
├── index.css                    # Global styles
├── main.tsx                     # Entry point
└── types.ts                     # Type dùng chung
```

## Sơ Đồ Luồng (Flows)

Dự án đã được phân tích và bóc tách thành các sơ đồ luồng chi tiết để dễ dàng theo dõi và mở rộng. Bạn có thể xem trực tiếp các sơ đồ (sử dụng Mermaid) tại thư mục `Flows/`:

- **[User Interaction Flow](./Flows/1_User_Interaction_Flow.md):** Quy trình tương tác của người dùng từ màn hình chính, chọn chất gây nghiện, mốc thời gian và xem chi tiết cơ quan.
- **[System Data Flow](./Flows/2_System_Data_Flow.md):** Luồng xử lý dữ liệu ngầm, cách React quản lý State và truyền dữ liệu xuống model 3D cũng như UI Panel.
- **[3D Asset Pipeline Flow](./Flows/3_Asset_Pipeline_Flow.md):** Quy trình xử lý mô hình 3D từ phần mềm thiết kế (Blender) thành file `.glb` tích hợp Shape Keys (Morph Targets) và tải lên React Three Fiber.
- **[GLB Integration Guide](./Flows/glb_integration_guide.md):** Hướng dẫn chi tiết cách thay thế các hình khối cơ bản hiện tại bằng một file `.glb` thật sự.

## Data Mapping

Data y khoa nằm trong `src/data/drugEffects.ts`.

```ts
type DrugName =
  | 'heroin'
  | 'cocaine'
  | 'methamphetamine'
  | 'cannabis'
  | 'mdma';

type OrganName =
  | 'heart'
  | 'liver'
  | 'brain'
  | 'lungs'
  | 'nervous_system'
  | 'skin';

type TimelineStage =
  | 'start'
  | '1_week'
  | '1_month'
  | '6_months'
  | '1_year'
  | 'long_term';

interface DrugEffect {
  drug: DrugName;
  organ: OrganName;
  stage: TimelineStage;
  color: string;
  damageLevel: 'none' | 'mild' | 'moderate' | 'severe' | 'critical';
  functionPercent: number;
  symptoms: string[];
  description: string;
  source: string;
  sourceUrl?: string;
}
```

Hiện tại data đã có một số mapping cho Heroin, Cocaine và Methamphetamine. Cần sa, MDMA và nhiều tổ hợp cơ quan/stage vẫn đang ở trạng thái cần bổ sung dữ liệu đã kiểm chứng.

## Pipeline 3D Dự Kiến

Pipeline dài hạn:

1. Dựng model anatomy trong Blender.
2. Tách object/group theo quy ước như `Body_Skin`, `Layer_Organs`, `System_Nervous`, `System_Skeleton`.
3. Tạo shape key/morph target cho các cơ quan chính theo 6 stage.
4. Export một file `.glb` có đủ morph target.
5. React Three Fiber load `.glb` bằng Drei `useGLTF`.
6. Frontend map `drug + organ + stage` sang `morphTargetName`.
7. Khi timeline đổi, frontend set `morphTargetInfluences`.

Chi tiết kế hoạch nằm trong [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md).

## Data Sources

Dữ liệu y khoa cần được kiểm chứng từ các nguồn chính:

| Source | URL |
| --- | --- |
| NIH/NIDA | https://nida.nih.gov |
| WHO | https://www.who.int |
| CDC | https://www.cdc.gov |
| PubMed | https://pubmed.ncbi.nlm.nih.gov |

## Disclaimer

Ứng dụng này chỉ phục vụ mục đích giáo dục và mô phỏng trực quan. Nội dung không thay thế tư vấn, chẩn đoán hoặc điều trị y tế chuyên nghiệp.

## License

Apache 2.0.

## Last Updated

May 2026
