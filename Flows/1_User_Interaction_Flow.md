# User Interaction Flow - Human Bio Interactive 3D

Dựa trên cấu trúc của file `PROJECT_ANALYSIS.md` và giao diện tham khảo từ các file PPTX (UI 3D WEB), đây là luồng tương tác màn hình chính của người dùng (tương tự như cấu trúc mindmap bạn đã cung cấp).

```mermaid
graph TD
    %% Define Styles
    classDef mainScreen fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#000
    classDef panel fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#000
    classDef interaction fill:#cce5ff,stroke:#007bff,stroke-width:2px,color:#000
    classDef result fill:#f8d7da,stroke:#dc3545,stroke-width:2px,color:#000

    %% Nodes
    A[Mở Ứng Dụng / Web Browser]:::mainScreen
    B[Dashboard Screen\nHiển thị Cơ Thể Người 3D & Warning Card]:::mainScreen
    
    C1[Bảng Chọn Chất Kích Thích\nPanel Bên Trái]:::panel
    C2[Mô Hình 3D Toàn Thân\nTrung Tâm]:::panel
    C3[Thanh Công Cụ / Chọn Cơ Quan\nPanel Bên Dưới]:::panel

    D1(Chọn Heroin):::interaction
    D2(Chọn Cocaine):::interaction
    D3(Chọn Meth):::interaction
    D4(Chọn Cần sa / MDMA):::interaction

    E[Hiển thị Timeline 6 mốc\nPanel Bên Phải]:::panel

    F1(Bắt Đầu):::interaction
    F2(1 Tuần):::interaction
    F3(1 Tháng - 1 Năm):::interaction
    F4(Nghiện Dài Hạn):::interaction

    G[Cập nhật Hình Dáng & Màu Sắc Model 3D\nÁp dụng Shape Key & Texture]:::result

    H(Click vào Cơ Quan / Hotspot trên Model):::interaction

    I[Mở Panel Chi Tiết Cơ Quan]:::result
    I1[Hiển thị Mức độ tổn thương & % Chức năng]:::result
    I2[Hiển thị Triệu chứng & Bệnh lý]:::result
    I3[Nguồn tài liệu y khoa tham khảo]:::result

    %% Connections
    A --> B
    B --> C1
    B --> C2
    B --> C3

    C1 --> D1
    C1 --> D2
    C1 --> D3
    C1 --> D4

    D1 --> E
    D2 --> E
    D3 --> E
    D4 --> E

    E --> F1
    E --> F2
    E --> F3
    E --> F4

    F1 --> G
    F2 --> G
    F3 --> G
    F4 --> G

    G --> H
    C2 --> H
    C3 --> H

    H --> I
    I --> I1
    I --> I2
    I --> I3

```

### Ghi chú chức năng:
- **Dashboard Screen**: Giao diện chính duy nhất (Single Page Application). Mọi tương tác đều diễn ra ở đây để giữ trải nghiệm 3D liền mạch.
- **Tương tác cốt lõi**: `Chọn Thuốc` ➔ `Chọn Thời Gian` ➔ `Chọn Cơ Quan`.
- Mọi thao tác đều dẫn đến việc **cập nhật trực quan** trên mô hình 3D (đổi màu, biến dạng) trước khi người dùng cần phải đọc text chi tiết.
