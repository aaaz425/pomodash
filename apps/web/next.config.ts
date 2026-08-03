import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  // 모바일 실기기 테스트용 LAN IP — .env.local에 없으면 그냥 생략됨
  ...(process.env.DEV_LAN_ORIGIN ? { allowedDevOrigins: [process.env.DEV_LAN_ORIGIN] } : {}),
};

export default nextConfig;
