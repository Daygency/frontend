# 지원서 API · 프로필 포트폴리오 필드 (명세)

모든 보호된 엔드포인트는 `Authorization: Bearer <access_token>` 필요.

---

## 1. 프로필 수정 — 학력 / 경력 / 수상 (`PATCH /users/profile/my`)

`UpdateUserDto` JSON에 아래 배열을 포함할 수 있다. (멀티파트 `payload` JSON 문자열 또는 `application/json` 본문)

### `educations[]` — `UpdateEducationDto`

| 필드 | 타입 | 설명 |
|------|------|------|
| `educationId` | UUID (선택) | 기존 행 수정 시에만. 없으면 신규 행 |
| `description` | string, 1~100 | 학력 설명 |
| `startedAt` | ISO 날짜 문자열 | 시작 |
| `endedAt` | ISO 날짜 문자열 (선택) | 종료. 없으면 재학 중 등으로 `NULL` 저장 |

### `careers[]` — `UpdateCareerDto`

| 필드 | 타입 | 설명 |
|------|------|------|
| `careerId` | UUID (선택) | 기존 행 수정 시 |
| `description` | string, 1~100 | 경력 설명 |
| `startedAt` | ISO 날짜 | 시작 |
| `endedAt` | ISO 날짜 | 종료 |
| `organization` | string, 최대 10자 (선택) | 소속(회사 등) |

### `awards[]` — `UpdateAwardDto`

| 필드 | 타입 | 설명 |
|------|------|------|
| `awardId` | UUID (선택) | 기존 행 수정 시 |
| `description` | string, 1~100 | 수상 내용 |
| `awardedAt` | ISO 날짜 (선택) | 수상 시점, 없으면 `NULL` |
| `organization` | string, 최대 10자 (선택) | 발급 기관 |

**참고:** `certificate`는 프로필 PATCH 동기화 대상이 아니며, 포트폴리오 전용 생성 API(`portfolio` 모듈)에서 다룬다. 엔티티 필드는 `description`, `obtainedAt`(nullable), `organization`(nullable, 최대 10자).

---

## 2. 지원서 (`/applications`)

### 공통

- **활성 지원 1건:** 동일 `postId` + 동일 유저에 대해 **삭제되지 않은** 지원은 1건만 허용. 제약은 DB 유니크가 아니라 서비스 로직 + TypeORM 기본 조회(소프트 삭제 제외)로 보장.
- **소프트 삭제:** `deleted_at`이 채워지면 목록·조회에서 제외. 삭제 후 같은 공고에 **다시 `POST`로 재지원** 가능(새 행 INSERT).
- **스냅샷 JSON:** DB에 저장되는 `file`, `education`, `career`, `award`, `certificate`는 **프로필 row id를 넣지 않는다.** 항목별 필드만 배열로 보낸다. 형식은 `types/application-snapshot.types.ts` 참고.

### 스냅샷 항목 형식 (요약)

- **`file`**: `{ fileId?, url?, originalName? }[]`
- **`education`**: `{ description, startedAt, endedAt }[]` — 날짜는 ISO 문자열, `endedAt`은 `null` 가능
- **`career`**: `{ description, startedAt, endedAt, organization? }[]`
- **`award`**: `{ description, awardedAt, organization? }[]`
- **`certificate`**: `{ description, obtainedAt, organization? }[]`

스칼라 필드 중 `birth`는 **datetime** 저장, 요청은 **ISO 8601 문자열** (`IsDateString`).

---

### `POST /applications`

지원서 제출.

**Body:** `CreateApplicationDto` — `postId` 필수, 나머지는 공고의 `application_config`에 따라 필수 검증.

**응답:** 생성된 `Application` 엔티티.

**에러:** 이미 활성 지원이 있으면 `409 Conflict`.

---

### `GET /applications/post/:postId/me`

해당 공고에 대한 **내 활성 지원** 1건.

**404:** 활성 지원 없음(삭제했거나 미제출).

---

### `GET /applications/post/:postId`

해당 공고의 지원 목록 — **공고 작성자만**. 삭제된 지원은 제외.

---

### `GET /applications/:id`

지원서 단건 — 지원자 본인 또는 해당 공고 작성자.

---

### `PATCH /applications/:id`

지원서 수정 — **지원자 본인**, 공고 `OPEN`이고 마감 전.

**Body:** `UpdateApplicationDto` (`CreateApplicationDto`에서 `postId` 제외한 부분 타입).

---

### `PATCH /applications/:id/status`

심사 상태 변경 — **공고 작성자만**.

**Body:** `{ "status": "SUBMITTED" | "DOCUMENT_REVIEW" | "ACCEPTED" | "REJECTED" }`

---

### `DELETE /applications/:id`

**내 지원 소프트 삭제** — 지원자 본인만.

**응답:** `204 No Content`

삭제 후 동일 공고에 다시 `POST /applications`로 재지원 가능.

---

## 3. 유니크 제약을 뺀 이유

`(post_id, user_id)` DB 유니크를 두면, 한 번 지원했다가 소프트 삭제한 뒤 **같은 쌍으로 새 행을 INSERT**할 때 유니크 충돌이 난다.  
그래서 유니크는 제거하고, **미삭제 행만** 카운트하는 방식으로 “1인 1활성 지원”을 맞춘다.
