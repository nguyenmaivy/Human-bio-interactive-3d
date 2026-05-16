# PROJECT ANALYSIS - Human Bio Interactive 3D

## 1. Tổng Quan Dự Án

**Human Bio Interactive 3D** là một ứng dụng web mô phỏng tác hại của ma túy lên cơ thể người bằng mô hình 3D tương tác. Người dùng có thể chọn loại ma túy, chọn mốc thời gian, click vào từng cơ quan và xem mức độ tổn thương tương ứng.

Mục tiêu của dự án là biến các kiến thức y khoa vốn khó hình dung thành trải nghiệm trực quan, dễ hiểu và có tính giáo dục.

### Mục Tiêu Hệ Thống

- Giáo dục người dùng về tác hại của ma túy bằng mô hình 3D.
- Hiển thị ảnh hưởng của từng loại ma túy lên các cơ quan trong cơ thể.
- Mô phỏng sự thay đổi theo thời gian: bắt đầu, 1 tuần, 1 tháng, 6 tháng, 1 năm, nghiện dài hạn.
- Kết hợp mô hình 3D, màu sắc tổn thương, chỉ số chức năng cơ quan, triệu chứng và nguồn tài liệu y khoa.
- Xây dựng nền tảng có thể phát triển theo hướng giống BioDigital Human: cơ thể trong suốt, nội tạng có hotspot, xem theo layer và xem chi tiết từng cơ quan.

### Bài Toán Cần Giải Quyết

Thông tin về tác hại của ma túy thường khó tiếp cận nếu chỉ trình bày bằng văn bản. Dự án này giải quyết bằng cách chuyển dữ liệu y khoa thành trải nghiệm 3D:

- Người dùng chọn loại ma túy.
- Hệ thống hiển thị các cơ quan bị ảnh hưởng.
- Người dùng chọn mốc thời gian để thấy mức độ tổn thương thay đổi.
- Mỗi cơ quan có mô tả, triệu chứng, phần trăm chức năng còn lại và nguồn tham khảo.

### Đối Tượng Người Dùng

- Học sinh, sinh viên cần học về tác hại của chất gây nghiện.
- Giáo viên, người thuyết trình, tổ chức giáo dục sức khỏe.
- Người dùng phổ thông muốn hiểu trực quan tác hại của ma túy lên cơ thể.
- Nhóm phát triển cần tài liệu định hướng để hoàn thiện MVP.

### Giá Trị Cốt Lõi

- **Trực quan:** dùng 3D để mô tả tác hại thay vì chỉ dùng chữ.
- **Tương tác:** người dùng chủ động chọn ma túy, timeline và cơ quan.
- **Có căn cứ:** nội dung dựa trên NIH/NIDA, WHO, CDC, PubMed.
- **Mở rộng được:** có thể nâng cấp từ model primitive sang GLB anatomy model, thêm backend, database và hệ thống quản lý nội dung sau này.

## 2. Ý Tưởng Sản Phẩm

Sản phẩm là một dashboard 3D về cơ thể người. Trung tâm màn hình là mô hình cơ thể trong suốt, hiển thị các cơ quan bên trong. Người dùng chọn loại ma túy, chọn mốc thời gian và click vào cơ quan để xem tác động.

### Tính Năng Chính

- Chọn chất kích thích theo Plan: heroin, cocaine, methamphetamine, cần sa, MDMA.
- Xem timeline 6 mốc: bắt đầu, 1 tuần, 1 tháng, 6 tháng, 1 năm, nghiện dài hạn.
- Xoay, zoom và quan sát mô hình 3D.
- Click vào cơ quan để xem thông tin chi tiết.
- Hiển thị mức độ tổn thương, phần trăm chức năng còn lại, triệu chứng, mô tả y khoa và nguồn tài liệu.
- Dùng màu sắc, animation và hiệu ứng visual để truyền tải mức độ tổn thương.

### Định Hướng Giống BioDigital Human

BioDigital Human có thế mạnh ở mô hình anatomy, layer, hotspot và mô tả theo từng bộ phận. Dự án nên học theo các nguyên tắc đó:

