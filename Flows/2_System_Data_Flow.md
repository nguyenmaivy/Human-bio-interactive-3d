# System Data Processing Flow - Human Bio Interactive 3D

Biểu đồ này mô tả cách luồng dữ liệu (Data Flow) chạy ngầm bên dưới ứng dụng, từ thao tác của người dùng đến khi phản hồi lại trên màn hình. Được trích xuất từ cấu trúc React + Vite trong `PROJECT_ANALYSIS.md`.

```mermaid
graph TD
    classDef state fill:#e2e3e5,stroke:#383d41,stroke-width:2px,color:#000
    classDef logic fill:#d1ecf1,stroke:#17a2b8,stroke-width:2px,color:#000
    classDef data fill:#c3e6cb,stroke:#28a745,stroke-width:2px,color:#000
    classDef render fill:#f8d7da,stroke:#dc3545,stroke-width:2px,color:#000

    A((User Input)) --> B1[State: activeDrug]:::state
    A --> B2[State: activeStage]:::state
    A --> B3[State: selectedOrgan]:::state

    B1 --> C{"Hàm xử lý:<br>getEffect(drug, organ, stage)"}:::logic
    B2 --> C
    B3 --> C

    C --> D[("Data Store:<br>src/data/drugEffects.ts")]:::data
    
    D -- "Tìm thấy DrugEffect" --> E1["Trả về Object:<br>- color<br>- damageLevel<br>- functionPercent<br>- symptoms"]:::data
    D -- "Chưa có Mapping" --> E2["Trả về trạng thái:<br>Đang hoàn thiện dữ liệu"]:::data

    E1 --> F1(Cập nhật HumanModel.tsx):::render
    E1 --> F2(Cập nhật OrganInfoPanel.tsx):::render

    E2 --> F3(Hiển thị Empty State / Thông báo):::render

    F1 --> G1["React Three Fiber Render:<br>- Đổi màu material<br>- Cập nhật morphTargetInfluences<br>- Kích hoạt animation (nhịp đập)"]:::render
    
    F2 --> G2["DOM Render:<br>- Chữ mô tả<br>- Biểu đồ Health<br>- Link tham khảo"]:::render
```

### Giải thích:
- Kiến trúc đi theo hướng **Unidirectional Data Flow** của React.
- Mọi tương tác làm thay đổi State trung tâm (`App.tsx`).
- Việc lấy dữ liệu hoàn toàn tĩnh (local file `drugEffects.ts`), giúp tăng tốc độ tải mà không cần Backend ở giai đoạn MVP.
- Thành phần Render được chia làm 2 mảnh rõ rệt: **3D Canvas (React Three Fiber)** và **HTML DOM (UI Panel)**.
