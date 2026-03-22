# mbackend — 게시글 API (프론트 개발용)

> Base URL (로컬): `http://localhost:3000`  
> 상세 스키마·Try it: **`http://localhost:3000/api`** (Swagger)

## 공통

| 항목 | 값 |
|------|-----|
| 인증 (작성·수정·삭제) | `Authorization: Bearer <access_token>` |
| JSON 필드명 | **camelCase** |
| 이미지 포함 작성 | `multipart/form-data` |
| 텍스트만 작성 | `POST …/json` + `Content-Type: application/json` |

---

## 1. 이미지와 함께 글 쓰기 — `multipart/form-data`

세 게시판 모두 동일한 패턴입니다.

| 게시판 | URL | 메서드 |
|--------|-----|--------|
| 공연소식 | `/news` | `POST` |
| 모집공고 | `/announcement` | `POST` |
| 커뮤니티 | `/community` | `POST` |

### Form 필드

| 이름 | 필수 | 설명 |
|------|------|------|
| `payload` | O | 아래 **해당 DTO와 같은 키**를 가진 객체를 `JSON.stringify` 한 **문자열** |
| `files` | 아니오 | 이미지 파일. **같은 필드명 `files`로 여러 번** append (최대 20장) |

- `Content-Type` 헤더는 **직접 넣지 말 것** — 브라우저/React Native가 boundary 포함해 설정.
- 업로드한 파일이 있으면, **`payload.fileId`가 없을 때** 첫 번째 파일이 글의 **대표 이미지(`file_id`)** 로 저장됩니다.

### 응답에 항상 포함 — `attachments`

업로드한 파일이 있으면 저장 결과가 배열로 옵니다. 없으면 `[]`.

```ts
type AttachmentItem = {
  fileId: string;
  imgUrl: string;      // S3 공개 URL (버킷 정책에 따라 접근)
  sortOrder: number;   // 같은 글 안 순서 (0부터)
};
```

---

## 2. 이미지 없이 글만 — `application/json`

| 게시판 | URL |
|--------|-----|
| 공연소식 | `POST /news/json` |
| 모집공고 | `POST /announcement/json` |
| 커뮤니티 | `POST /community/json` |

Body = 아래 해당 **Create DTO JSON** 그대로. 응답에도 `attachments`는 보통 `[]` 입니다.

---

## 3. `payload` / Body JSON 스키마 (TypeScript)

### 공연소식 — `CreateNewsDto`

```ts
interface CreateNewsDto {
  title: string;           // max 100
  content: string;        // max 255
  place: string;          // max 100
  ticketPrice?: number | null;
  startedAt: string;      // ISO 8601
  endedAt?: string | null;
  contact: string;        // max 30
  fileId?: string | null;   // 이미 존재하는 file UUID (선택). multipart로 파일 보내면 생략 가능
}
```

### 커뮤니티 — `CreateCommunityDto`

```ts
interface CreateCommunityDto {
  title: string;
  content: string;
  categoryId: string;     // 커뮤니티 카테고리 UUID
  fileId?: string;        // 선택, 기존 등록 파일 id
}
```

### 모집공고 — `CreateAnnouncementDto`

`applicationConfig` 는 지원서 항목 포함 여부입니다. Swagger의 `ApplicationConfigDto` 와 동일합니다.

```ts
type AnnouncementStatus = 'OPEN' | 'CLOSED';

interface CreateAnnouncementDto {
  title: string;
  content: string;
  deadlineAt: string;       // ISO 8601
  scheduledAt: string;
  status?: AnnouncementStatus;
  address: string;
  fileId?: string | null;
  categoryId: string;       // 공고 유형 category UUID
  majorIds?: string[];      // 전공 UUID 배열, 선택
  applicationConfig: {
    includeName?: boolean;
    includeBirth?: boolean;
    includeGender?: boolean;
    includeMajor?: boolean;
    includeMajorDetail?: boolean;
    includeEducation?: boolean;
    includeCategory?: boolean;
    includeMusic?: boolean;
    includeAddress?: boolean;
    includeFile?: boolean;
    includeLink?: boolean;
    // … Swagger 참고
  };
}
```

---

## 4. 작성 응답 예시

### 공연소식 `POST /news` (또는 `/news/json`)

```json
{
  "newsId": "uuid",
  "title": "…",
  "place": "…",
  "startedAt": "2025-04-01T19:00:00.000Z",
  "attachments": [
    { "fileId": "…", "imgUrl": "https://…", "sortOrder": 0 }
  ]
}
```

### 모집공고 `POST /announcement` (또는 `/announcement/json`)

```json
{
  "postId": "uuid",
  "title": "…",
  "type": "행사",
  "isRecruiting": true,
  "dDay": "D-7",
  "attachments": []
}
```

### 커뮤니티 `POST /community` (또는 `/community/json`)

저장된 글 엔티티 필드 + `attachments` 배열이 붙습니다.

---

## 5. 프론트 코드 예시 (이미지 포함)

```ts
const API = 'http://localhost:3000';
const token = '…'; // access_token

const payload: CreateNewsDto = {
  title: '제목',
  content: '본문',
  place: '서울',
  startedAt: new Date().toISOString(),
  contact: '010-0000-0000',
};

const form = new FormData();
form.append('payload', JSON.stringify(payload));
imageFiles.forEach((file) => form.append('files', file));

const res = await fetch(`${API}/news`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});

const data = await res.json();
// data.attachments[0].imgUrl 등 사용
```

---

## 6. 목록·썸네일 (참고)

- `GET /news` — `items[].thumbnailUrl` (목록 카드용)
- `GET /community` — 각 항목 `thumbnailUrl`

규칙: `file` 테이블에서 해당 글에 붙은 이미지 중 **`order` 최소 1장**, 없으면 대표 `file_id` 이미지.

---

## 7. 오류

| 코드 | 대표 원인 |
|------|-----------|
| 400 | `payload` 가 JSON이 아님, 유효성 실패 (필드 누락·형식) |
| 401 | 토큰 없음·만료 |

---

기타(팔로우, 프로필, 인증 상세): [docs/README.md](./docs/README.md)
