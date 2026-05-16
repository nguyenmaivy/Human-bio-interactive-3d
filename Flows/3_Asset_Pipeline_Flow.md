# 3D Asset Pipeline Flow - Human Bio Interactive 3D

Đây là quy trình làm việc để tích hợp mô hình 3D (Asset Pipeline) từ phần mềm thiết kế (Blender) vào ứng dụng Web (React Three Fiber), trích xuất từ phần hướng phát triển trong `PROJECT_ANALYSIS.md`.

```mermaid
graph TD
    classDef design fill:#fce4ec,stroke:#e91e63,stroke-width:2px,color:#000
    classDef export fill:#fff3e0,stroke:#ff9800,stroke-width:2px,color:#000
    classDef dev fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px,color:#000
    classDef runtime fill:#e0f7fa,stroke:#00bcd4,stroke-width:2px,color:#000

    A[Tạo hình Model 3D cơ thể và Nội tạng trong Blender]:::design
    
    B1["Phân chia Objects:<br>- Brain<br>- Heart<br>- Liver<br>- Lungs<br>- Body_Skin"]:::design
    B2[Tạo Shape Keys (Morph Targets) cho 6 mốc thời gian của từng cơ quan]:::design
    B3[Gắn Material/Texture cơ bản]:::design

    A --> B1
    A --> B2
    A --> B3

    B1 --> C
    B2 --> C
    B3 --> C

    C(Export ra định dạng .glb):::export

    D[Lưu file .glb vào thư mục public/ của dự án React]:::dev

    C --> D

    E["Code Frontend:<br>Dùng @react-three/drei hooks useGLTF() để nhúng vào Canvas"]:::dev

    D --> E

    F1[Bóc tách nodes và materials từ file GLB]:::runtime
    F2[Thiết lập sự kiện onClick, onPointerOver cho từng node cơ quan]:::runtime
    F3[Liên kết Shape Keys (morphTargetInfluences) với State của ứng dụng]:::runtime

    E --> F1
    E --> F2
    E --> F3
    
    G["Render WebGL tương tác mượt mà<br>(Không cần reload lại trang khi chuyển trạng thái)"]:::runtime
    
    F1 --> G
    F2 --> G
    F3 --> G
```

### Đặc điểm pipeline:
- Dùng chung **1 file `.glb` duy nhất** chứa toàn bộ các cơ quan và shape keys thay vì 6 file riêng biệt cho 6 mốc thời gian, giúp tối ưu băng thông tải trang.
- Frontend không cần biết logic biến dạng của Blender, Frontend chỉ gán các giá trị tham số shape key từ `0.0` đến `1.0` dựa theo trạng thái do người dùng chọn.
