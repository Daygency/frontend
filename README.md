## daygency react native

### 폴더 구조
```
src/
├── assets/              # 이미지, 폰트 등 정적 리소스
├── components/          # 재사용 가능한 공통 UI 컴포넌트
│   └── portfolio/       # 포트폴리오 공통 UI (Profile, Photo, Activity 등)
├── screens/             # 페이지 단위 컴포넌트 (화면별 헤더 등 화면 전용 코드)
├── hooks/               # 커스텀 훅
├── lib/                 # API 호출, 외부 라이브러리 연동
├── navigations/         # 라우팅 관련 설정
├── contexts/            # React Context
├── constants/           # 색상, 여백, 공통 스타일 값
├── color.ts             # 컬러 팔레트
└── App.tsx
```

### 포트폴리오 모듈
- `components/portfolio/` — 내 포트폴리오·타인 포트폴리오가 공유하는 UI
- `screens/PortfolioScreen/` — 내 포트폴리오 (헤더만 화면 전용)
- `screens/ArtistPortfolioScreen/` — 타인 포트폴리오 (헤더만 화면 전용)