- Cơ thể người trong suốt để thấy nội tạng.
- Mỗi cơ quan có hotspot click được.
- Có layer toggle: da, nội tạng, hệ thần kinh, hệ xương.
- Có màn hình hoặc panel chi tiết cho từng cơ quan.
- Có timeline morph hoặc thay đổi texture theo mức độ tổn thương.
- Có quy ước đặt tên rõ ràng trong file GLB để frontend điều khiển object.

### Màn Hình Mục Tiêu Theo Mockup

Trang chính nên được tổ chức giống mockup trong thư mục `Plan`:

- Bên trái: danh sách 5 chất kích thích gồm Heroin, Cocaine, Ma túy đá, Cần sa, Thuốc lắc.
- Trung tâm: mô hình người 3D toàn thân, có da trong suốt và các cơ quan/hệ bên trong.
- Trên model: hotspot hoặc label cho các vùng bị ảnh hưởng như tổn thương não bộ, hệ thần kinh, suy tim, suy gan, hệ xương.
- Bên phải: tiến trình thời gian sử dụng với 6 mốc.
- Dưới cùng: toolbar gồm xem theo lớp, phóng to, thu nhỏ, xoay, chi tiết, so sánh.

Flow chính của màn hình:

1. Người dùng chọn một chất kích thích ở panel trái.
2. Người dùng chọn một mốc thời gian ở timeline bên phải.
3. Frontend lấy `drug + stage` để xác định mức morph/shape key cần áp dụng cho model.
4. Model 3D đổi hình dạng, màu sắc hoặc texture theo giai đoạn tổn thương.
5. Người dùng bật/tắt layer bằng toolbar.
6. Người dùng click vào một cơ quan hoặc hotspot.
7. Panel chi tiết mở ra, hiển thị thông tin y khoa, mức độ tổn thương, triệu chứng, nguồn và biểu đồ theo 6 mốc.

## 3. Scope Theo Plan Và Trạng Thái Hiện Tại

Plan trong thư mục `Plan` được xem là định hướng sản phẩm đúng hơn: 5 loại ma túy, 6 cơ quan, 6 mốc thời gian, dashboard 3D, hotspot và roadmap 4 tuần. Điểm thay đổi chính so với Plan gốc là dự án không dùng Flutter. Thay vào đó, dự án triển khai bằng web stack hiện tại: **React + Vite + TypeScript + Three.js/React Three Fiber**.

### Chất Kích Thích Theo Scope Plan

- `heroin`: Heroin
- `cocaine`: Cocaine
- `methamphetamine`: Ma túy đá (Meth)
- `cannabis`: Cần sa
- `mdma`: Thuốc lắc (MDMA)

Code nên nhận diện đủ 5 loại theo Plan. Tuy nhiên, dữ liệu y khoa không nên được tự suy diễn. Những loại hoặc cơ quan chưa có mapping cần hiển thị trạng thái **đang hoàn thiện mapping** cho đến khi có nội dung đã cross-check với nguồn y khoa.

### Timeline

Hệ thống dùng 6 mốc thời gian:

- `start`: Bắt đầu
- `1_week`: 1 tuần
- `1_month`: 1 tháng
- `6_months`: 6 tháng
- `1_year`: 1 năm
- `long_term`: Nghiện dài hạn

### Cơ Quan

Code hiện tại khai báo đúng 6 cơ quan theo scope bạn chốt:

- `heart`: tim
- `liver`: gan
- `brain`: não
- `lungs`: phổi
- `nervous_system`: hệ thần kinh
- `skin`: da

Hệ xương vẫn có thể là layer toggle trong GLB sau này, nhưng chưa được xem là cơ quan chính trong data mapping hiện tại.

### Khoảng Trống Hiện Tại

- Chưa có đầy đủ mapping cho tất cả tổ hợp `drug x organ x stage`.
- Primitive 3D model mới là bản demo, chưa phải anatomy GLB model thật.
- Hệ thần kinh mới có object demo trong `HumanModel.tsx`, chưa có mapping y khoa riêng trong `drugEffects.ts`.
- Cần sa và MDMA đã nằm trong scope code, nhưng cần bổ sung mapping y khoa đã kiểm chứng trong `drugEffects.ts`.
- Chưa có backend, database, upload GLB hoặc admin để quản lý dữ liệu.

## 4. Kiến Trúc Hệ Thống Hiện Tại

### Tech Stack Đang Dùng

- React 19
- Vite
- TypeScript
- Three.js
- React Three Fiber
- Drei
- Tailwind CSS
- Motion
- Lucide React

