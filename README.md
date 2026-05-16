<div align="center">
  <h1>🧬 Human Bio Interactive 3D</h1>
  <p><strong>Mô phỏng tác động của ma túy lên cơ thể người bằng mô hình 3D tương tác</strong></p>
  <p>
    <a href="#features">Features</a> • 
    <a href="#tech-stack">Tech Stack</a> • 
    <a href="#quick-start">Quick Start</a> • 
    <a href="#data-sources">Data Sources</a>
  </p>
</div>

---

## 📋 Giới thiệu

**Human Bio Interactive 3D** là một ứng dụng mô phỏng sinh học 3D cho phép người dùng khám phá tác động của các chất kích thích (heroin, cocaine, methamphetamine) lên các cơ quan nội tạng của cơ thể theo thời gian.

### Mục tiêu

- 🎯 **Giáo dục**: Giúp mọi người hiểu rõ tác hại của ma túy lên cơ thể bằng trực quan 3D
- 📊 **Dữ liệu chính xác**: Sử dụng dữ liệu từ các nguồn y khoa hàng đầu (NIH NIDA, WHO, CDC, PubMed)
- 🔬 **Khoa học**: Mô phỏng dựa trên các nghiên cứu y học thực tế về tác hại lâu dài

## ✨ Tính năng

### MVP (Hiện tại)

- ✅ **Chọn chất kích thích**: Heroin, Cocaine, Methamphetamine
- ✅ **Timeline 6 mốc**:
  - 🌅 Bắt đầu
  - 📅 1 tuần
  - 📆 1 tháng
  - 📊 6 tháng
  - 📈 1 năm
  - ⚠️ Dài hạn
- ✅ **Mô hình 3D tương tác**: Xoay, phóng to/thu nhỏ cơ thể người
- ✅ **Highlight cơ quan**: Click vào cơ quan để xem chi tiết tác động
- ✅ **Hiển thị triệu chứng**: Danh sách triệu chứng theo từng giai đoạn
- ✅ **Mức độ tổn thương**: Thanh tiến độ % chức năng cơ quan
- ✅ **Nguồn tài liệu**: Trích dẫn từ NIH, WHO, CDC, PubMed

### Sắp tới

- 🔄 Thêm nhiều loại chất kích thích khác (LSD, Fentanyl, v.v.)
- 🔄 Nâng cấp mô hình 3D anatomy chi tiết hơn
- 🔄 So sánh tác động giữa các chất
- 🔄 Chế độ so sánh hai cơ quan
- 🔄 Export báo cáo chi tiết

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **3D**: Three.js + React Three Fiber (@react-three/fiber)
- **UI**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/nguyenmaivy/Human-bio-interactive-3d.git
   cd Human-bio-interactive-3d
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open browser:
   ```
   http://localhost:5173
   ```

### Build for production:

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── HumanModel.tsx          # 3D human model component
│   ├── DrugSelector.tsx         # Drug selection UI
│   ├── TimelinePanel.tsx        # Timeline stage selector
│   ├── OrganInfoPanel.tsx       # Organ damage & effects display
│   └── WarningCard.tsx          # Health warning disclaimer
├── data/
│   └── drugEffects.ts           # Drug × Organ × Stage mapping
├── lib/
│   └── utils.ts                 # Utility functions
├── App.tsx                      # Main app component
├── types.ts                     # TypeScript types
├── constants.tsx                # Application constants
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

## 📊 Data Mapping

Drug effects are stored in `src/data/drugEffects.ts` with the following structure:

```ts
interface DrugEffect {
  drug: 'heroin' | 'cocaine' | 'methamphetamine';
  organ: 'heart' | 'liver' | 'brain' | 'lungs' | 'nervous_system' | 'skin';
  stage: 'start' | '1_week' | '1_month' | '6_months' | '1_year' | 'long_term';
  color: string;                  // Hex color for visualization
  damageLevel: 'none' | 'mild' | 'moderate' | 'severe' | 'critical';
  functionPercent: number;        // Organ function remaining (0-100)
  symptoms: string[];             // List of symptoms
  description: string;            // Medical explanation
  source: string;                 // Data source (e.g., "NIH NIDA")
  sourceUrl?: string;             // Link to source
}
```

### MVP Drug Data

- **Heroin** → Brain focus
  - ✅ Bộ não (Brain) - All 6 stages
  - Effects: Dopamine increase → tolerance → cognitive decline → severe damage

- **Cocaine** → Heart focus
  - ✅ Trái tim (Heart) - All 6 stages  
  - Effects: Increased HR/BP → arrhythmias → cardiomyopathy → heart failure

- **Methamphetamine** → Skin + Brain
  - ✅ Da (Skin) - All 6 stages
  - ✅ Bộ não (Brain) - Start, 6 months stages
  - Effects: Formication → severe sores → permanent scarring

## 📚 Data Sources

All drug effect data is based on peer-reviewed medical research:

| Source | URL | Focus |
|--------|-----|-------|
| **NIH NIDA** | https://www.drugabuse.gov | Drug addiction neurobiology |
| **WHO** | https://www.who.int | Global drug health impacts |
| **CDC** | https://www.cdc.gov | Epidemiology & health data |
| **PubMed** | https://pubmed.ncbi.nlm.nih.gov | Peer-reviewed research |

### Referenced Studies

- Gray matter reduction in heroin users (PNAS, NIH Neuroimaging)
- Cocaine cardiotoxicity (Circulation Journal)
- Methamphetamine neurotoxicity (Neuropsychology Journal)
- Premature aging in chronic meth users (NIH NIDA)

## ⚠️ Disclaimer

This application provides **educational information only** and is not a substitute for medical advice. The simulations are based on published medical research but represent generalized effects.

**If you or someone you know has a substance use disorder, please contact:**
- **National Helpline (USA)**: 1-800-662-4357 (SAMHSA)
- **International Support**: https://www.who.int/substance_abuse/treatment

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Additional drug types
- [ ] More detailed 3D anatomy models
- [ ] Improved organ visualization effects
- [ ] Comparison mode between drugs
- [ ] Multi-language support
- [ ] Mobile responsive design

## 📝 License

Apache 2.0 - See [LICENSE](LICENSE) file

## 👤 Author

Created for educational purposes about drug awareness.

**Last Updated**: May 2026
