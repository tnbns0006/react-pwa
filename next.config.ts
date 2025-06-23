import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  output: "standalone",
};
// Configure PWA options
const pwaOptions = {
  dest: 'public', // Thư mục chứa service worker
  register: true, // Tự động đăng ký service worker
  skipWaiting: true, // Bỏ qua chờ đợi khi có bản cập nhật service worker
  // disable: process.env.NODE_ENV === 'development', // Tắt PWA trong môi trường dev để tránh lỗi
};
// Apply the PWA plugin with the options
const withPWAConfig = withPWA(pwaOptions);
// Export the final configuration with both plugins applied
export default withPWAConfig(nextConfig);