### Kiến Trúc Frontend

Ứng dụng hiện tại lấy React làm trung tâm. Data được import trực tiếp từ file local, state được quản lý trong `App.tsx`, model 3D nằm trong component riêng.

Flow chính:

1. `App.tsx` giữ state `activeDrug`, `activeStage`, `selectedOrgan`.
2. Khi user chọn drug và organ, app gọi `getEffect(drug, organ, stage)`.
3. Data trả về từ `src/data/drugEffects.ts`.
4. `HumanModel.tsx` cập nhật màu sắc, health và hiệu ứng 3D.
5. `OrganInfoPanel` hiển thị mô tả, triệu chứng, mức tổn thương và nguồn.

### Các Module Quan Trọng

- `src/App.tsx`: màn hình chính, state và layout tổng.
- `src/data/drugEffects.ts`: data mapping tác hại của ma túy.
- `src/components/HumanModel.tsx`: model 3D primitive và hotspot cơ quan.
- `src/components/DrugSelector.tsx`: chọn chất kích thích.
- `src/components/TimelinePanel.tsx`: chọn mốc thời gian.
- `src/components/OrganSelector.tsx`: thanh chọn cơ quan phía dưới model.
- `src/components/OrganInfoPanel.tsx`: hiển thị chi tiết tác động lên cơ quan.
- `src/config/organs.ts`: cấu hình dùng chung cho tên, icon và thứ tự cơ quan.
- `src/config/timeline.ts`: cấu hình dùng chung cho label, icon và mô tả 6 mốc thời gian.
- `src/config/damage.ts`: cấu hình màu và nhãn mức độ tổn thương.
- `src/constants.tsx`: chỉ số sinh học ban đầu và thông tin mô tả cơ quan.

### Thành Phần Chưa Có

- Chưa có backend FastAPI.
- Chưa có Supabase schema.
- Chưa có Cloudflare R2 để host GLB.
- Chưa có GLB anatomy model production.
- Chưa có API endpoint.
- Chưa có layer toggle thật cho GLB vì hiện vẫn dùng model primitive.

Các phần này nên để sang phase sau. Trước mắt nên hoàn thiện MVP trên nền React hiện có.

## 5. Flow Hoạt Động Sản Phẩm

### Flow Người Dùng

1. Người dùng mở ứng dụng.
2. Hệ thống hiển thị model cơ thể người 3D và warning card.
3. Người dùng chọn một chất kích thích.
4. Timeline 6 mốc xuất hiện.
5. Người dùng chọn mốc thời gian.
6. Người dùng click vào cơ quan trên model.
7. Hệ thống tìm effect theo `drug + organ + stage`.
8. UI cập nhật:
   - Màu cơ quan
   - Mức chức năng còn lại
   - Mức độ tổn thương
   - Triệu chứng
   - Mô tả y khoa
   - Nguồn tham khảo

### Flow Data

```text
User selection
  -> activeDrug + activeStage + selectedOrgan
  -> getEffect(drug, organ, stage)
  -> DrugEffect
  -> HumanModel + OrganInfoPanel + metric overlay
```

### Flow 3D Với Shape Key

Khi đã có file `.glb` từ Blender, flow 3D nên là:

```text
activeDrug + activeStage
  -> tìm morph target tương ứng
  -> set morphTargetInfluences trên mesh/cơ quan trong GLB
  -> đổi màu/texture theo damageLevel
  -> giữ layer visibility theo layer toggle
```

Ví dụ:

- Chọn `heroin` + `1_month` -> não dùng shape key tổn thương giai đoạn 1 tháng.
- Chọn `cocaine` + `6_months` -> tim dùng shape key phì đại/suy tim giai đoạn 6 tháng.
- Chọn `methamphetamine` + `long_term` -> da và não dùng shape key hoặc material tổn thương dài hạn.

Không nên tạo 6 file `.glb` riêng cho 6 giai đoạn nếu có thể dùng shape key. Mục tiêu tốt hơn là nhúng đủ 6 giai đoạn vào cùng một file `.glb` để frontend chỉ cần điều khiển morph target.

### Flow Khi Chưa Có Data

Nếu chưa tìm thấy `DrugEffect`, app không nên im lặng hoặc ẩn panel. Trạng thái đúng là:

