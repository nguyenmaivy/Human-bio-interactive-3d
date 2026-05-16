# Hướng Dẫn Tích Hợp File .glb Vào Dự Án

Hiện tại, component `HumanModel` của bạn đang dùng các hình khối giả lập (Sphere, Box, Torus...). Để dùng một file `.glb` thật (có chứa các bộ phận như Não, Tim, Phổi đã được model sẵn), bạn làm theo các bước sau.

## Bước 1: Chuẩn bị file `.glb`
1. Đảm bảo file `.glb` của bạn đã được tách sẵn các bộ phận thành các mesh riêng biệt (ví dụ trong phần mềm thiết kế 3D, bạn đặt tên các object là `Brain`, `Heart`, `Lungs`, v.v.).
2. Copy file `.glb` (giả sử tên là `human_body.glb`) và dán vào thư mục `public/` của dự án (thư mục gốc chứa dự án, cùng cấp với thư mục src). Cụ thể là `d:\Nam-4\CAN\Code\Human-bio-interactive-3d\public\human_body.glb`.

## Bước 2: Tạo Component Mới Sử Dụng File `.glb`

Bạn có thể tạo một file mới tên là `HumanModelGLB.tsx` trong thư mục `src/components/` với nội dung mẫu sau:

```tsx
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BioMetrics, OrganType } from '../types';
import { ORGAN_BY_ID } from '../config/organs';

// Tạo component riêng cho từng bộ phận trong file GLB
const GLBOrgan = ({ node, material, type, activityScale, health, isSelected, onClick, label }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Tính toán màu sắc dựa trên sức khoẻ
  const healthFactor = health / 100;
  const healthColor = useMemo(() => {
    const baseColor = new THREE.Color(material?.color || '#ffffff');
    if (isSelected) return '#ffffff'; // Nổi bật khi chọn
    const decayColor = new THREE.Color('#333333');
    return baseColor.lerp(decayColor, 1 - healthFactor).getStyle();
  }, [material, healthFactor, isSelected]);

  // Clone material để không ảnh hưởng các mesh khác
  const clonedMaterial = useMemo(() => {
    if (!material) return new THREE.MeshStandardMaterial({ color: healthColor });
    const mat = material.clone();
    mat.color.set(healthColor);
    if (hovered) {
      mat.emissive.set(healthColor);
      mat.emissiveIntensity = 0.5;
    } else {
      mat.emissiveIntensity = 0;
    }
    return mat;
  }, [material, healthColor, hovered]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Hiệu ứng nhịp đập (pulse) theo sức khoẻ
    if (activityScale > 0) {
      const pulse = 1 + Math.sin(t * (activityScale + 1) * 3) * 0.04 * activityScale;
      const scale = healthFactor * pulse;
      // Trả về tỷ lệ gốc của mesh (trong file glb) nhân với pulse
      meshRef.current.scale.set(node.scale.x * scale, node.scale.y * scale, node.scale.z * scale);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={node.geometry}
        material={clonedMaterial}
        position={node.position}
        rotation={node.rotation}
        onClick={(e) => {
          e.stopPropagation();
          onClick(type);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      />
      {/* Hiển thị nhãn HTML phía trên bộ phận đó */}
      {isSelected && (
        <Html distanceFactor={4} position={[node.position.x + 0.5, node.position.y, node.position.z]}>
          <div className="pointer-events-none select-none flex flex-col gap-1 items-start">
            <div className="px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tighter whitespace-nowrap backdrop-blur-sm shadow-xl transition-colors bg-white text-black border-white">
              {label}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export const HumanModelGLB = ({ metrics, selectedOrgan, onSelectOrgan }: any) => {
  // Load file glb từ thư mục public/
  // Tên file ở đây là human_body.glb (bạn đổi cho đúng với tên file của bạn)
  const { nodes, materials } = useGLTF('/human_body.glb') as any;

  const heartActivity = (metrics.heartRate - 60) / 100;
  const brainActivity = (metrics.dopamineLevel / 100);
  const health = metrics.organHealth;

  // Mẹo: Bỏ comment dòng bên dưới để xem danh sách các object/bộ phận có trong file 3D của bạn ở Console trình duyệt
  // console.log("Danh sách object trong file GLB:", nodes);

  return (
    <group onPointerMissed={() => onSelectOrgan(null)} dispose={null}>
      
      {/* Ví dụ: Trích xuất phần Não. Tên 'Brain' phụ thuộc vào tên bạn đặt trong Blender/phần mềm 3D */}
      {nodes.Brain && (
        <GLBOrgan 
          node={nodes.Brain}
          material={materials.BrainMaterial || nodes.Brain.material}
          type="brain"
          activityScale={brainActivity}
          health={health}
          isSelected={selectedOrgan === 'brain'}
          onClick={onSelectOrgan}
          label={ORGAN_BY_ID.brain.label}
        />
      )}

      {/* Lặp lại tương tự cho Tim (Heart), Phổi (Lungs) v.v. */}
      {nodes.Heart && (
        <GLBOrgan 
          node={nodes.Heart}
          material={nodes.Heart.material}
          type="heart"
          activityScale={heartActivity}
          health={health}
          isSelected={selectedOrgan === 'heart'}
          onClick={onSelectOrgan}
          label={ORGAN_BY_ID.heart.label}
        />
      )}
      
      {/* ... Thêm các cơ quan khác tương tự ... */}

      {/* Cơ thể tổng quát bao bọc bên ngoài (Ví dụ phần da mờ) */}
      {nodes.Body && (
        <mesh 
          geometry={nodes.Body.geometry} 
          material={nodes.Body.material} 
          position={nodes.Body.position}
        >
          <meshStandardMaterial transparent opacity={0.1} color={health < 30 ? "#330000" : "#222222"} />
        </mesh>
      )}

    </group>
  );
};

// Khai báo tải trước file để tối ưu
useGLTF.preload('/human_body.glb');
```

## Bước 3: Thay Thế Component Trong Ứng Dụng
Sau khi tạo xong file trên, bạn mở file hiển thị mô hình chính (thường là file chứa khung Canvas 3D của bạn) và đổi `<HumanModel />` thành component mới:

```tsx
import { HumanModelGLB } from './components/HumanModelGLB';

// Bên trong component chứa khung cảnh...
<HumanModelGLB 
  metrics={metrics} 
  selectedOrgan={selectedOrgan} 
  onSelectOrgan={setSelectedOrgan} 
/>
```

> [!IMPORTANT]
> **Lưu ý quan trọng**: 
> Biến `nodes.Brain` hay `nodes.Heart` sẽ hoàn toàn phụ thuộc vào **tên chính xác** của vật thể đó mà bạn đã đặt khi thiết kế file 3D của bạn (ví dụ có thể là `nodes.Nao`, `nodes.Object_1`, v.v.). Bạn có thể mở Developer Tools (nhấn F12) trên trình duyệt, xem tab Console (sau khi bật tính năng `console.log(nodes)` ở Bước 2) để xem danh sách tên chính xác và đổi lại trong code cho khớp!
