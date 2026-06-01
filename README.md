# 💚 CareLog - AI Senior Health Care Blog

CareLog는 시니어들의 건강한 노후를 지원하고 스마트한 자가 건강 관리를 돕기 위해 매일의 건강 소식을 전하고 기록하는 **AI 시니어 케어 가이드 플랫폼**입니다. 

---

## 🚀 주요 기능

### 1. 홈 대시보드 (Home Dashboard)
- **건강 정보 검색**: 사용자가 필요한 건강 정보를 빠르게 검색할 수 있는 실시간 검색 기능을 제공합니다.
- **카테고리 필터링**: 혈압 관리, 치매 예방, AI 돌봄, 운동, 영양 등 다양한 케어 도메인별 정보를 원클릭 카테고리 필터로 편리하게 모아볼 수 있습니다.

### 2. 아티클 상세 정보 (Article Reader)
- **시니어 친화적 디자인**: 가독성이 뛰어난 폰트와 넉넉한 레이아웃을 제공합니다.
- **다이나믹 배경 그래디언트**: 카테고리 테마에 특화된 고급스러운 그래디언트 배너를 제공합니다.

### 3. 실시간 미리보기 에디터 (Rich Content Editor)
- **WYSIWYG 글쓰기**: 관리자 권한을 가진 사용자가 콘텐츠를 직관적으로 작성 및 수정할 수 있습니다.
- **기기별 미리보기**: 데스크톱(Desktop) 뷰와 모바일(Mobile) 뷰 실시간 시뮬레이션을 지원하여 시니어가 모바일 화면에서 아티클을 볼 때의 가독성을 즉시 확인할 수 있습니다.

### 4. Supabase 백엔드 연동
- **사용자 인증 (Auth)**: 이메일 기반 로그인/회원가입은 물론, 구글(Google) 및 카카오(Kakao) 소셜 로그인 연동을 지원합니다.
- **보안 규칙 (RLS)**: Row Level Security(행 레벨 보안) 정책을 적용하여, 일반 대중(Public)은 글 조회만 가능하고 인증된 관리자(Authenticated)만 작성/수정/삭제 권한을 가질 수 있도록 데이터베이스 보안을 설계했습니다.

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js (16.2.6, App Router)
- **Styling**: Tailwind CSS (v4, PostCSS)
- **Icons**: Lucide React

### Backend & Database
- **BaaS**: Supabase (Database, Auth, Client SDK)
- **Database**: PostgreSQL (Migrations & Row Level Security)

---

## 💻 로컬 개발 환경 설정

### 1. 의존성 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트 디렉터리에 `.env.local` 파일을 생성하고 아래와 같이 Supabase 주소 및 Anon Key를 추가해 줍니다. (보안을 위해 `.gitignore`에 등록되어 깃허브에는 업로드되지 않습니다.)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 3. 로컬 DB 시드 데이터 추가 (선택사항)
아래 명령어를 사용하여 초기 안내 아티클 데이터를 데이터베이스에 주입할 수 있습니다.
```bash
npm run db:seed
```

### 4. 개발 서버 실행
```bash
npm run dev
```
서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

---

## 📦 배포 가이드 (Vercel)

1. [Vercel](https://vercel.com)에 로그인 후 **Import Project**로 본 깃허브 저장소를 선택합니다.
2. 배포 설정 화면의 **Environment Variables** 항목에 로컬 `.env.local`의 값들을 그대로 등록합니다:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** 버튼을 눌러 배포를 완료합니다.