- Hiển thị thông báo “Đang hoàn thiện mapping”.
- Cho biết tổ hợp drug, organ và stage nào đang thiếu dữ liệu.
- Nhắc rằng phần này cần được bổ sung sau khi cross-check với NIH/NIDA, WHO, CDC hoặc PubMed.

## 6. Data Model Đề Xuất

Nên tiếp tục giữ cấu trúc `DrugEffect` vì phù hợp với MVP hiện tại.

```ts
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

### Nguyên Tắc Chuẩn Hóa Data

- Mỗi record phải có đủ `drug`, `organ`, `stage`.
- `functionPercent` nằm trong khoảng 0-100.
- `damageLevel` nên khớp tương đối với `functionPercent`:
  - `none`: 90-100
  - `mild`: 80-89
  - `moderate`: 60-79
  - `severe`: 40-59
  - `critical`: 0-39
- `description` nên ngắn gọn, dễ hiển thị trong card.
- `symptoms` nên có khoảng 3-5 item.
- `source` và `sourceUrl` nên có cho các dữ liệu y khoa quan trọng.

### Mapping Cần Hoàn Thiện

Mục tiêu đầy đủ theo Plan:

```text
5 drugs x 6 organs x 6 stages = 180 records
```

Nên chia nhỏ:

1. Hoàn thiện dữ liệu cho 3 chất đã có nội dung ban đầu: heroin, cocaine, methamphetamine.
2. Bổ sung mapping cho cần sa và MDMA.
3. Sau khi UI ổn định, bổ sung đầy đủ các cơ quan và stage còn thiếu.

## 7. Roadmap Hoàn Thiện 4 Tuần

Roadmap này chuyển hóa từ file `Plan/Tasks_1_month_v3.xlsx`, nhưng đã điều chỉnh theo code hiện tại React + Vite thay vì Flutter + FastAPI.

### Tuần 1 - Chuẩn Hóa Scope Và Data

Mục tiêu: app có data nhất quán, đúng nguồn và đủ để demo flow chính.

- Chốt scope theo Plan: 5 loại ma túy, 6 cơ quan, 6 mốc thời gian.
- Kiểm tra lại `drugEffects.ts`.
- Hoàn thiện mapping còn thiếu cho heroin, cocaine, methamphetamine.
- Bổ sung mapping cho cần sa và MDMA sau khi có nguồn đáng tin cậy.
- Chuẩn hóa tên stage và tên organ.
- Hiển thị empty state khi chưa có data.
- Cross-check mô tả y khoa với NIH/NIDA, WHO, CDC, PubMed.
- Tạo checklist nguồn cho từng drug.

Deliverable:

- Data mapping rõ ràng hơn.
- App không bị panel rỗng khó hiểu khi user click organ chưa có data.
- Nội dung y khoa có source rõ ràng.

### Tuần 2 - Cải Thiện UI/UX Và Interaction

Mục tiêu: dashboard dễ dùng, rõ trạng thái và có cảm giác giống sản phẩm thật.

- Cải thiện Drug Selector cho đủ 5 loại.
- Cải thiện Timeline Panel: stage đang chọn rõ hơn, màu đi từ nhẹ đến nặng.
- Highlight cơ quan có data khi user chọn drug.
- Thêm tooltip hoặc visual hint cho hotspot.
- Responsive cho màn hình nhỏ.
- Thêm empty/loading states.
- Chuẩn hóa màu damage level và health bar.

Deliverable:

- UI rõ ràng hơn.
- Người dùng biết nên click vào đâu.
- Timeline và damage state nhất quán.

### Tuần 3 - Nâng Cấp 3D Pipeline

Mục tiêu: tiến từ primitive geometry sang anatomy model có khả năng mở rộng.

- Tìm GLB body/anatomy model có license rõ ràng.
- Đặt naming convention cho object:
  - `Organ_Brain`
  - `Organ_Heart`
  - `Organ_Liver`
  - `Organ_Lung`
  - `Organ_Kidney`
  - `Body_Skin`
  - `System_Nervous`
- Load GLB bằng Drei `useGLTF`.
- Map object trong GLB với `OrganName`.
- Hỗ trợ transparent skin material.
- Hỗ trợ hotspot position theo object hoặc config.
- Thử nghiệm texture/màu theo `damageLevel`.
- Tạo shape key trong Blender cho các cơ quan chính, nhúng đủ 6 giai đoạn vào cùng một file `.glb`.
- Đảm bảo frontend có thể điều khiển shape key theo `activeDrug + activeStage`.

Deliverable:

- Có bản demo GLB thay cho primitive model hoặc chạy song song với primitive fallback.
- Có convention để Blender và frontend làm việc chung.
- Có ít nhất một cơ quan dùng shape key thật để chứng minh pipeline Blender -> GLB -> React Three Fiber hoạt động.

### Tuần 4 - QA, Performance Và Production

Mục tiêu: có bản demo ổn định, có thể deploy và thuyết trình.

- Chạy `npm run build`.
- Chạy `npm run lint`.
- Test flow: chọn drug -> chọn stage -> click organ -> đọc chi tiết.
- Test trên Chrome, Firefox và mobile width 375px.
- Kiểm tra text UI không bị tràn.
- Kiểm tra FPS khi xoay model.
- Review nội dung y khoa lần cuối.
- Deploy lên Vercel hoặc hosting tương đương.

Deliverable:

- Bản demo production-ready.
- Tài liệu và data đủ để tiếp tục mở rộng.

## 8. Hướng Phát Triển Giống BioDigital Human

### Phase 1 - Transparent Body Và Hotspot

- Body có opacity thấp.
- Các cơ quan bên trong có màu riêng.
- Mỗi cơ quan click được.
- Có label gắn với hotspot.

### Phase 2 - Layer System

Thêm bottom action bar hoặc toolbar:

- Toggle da.
- Toggle nội tạng.
- Toggle hệ thần kinh.
- Toggle hệ xương.
- Reset camera.
- Zoom in/out.
- Compare mode.

Layer toggle nên điều khiển trực tiếp visibility của các object/group trong GLB:

- `Body_Skin`: lớp da trong suốt.
- `Layer_Organs`: nhóm nội tạng.
- `System_Nervous`: hệ thần kinh.
- `System_Skeleton`: hệ xương.
- `Hotspots`: nhãn và điểm click.

Khi người dùng bật/tắt layer, frontend chỉ thay đổi `visible` hoặc `opacity` của group tương ứng. Không nên reload model.

### Phase 3 - Organ Detail View

Khi click cơ quan:

- Mở panel hoặc route chi tiết.
- Hiển thị model riêng của cơ quan.
- Hiển thị timeline damage của riêng cơ quan đó.
- Hiển thị biểu đồ function percent theo 6 mốc.
- Hiển thị sources và disclaimer.

### Phase 4 - Morph/Texture Theo Stage

Kỹ thuật lõi nên dùng là **shape key trong một file `.glb`**. Mỗi cơ quan chính có các morph target tương ứng 6 giai đoạn:

- `Stage_0_Start`
- `Stage_1_OneWeek`
- `Stage_2_OneMonth`
- `Stage_3_SixMonths`
- `Stage_4_OneYear`
- `Stage_5_LongTerm`

Quy ước shape key nên gắn với từng cơ quan để frontend dễ map:

- `Brain_Heroin_Stage_0_Start`
- `Brain_Heroin_Stage_1_OneWeek`
- `Brain_Heroin_Stage_2_OneMonth`
- `Heart_Cocaine_Stage_3_SixMonths`
- `Skin_Meth_Stage_5_LongTerm`

Frontend không cần biết chi tiết Blender. Frontend chỉ cần một bảng mapping:

```ts
{
  drug: 'heroin',
  organ: 'brain',
  stage: '1_month',
  morphTargetName: 'Brain_Heroin_Stage_2_OneMonth'
}
```

Khi timeline đổi, React Three Fiber tìm morph target theo `morphTargetDictionary` và set `morphTargetInfluences[index]` về `1`. Các morph target khác của cùng cơ quan được đưa về `0`.

Material/texture vẫn có thể dùng kèm shape key để tăng độ trực quan:

- Shape key: thay đổi hình dạng, độ teo, phì đại, biến dạng.
- Material/texture: thay đổi màu sắc, vết tổn thương, vùng xỉn màu, sẹo, viêm.

Nếu chưa đủ thời gian làm shape key cho tất cả cơ quan, MVP nên làm trước:

1. Não cho Heroin.
2. Tim cho Cocaine.
3. Da hoặc não cho Methamphetamine.

## 9. Cách Dùng Plan Gốc Với Web Stack Hiện Tại

File `Plan/Tasks_1_month_v3.xlsx` có định hướng:

- Flutter Web cho frontend.
- FastAPI cho backend.
- Supabase làm database.
- Cloudflare R2 để host GLB.
- Railway để deploy backend.
- Vercel để deploy frontend.

Hướng triển khai trong repo này đã điều chỉnh thành:

- React + Vite cho frontend.
- React Three Fiber để render 3D.
- Data local trong TypeScript ở giai đoạn MVP.
- Config dùng chung nằm trong `src/config` để dễ tái sử dụng, mở rộng và bảo trì.
- Backend, Supabase và R2 là phase sau, chỉ thêm khi cần quản lý data hoặc GLB thật.

Không đổi sang Flutter ở giai đoạn này. Giữ React + Vite vì:

- Code hiện tại đã có app chạy được.
- React Three Fiber phù hợp với Three.js và WebGL.
- Dễ load GLB, control camera, material và hotspot.
- Giảm rủi ro rewrite.

Backend nên để sau khi:

- Data mapping đã lớn.
- Cần admin/CMS để sửa nội dung.
- Cần upload và quản lý GLB assets.
- Cần API public cho nhiều client.

## 10. Checklist Tiếp Theo

### Data

- [ ] Hoàn thiện data cho heroin.
- [ ] Hoàn thiện data cho cocaine.
- [ ] Hoàn thiện data cho methamphetamine.
- [ ] Bổ sung data cho cần sa.
- [ ] Bổ sung data cho MDMA.
- [ ] Đảm bảo mỗi record có source URL.
- [ ] Tạo bảng kiểm tra `drug x organ x stage`.

### UI/UX

- [ ] Thêm empty state khi chưa có data.
- [ ] Highlight cơ quan có data.
- [ ] Chuẩn hóa màu damage level.
- [ ] Cải thiện responsive mobile.
- [ ] Thêm bottom action bar.
- [ ] Thêm compare mode sau MVP.

### 3D

- [ ] Tìm GLB anatomy model có license rõ ràng.
- [ ] Đặt object naming convention.
- [ ] Load GLB bằng React Three Fiber.
- [ ] Thêm transparent body material.
- [ ] Thêm hotspot theo coordinate.
- [ ] Tạo shape key 6 giai đoạn trong Blender cho ít nhất một cơ quan.
- [ ] Export một file `.glb` có morph target hoạt động.
- [ ] Map `drug + organ + stage` sang `morphTargetName`.
- [ ] Điều khiển `morphTargetInfluences` trong React Three Fiber.
- [ ] Thử nghiệm texture/material theo stage.
- [ ] Thêm layer toggle cho da, nội tạng, hệ thần kinh, hệ xương và hotspot.

### Engineering

- [ ] Chạy `npm run lint`.
- [ ] Chạy `npm run build`.
- [ ] Fix TypeScript errors nếu có.
- [ ] Kiểm tra performance với model 3D.
- [ ] Giữ các cấu hình dùng chung trong `src/config` thay vì hard-code rải rác trong component.
- [ ] Chuẩn bị deploy.

### Documentation

- [ ] Cập nhật README sau khi MVP ổn định.
- [ ] Ghi lại nguồn y khoa cho từng drug.
- [ ] Ghi lại quy ước Blender/GLB.
- [ ] Ghi lại cách thêm drug mới.

## 11. Kết Luận

Dự án đã có nền tảng tốt: app React chạy được, có data mapping ban đầu, có model 3D primitive, có UI chọn drug/timeline/cơ quan và có plan 4 tuần trong thư mục `Plan`.

Hướng đi hợp lý nhất là không rewrite sang Flutter/FastAPI ngay, mà hoàn thiện MVP trên stack hiện tại. Sau khi data, UI và 3D pipeline ổn định, có thể tách data ra backend và thêm asset hosting cho GLB.

Mục tiêu ngắn hạn:

1. Làm data đúng và đủ.
2. Làm UI rõ và dễ demo.
3. Nâng cấp 3D model từ primitive sang GLB.
4. Kiểm chứng nội dung y khoa.
5. Deploy bản web demo ổn định.
