<div align="center">
  <h1>🔴 Pokédex App ⚪</h1>
  <p><b>Một ứng dụng Pokédex hiện đại, tích hợp AI nhận diện hình ảnh, mang đến trải nghiệm khám phá thế giới Pokemon sống động và trực quan.</b></p>

  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,ts,nodejs,express,expo,git" alt="Tech Stack" />
  </a>
</div>

---

## 📖 Mục lục
- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Ảnh giao diện](#-ảnh-giao-diện)
- [Công nghệ sử dụng](#%EF%B8%8F-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [Xử lý sự cố](#-xử-lý-sự-cố)
- [Giấy phép](#-giấy-phép)

---

## 🚀 Giới thiệu
**Pokédex App** không chỉ là một cuốn từ điển Pokemon thông thường. Đây là một dự án Fullstack được xây dựng với mục tiêu mang đến một công cụ tra cứu mạnh mẽ, giao diện đẹp mắt và tích hợp **trí tuệ nhân tạo (AI)** để nhận diện Pokemon qua hình ảnh. Ứng dụng hoạt động theo mô hình **Local-First**, cho phép người dùng lưu trữ dữ liệu yêu thích ngay trên thiết bị mà không cần tài khoản.

---

## ✨ Tính năng

| Chức năng | Mô tả |
| :--- | :--- |
| **Tra cứu & Tìm kiếm** | Tìm kiếm Pokemon theo tên hoặc số ID với tính năng gợi ý (Autocomplete) thông minh. |
| **Thông tin chi tiết** | Xem thông số cơ bản, chỉ số (Stats), hệ (Types), chiêu thức (Moves), địa điểm (Location), chuỗi tiến hóa (Evolution) và hệ hiệu quả (Type Effectiveness). |
| **Đa dạng hình dạng** | Tự động tải và hiển thị các dạng Mega, Gigantamax, Shiny và Home artwork. |
| **Hệ thống Yêu thích** | Lưu lại những Pokemon yêu thích của bạn vào bộ nhớ máy (AsyncStorage). |
| **AI Camera** | Chụp hoặc tải ảnh Pokemon từ thư viện, AI (Google Gemini) sẽ nhận diện và tự động chuyển đến trang chi tiết. |
| **So sánh Pokemon** | Chọn 2 Pokemon để so sánh trực quan các chỉ số và thông tin. |
| **Giao diện & Trải nghiệm** | Hỗ trợ Dark Mode, Đa ngôn ngữ (Việt/Anh), hiệu ứng động (Animations), Haptics và xử lý lỗi mất mạng. |

---

## 📸 Ảnh giao diện
<!-- 
  HƯỚNG DẪN DÁN ẢNH: 
  1. Tạo thư mục 'assets/screenshots' trong dự án của bạn.
  2. Copy ảnh chụp màn hình vào đó và đặt tên tương ứng (ví dụ: home-light.png).
  3. Nếu bạn đổi tên file, hãy sửa lại đường dẫn src bên dưới cho khớp.
-->

| Trang chủ (Light) | Trang chủ (Dark) | Chi tiết Pokemon |
| :---: | :---: | :---: |
| <img src="./assets/screenshots/home-light.png" width="250"/> | <img src="./assets/screenshots/home-dark.png" width="250"/> | <img src="./assets/screenshots/details.png" width="250"/> |

| Giao diện AI Camera | Tính năng So sánh |
| :---: | :---: |
| <img src="./assets/screenshots/ai-camera.png" width="250"/> | <img src="./assets/screenshots/compare.png" width="250"/> |

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend** | React Native, Expo Router, TypeScript, React Native Reanimated, AsyncStorage |
| **Backend** | Node.js, Express, TypeScript |
| **AI** | Google Gemini API (Nhận diện hình ảnh) |
| **API bên thứ 3** | PokéAPI |

---

## 📁 Cấu trúc thư mục

~~~text
pokedex/
├── src/                  # Mã nguồn Frontend (React Native)
│   ├── app/              # Các màn hình chính (Expo Router)
│   ├── components/       # Các UI Components
│   ├── context/          # React Context (Theme, Language)
│   ├── hooks/            # Custom Hooks
│   └── utils/            # Các hàm tiện ích
├── server/               # Mã nguồn Backend (Node.js + Express)
│   ├── src/              # Logic server
│   └── .env              # Biến môi trường (API Key)
└── package.json          # Dependencies của Frontend
~~~

---

## 🚀 Cài đặt và chạy

### 1. Yêu cầu môi trường
- Node.js (phiên bản LTS)
- Expo Go (trên điện thoại) hoặc máy ảo (iOS/Android)
- Google Gemini API Key (lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/))

### 2. Cài đặt
Mở Terminal và chạy các lệnh sau:

~~~bash
# Clone dự án
git clone https://github.com/txhiuu/pokedex.git
cd pokedex

# Cài đặt Frontend
npm install

# Cài đặt Backend
cd server
npm install
~~~

### 3. Cấu hình biến môi trường
Tạo file `.env` trong thư mục `server/` và thêm API Key của bạn:
~~~env
PORT=3000
GEMINI_API_KEY=your_api_key_here
~~~

### 4. Chạy ứng dụng
Mở 2 cửa sổ Terminal riêng biệt:

~~~bash
# Terminal 1: Chạy Backend
cd server
npm run dev

# Terminal 2: Chạy Frontend
npm start
~~~
Quét mã QR hiển thị trên Terminal bằng ứng dụng **Expo Go** trên điện thoại của bạn.

---

## 🐛 Xử lý sự cố

| Triệu chứng | Cách xử lý |
| :--- | :--- |
| **Lỗi kết nối API** | Đảm bảo điện thoại và máy tính dùng chung một mạng Wi-Fi. Kiểm tra lại địa chỉ IP trong code hoặc cấu hình `expo-constants` để tự động lấy IP. |
| **AI Camera không nhận diện** | Kiểm tra API Key trong file `.env` đã chính xác chưa. Đảm bảo server backend đang chạy ở Terminal 1. |
| **Ứng dụng bị treo khi mất mạng** | Ứng dụng đã có màn hình thông báo lỗi mạng, nhưng hãy kiểm tra lại kết nối Wi-Fi/4G của thiết bị. |

---

## 📄 Giấy phép
Dự án được phát triển cho mục đích học tập và xây dựng portfolio cá nhân. Dữ liệu hình ảnh và thông tin được cung cấp bởi [PokéAPI](https://pokeapi.co/).
