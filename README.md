# Daygency Backend — API 명세 요약

로컬 기본 URL: `http://localhost:3000` (환경 변수 `PORT`로 변경 가능)

- **Swagger UI:** `GET /api` — Bearer 토큰 입력 후 각 태그별로 시도 가능
- **인증이 필요한 엔드포인트:** `Authorization: Bearer <access_token>` (소셜 로그인·리프레시로 발급된 JWT)

아래 **§1~§14**는 경로 요약이고, **§부록**에 주요 **요청 Body·쿼리·응답 필드**를 정리했다. 목록/상세의 전체 JSON 스키마는 **`/api` Swagger** 또는 서비스 반환 엔티티를 병행해 확인하면 된다.

---

## 1. 인증 (`/auth`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/auth/kakao` | — | Body: `{ "accessToken" }` — 카카오 액세스 토큰 |
| POST | `/auth/google` | — | 동일 |
| POST | `/auth/naver` | — | **모바일:** `{ "accessToken" }` 또는 `access_token`. **웹:** `{ "code", "redirectUri" }` (또는 `redirect_uri`) |
| POST | `/auth/signup/kakao` | — | 소셜 가입 + 토큰 (`SocialSignupDto`) |
| POST | `/auth/signup/google` | — | 동일 |
| POST | `/auth/signup/naver` | — | `accessToken`은 로그인 응답의 네이버 OAuth 토큰 (`code` 금지) |
| POST | `/auth/refresh` | — | `{ "refreshToken" }` |

네이버 상세(에러·`.env`)는 [`src/apis/auth/README.md`](src/apis/auth/README.md) 참고.

---

## 2. 지원서 (`/applications`)

모든 엔드포인트 **Bearer 필수.**

### 2.1 도메인 규칙

- **공고(`postId`) × 지원자(`userId`)당 DB 행 1건** — 유니크 `(post_id, user_id)`.
- **활성 지원**은 공고당 1건: 이미 제출한 지원이 있으면 `POST` 시 `409 Conflict`.
- **소프트 삭제** (`deleted_at`): 목록·일반 조회에서 제외.
- **삭제 후 재지원:** `POST /applications`로 **같은 행을 복구**하고 본문은 요청 body로 갱신 (새 INSERT 아님). 모집자 알림은 **신규 제출에만** 발송.
- **스냅샷 JSON** (`file`, `education`, `career`, `award`, `certificate`)은 프로필 row id 없이 항목 배열만 저장. 형식은 `src/apis/application/types/application-snapshot.types.ts` 참고.

### 2.2 DB 마이그레이션 (유니크)

엔티티와 맞추려면 `(post_id, user_id)` 유니크가 있어야 한다. 스크립트: `scripts/add-application-unique-mysql.sql`  
상세: [`src/apis/application/README.md`](src/apis/application/README.md)

### 2.3 엔드포인트

| 메서드 | 경로 | 권한 | 설명 |
|--------|------|------|------|
| POST | `/applications` | 로그인 | 지원 제출. `CreateApplicationDto` — `postId` 필수, 나머지는 공고 `application_config` 필수 항목에 맞춰 검증 |
| GET | `/applications/post/:postId/me` | 지원자 | 해당 공고 **내 활성 지원** 1건. 없으면 `404` |
| GET | `/applications/post/:postId` | 공고 작성자 | 해당 공고 지원 목록 (삭제 제외) |
| GET | `/applications/:id` | 지원자 본인 또는 공고 작성자 | 지원서 단건 |
| PATCH | `/applications/:id` | 지원자 본인 | 수정. 공고 `OPEN`·마감 전. `UpdateApplicationDto` |
| PATCH | `/applications/:id/status` | 공고 작성자 | 심사 상태. `UpdateApplicationStatusDto` (`SUBMITTED` \| `DOCUMENT_REVIEW` \| `ACCEPTED` \| `REJECTED`) |
| DELETE | `/applications/:id` | 지원자 본인 | 소프트 삭제 → `204` |

프로필 PATCH·학력/경력/수상 배열 형식은 **부록 D** 참고.

---

## 3. 모집 공고 (`/announcement`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/announcement/json` | Bearer | JSON만 작성 (이미지 없음) |
| POST | `/announcement` | Bearer | `multipart/form-data`: `payload`(JSON 문자열, `applicationConfig` 포함) + `files` |
| GET | `/announcement` | 선택 | 목록·필터·무한스크롤 (`ListAnnouncementQueryDto`) |
| GET | `/announcement/my` | Bearer | 내가 쓴 공고 목록 |
| GET | `/announcement/categories` | — | 공고 유형 목록 |
| GET | `/announcement/:id` | 선택(Optional JWT) | 상세 (`applicationConfig`, 로그인 시 `isMine` 등) |
| PATCH | `/announcement/:id` | Bearer | 수정 |
| DELETE | `/announcement/:id` | Bearer | 삭제 |

---

## 4. 유저 (`/users`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/users` | — | 회원 생성 등 (`CreateUserDto`) |
| GET | `/users/profile/my` | Bearer | 내 프로필 |
| PATCH | `/users/profile/my` | Bearer | 내 프로필 수정 — JSON 또는 `multipart`: `payload`(JSON 문자열) + `profileImage` |
| GET | `/users/check-activity-name` | — | 쿼리 `activityName` — 중복 여부 |
| GET | `/users/posts/my` | Bearer | 내 작성글 묶음 |
| GET | `/users/posts/my/news` | Bearer | 내 공연소식 |
| GET | `/users/posts/my/announcements` | Bearer | 내 모집공고 |
| GET | `/users/posts/my/scraps/announcements` | Bearer | 스크랩 공고 (무한스크롤) |
| GET | `/users/posts/my/scraps/community` | Bearer | 스크랩 커뮤니티 |
| GET | `/users/posts/my/scraps/news` | Bearer | 스크랩 공연소식 |
| GET | `/users/posts/my/scraps/highlights` | Bearer | 스크랩 최신 묶음 |
| GET | `/users/posts/my/highlights` | Bearer | 내 글 최신 묶음 |
| GET | `/users/search` | — | `activityName` 또는 `recommend` |
| GET | `/users` | — | 유저 목록 (`ListUsersQueryDto`) |
| GET | `/users/:id/profile` | — | 공개 프로필 (연락처 제외) |
| GET | `/users/:id` | — | 유저 단건 |

`POST /users/profile/award` — 포트폴리오 수상 항목 생성 (컨트롤러만 존재, 인증·연동은 구현 상태에 따라 Swagger 확인 권장).

---

## 5. 홈 (`/home`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/home` | 홈 피드 묶음 (공고·공연소식·커뮤니티 요약) |

---

## 6. 커뮤니티 (`/community`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/community/json` | Bearer | JSON만 작성 |
| POST | `/community` | Bearer | `payload` + `files` |
| GET | `/community` | — | 목록 (`categoryId` 선택) |
| GET | `/community/categories` | — | 카테고리 |
| GET | `/community/:id` | — | 상세 |
| PATCH | `/community/:id` | Bearer | 수정 |
| DELETE | `/community/:id` | Bearer | 삭제 |

---

## 7. 공연 소식 (`/news`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/news/json` | Bearer | JSON만 |
| POST | `/news` | Bearer | `payload` + `files` |
| GET | `/news` | — | 목록 (`ListNewsQueryDto`) |
| GET | `/news/:id` | 선택(Optional JWT) | 상세 |
| PATCH | `/news/:id` | Bearer | 수정 |
| DELETE | `/news/:id` | Bearer | 삭제 |

---

## 8. 채팅 (`/chat`)

전부 **Bearer.** Socket 등 실시간 전송은 별도(WebSocket) 구성 가능.

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/chat/rooms/coffee` | 커피챗(일반 1:1) 방 목록 |
| GET | `/chat/rooms/applied` | 내가 지원한 공고 기준 1:1 방 목록 |
| GET | `/chat/rooms/by-post/:postId` | 내가 작성한 공고의 지원자별 방 — **작성자만** |
| POST | `/chat/rooms/coffee` | 커피챗 방 생성 또는 기존 반환 (`peerUserId`) |
| POST | `/chat/rooms/announcement` | 공고 1:1 방 생성/조회 |
| GET | `/chat/rooms/:roomId/messages` | 메시지 목록 (페이지네이션) |

---

## 9. 알림 (`/notifications`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/notifications/devices` | FCM 토큰 등록 |
| DELETE | `/notifications/devices` | FCM 토큰 해제 |
| GET | `/notifications` | 인박스 목록 |
| GET | `/notifications/unread-count` | 미읽음 개수 |
| PATCH | `/notifications/read-all` | 전체 읽음 |
| PATCH | `/notifications/recipients/:recipientId/read` | 단건 읽음 |
| POST | `/notifications/test-push` | 테스트 푸시 (`NOTIFICATION_TEST_PUSH=true`일 때만) |

---

## 10. 좋아요 (`/like`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/like` | Bearer | 좋아요 생성 |
| GET | `/like` | — | 목록 (쿼리) |
| GET | `/like/:id` | — | 단건 |
| DELETE | `/like/:id` | Bearer | id로 삭제 |
| DELETE | `/like` | Bearer | 대상 기준 삭제 (쿼리: `likeType`, `targetId`) |

---

## 11. 스크랩 (`/scrap`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/scrap` | Bearer | 스크랩 생성 |
| GET | `/scrap` | — | 목록 |
| GET | `/scrap/:id` | — | 단건 |
| DELETE | `/scrap/:id` | Bearer | id로 삭제 |
| DELETE | `/scrap` | Bearer | 대상 기준 삭제 (`targetType`, `targetId`) |

---

## 12. 댓글 (`/comment`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/comment` | Bearer | 작성 |
| GET | `/comment` | — | 목록 (`ListCommentQueryDto`) |
| GET | `/comment/:id` | — | 단건 |
| PATCH | `/comment/:id` | Bearer | 수정 |
| DELETE | `/comment/:id` | Bearer | 삭제 |

---

## 13. 팔로우 (`/follow`)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/follow/users/:userId/following` | — | 팔로잉 목록 |
| GET | `/follow/users/:userId/followers` | — | 팔로워 목록 |
| POST | `/follow` | Bearer | 팔로우 (`receiverId`) |
| DELETE | `/follow/:receiverId` | Bearer | 언팔로우 |

---

## 14. 차단 (`/block`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/block` | 차단 (`blockedId`) — 양방향 팔로우 해제 |
| DELETE | `/block/:blockedId` | 차단 해제 |

---

## 부록: 요청·응답 필드 상세

### A. 인증 (`/auth`)

**`POST /auth/kakao` · `POST /auth/google` — 요청**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `accessToken` | string | O | 각 플랫폼에서 발급한 OAuth 액세스 토큰 |

**`POST /auth/naver` — 요청 (한 가지 방식만)**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `accessToken` | string | △ | 네이티브 SDK 등 — 네이버 OAuth 액세스 토큰 (`access_token` 동일 의미) |
| `access_token` | string | △ | `accessToken`과 동일 별칭 |
| `code` | string | △ | 웹 인가 코드 (1회용) |
| `redirectUri` | string | △ | `code` 사용 시 — authorize 시와 동일한 redirect |
| `redirect_uri` | string | △ | `redirectUri`와 동일 문자열이어야 함 (둘 다 있을 때) |
| `state` | string | X | 인가 시 사용한 state |

`accessToken`/`access_token`이 있으면 **웹 code 플로우보다 우선**한다.

**`POST /auth/signup/*` — 요청 (`SocialSignupDto`)**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `accessToken` | string | O | 소셜 OAuth 토큰 (네이버 가입 시 로그인 응답의 네이버 토큰) |
| `activityName` | string | O | 활동 아이디 |
| `nickname` | string | X | 없으면 소셜 프로필 사용 |
| `role` | `"user"` \| `"admin"` | X | 미입력·잘못된 값은 `user` 취급 |

**`POST /auth/refresh` — 요청**

| 필드 | 타입 | 필수 |
|------|------|------|
| `refreshToken` | string | O |

**로그인·가입 성공 시 공통 응답 (예시)**

| 필드 | 타입 | 설명 |
|------|------|------|
| `accessToken` | string | 서비스 JWT (액세스) |
| `refreshToken` | string | 리프레시 JWT |
| `user` | object | `userId`, `nickname`, `email`, `profileImgUrl` |

**미가입 (소셜 로그인만 해당, 예: 네이버/카카오/구글에서 유저 미조회)**

| 필드 | 타입 | 설명 |
|------|------|------|
| `needsSignup` | `true` | 가입 필요 |
| `profile` | object | `socialId`, `nickname`, `email`, `profileImgUrl` |
| `naverAccessToken` | string | 네이버일 때 — 가입 API에 그대로 전달 (다른 이름으로 `oauthAccessToken` 동시 반환) |

---

### B. 지원서 (`/applications`)

**`CreateApplicationDto` — `POST /applications` 요청**  
(`application_config`에서 `include*`가 켜진 항목은 서비스에서 필수 검증)

| 필드 | 타입 | 설명 |
|------|------|------|
| `postId` | UUID | 모집공고 ID |
| `name` | string, max 255 | 이름 |
| `birth` | ISO 8601 문자열 | 생년월일 등 |
| `gender` | `FEMALE` \| `MALE` \| `NONE` | 성별 |
| `major` | string, max 255 | 전공 |
| `majorDetail` | string, max 255 | 세부 전공 |
| `category` | string, max 255 | 참가 부문 |
| `music` | string, max 500 | 참가곡 |
| `address` | string, max 500 | 주소 |
| `file` | 배열 | 아래 **스냅샷 `file[]`** |
| `link` | string, max 500 | 링크 |
| `department` | string, max 255 | 소속 학부 |
| `introduce` | string, max 2000 | 자기소개/지원 동기 |
| `education` | 배열 | **스냅샷 `education[]`** |
| `career` | 배열 | **스냅샷 `career[]`** |
| `award` | 배열 | **스냅샷 `award[]`** |
| `certificate` | 배열 | **스냅샷 `certificate[]`** |

**`UpdateApplicationDto`** — `PATCH /applications/:id` — 위와 동일 필드이나 **전부 optional**, `postId` 없음 (보낸 필드만 갱신).

**`UpdateApplicationStatusDto`** — `PATCH /applications/:id/status`

| 필드 | 타입 |
|------|------|
| `status` | `SUBMITTED` \| `DOCUMENT_REVIEW` \| `ACCEPTED` \| `REJECTED` |

**스냅샷 항목 (요청 JSON 한 객체당)**

| 구분 | 필드 |
|------|------|
| `file[]` | `fileId?`, `url?`, `originalName?` |
| `education[]` | `description`, `startedAt`, `endedAt` (null 가능) |
| `career[]` | `description`, `startedAt`, `endedAt`, `organization?` |
| `award[]` | `description`, `awardedAt` (null 가능), `organization?` |
| `certificate[]` | `description`, `obtainedAt` (null 가능), `organization?` |

날짜는 ISO 8601 문자열.

**지원서 엔티티 응답 (`GET`·`POST`·`PATCH` 등으로 반환 시)** — DB 컬럼과 대응

| 필드 | 타입 | 비고 |
|------|------|------|
| `id` | UUID | |
| `postId` | string | |
| `userId` | string | 지원자 |
| `name` ~ `introduce` | string \| null | 스칼라 필드 |
| `birth` | datetime 문자열 \| null | |
| `gender` | enum \| null | `FEMALE` / `MALE` / `NONE` |
| `file`, `education`, `career`, `award`, `certificate` | JSON 배열 \| null | 스냅샷 |
| `status` | enum | 심사 상태 |
| `createdAt` | datetime | |
| `canceledAt` | datetime \| null | |
| `deletedAt` | datetime \| null | 소프트 삭제 시에만 값 (일반 조회에선 제외) |

관계 `announcement`·`user`는 로드 여부에 따라 포함될 수 있음.

---

### C. 모집 공고 (`/announcement`)

**`CreateAnnouncementDto` — `POST /announcement/json` 본문 또는 multipart의 `payload` JSON**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | O | 제목 |
| `content` | string | O | 본문 |
| `deadlineAt` | ISO 8601 | O | 마감 |
| `scheduledAt` | ISO 8601 | O | 예정일 |
| `status` | enum | X | 기본 `OPEN` 등 (`AnnouncementStatus`) |
| `address` | string | O | 공연 위치 |
| `fileId` | UUID \| null | X | 대표 썸네일 파일 ID |
| `categoryId` | UUID | O | 공고 유형 |
| `majorIds` | UUID[] | X | 모집 전공 |
| `applicationConfig` | object | O | 아래 표 |

**`ApplicationConfigDto` — `applicationConfig`**

| 필드 | 타입 | 설명 |
|------|------|------|
| `includeName` | boolean | 이름 |
| `includeBirth` | boolean | 출생연도 |
| `includeGender` | boolean | 성별 |
| `includeMajor` | boolean | 전공 |
| `includeMajorDetail` | boolean | 세부전공 |
| `includeEducation` | boolean | 학력 |
| `includeCategory` | boolean | 참가부문 |
| `includeMusic` | boolean | 참가곡 |
| `includeAddress` | boolean | 배송 주소 |
| `includeFile` | boolean | 사진/영상/파일 |
| `includeLink` | boolean | 링크 |
| `includeDepartment` | boolean | 소속학부 |
| `includeCareer` | boolean | 경력 |
| `includeIntroduce` | boolean | 자기소개/지원동기 |

`PATCH /announcement/:id`는 수정 DTO(`UpdateAnnouncementDto`) 기준이며, Swagger 참고.

---

### D. 유저 (`/users`)

**`PATCH /users/profile/my` — 요청**

- `application/json`: **`UpdateUserDto`** 그대로  
- `multipart/form-data`: 필드 `payload` = `UpdateUserDto` JSON 문자열, 선택 파일 `profileImage`

**`UpdateUserDto`**

| 필드 | 제약 | 설명 |
|------|------|------|
| `nickname` | 1~20자 | |
| `activityName` | 1~20자 | |
| `aboutMe` | 0~100자 | |
| `selfIntroduction` | 0~300자 | |
| `role` | `user` \| `admin` | |
| `email` | 이메일, max 320 | |
| `phoneNumber` | 1~13자 | |
| `profileImgUrl` | string | |
| `isEmailSubscribed` | boolean | |
| `isPushEnabled` | boolean | |
| `socialProvider` | `kakao` \| `google` \| `naver` | |
| `socialId` | string | |
| `majorId` | UUID | |
| `educations` | `UpdateEducationDto[]` | 아래 |
| `careers` | `UpdateCareerDto[]` | 아래 |
| `awards` | `UpdateAwardDto[]` | 아래 |

**`UpdateEducationDto`:** `educationId?`, `description` 1~100, `startedAt`, `endedAt?`  
**`UpdateCareerDto`:** `careerId?`, `description` 1~100, `startedAt`, `endedAt`, `organization?` (max 10)  
**`UpdateAwardDto`:** `awardId?`, `description` 1~100, `awardedAt?`, `organization?` (max 10)

**`GET /users/profile/my` 응답 (`ProfileResponseDto` 요약)**

| 필드 | 설명 |
|------|------|
| `userId`, `profileImgUrl`, `nickname`, `activityName`, `role` | |
| `aboutMe`, `selfIntroduction` | |
| `educations`, `careers`, `awards` | 엔티티 배열 (내부 필드는 Education/Career/Award 엔티티) |
| `major` | Major 엔티티 |
| `contact` | `{ email, phoneNumber }` |
| `followingCount`, `followerCount` | 숫자 |

**`GET /users/:id/profile` 응답 (`PublicProfileResponseDto`)** — 위와 같으나 **`contact` 없음**, 일부 필드 null 가능.

**`GET /users/check-activity-name`** — 쿼리 `activityName` — 응답 `{ "available": boolean }`.

---

### E. 커뮤니티 · 공연 소식

**`CreateCommunityDto` — `POST /community/json` 또는 multipart `payload`**

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | O | |
| `content` | O | |
| `categoryId` | O | 카테고리 ID |
| `fileId` | X | 대표 파일 |

**`CreateNewsDto` — `POST /news/json` 또는 `payload`**

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | O | max 100 |
| `content` | O | max 255 |
| `place` | O | max 100 |
| `ticketPrice` | X | 정수 ≥ 0 또는 null |
| `startedAt` | O | ISO 8601 |
| `endedAt` | X | null 가능 |
| `contact` | O | max 30 |
| `fileId` | X | 썸네일 |

수정은 각 `UpdateCommunityDto`, `UpdateNewsDto` (Swagger/DTO 파일 참고).

---

### F. 좋아요 · 스크랩 · 댓글

**`POST /like` — `CreateLikeDto`**

| 필드 | 값 |
|------|-----|
| `likeType` | `NEWS` \| `COMMUNITY` \| `ANNOUNCEMENT` \| `COMMENT` |
| `targetId` | UUID |

**`DELETE /like` (쿼리)** — `likeType`, `targetId`

**`POST /scrap` — `CreateScrapDto`**

| 필드 | 값 |
|------|-----|
| `targetType` | `NEWS` \| `COMMUNITY` \| `ANNOUNCEMENT` |
| `targetId` | UUID |

**`DELETE /scrap` (쿼리)** — `targetType`, `targetId`

**`POST /comment` — `CreateCommentDto`**

| 필드 | 설명 |
|------|------|
| `content` | 본문 (non-empty) |
| `targetType` | `NEWS` \| `COMMUNITY` |
| `targetId` | UUID |
| `parentId` | UUID, 선택 — 대댓글 |

**`PATCH /comment/:id` — `UpdateCommentDto`:** `content?`

---

### G. 팔로우 · 차단

**`POST /follow` — `FollowUserDto`:** `receiverId` (UUID)

**`POST /block` — `BlockUserDto`:** `blockedId` (UUID)

---

### H. 알림 (`/notifications`)

**`POST /notifications/devices` — `RegisterPushDeviceDto`**

| 필드 | 설명 |
|------|------|
| `fcmToken` | 10~512자 |
| `platform` | `IOS` \| `ANDROID` \| `WEB` (선택) |

**`DELETE /notifications/devices` — body**

| 필드 | 설명 |
|------|------|
| `fcmToken` | 해제할 토큰 |

---

### I. 채팅 (`/chat`)

**`POST /chat/rooms/coffee` — `CreateCoffeeRoomDto`**

| 필드 | 설명 |
|------|------|
| `peerUserId` | 상대 유저 UUID |

**`POST /chat/rooms/announcement` — `CreateAnnouncementChatRoomDto`**

| 필드 | 설명 |
|------|------|
| `postId` | 모집공고 ID |
| `applicantUserId` | 선택 — 공고 작성자가 특정 지원자 지정 시 |

목록·메시지 응답은 쿼리 DTO(`ListChatRoomsQueryDto`, `ListMessagesQueryDto`) 및 서비스 반환 객체 — **Swagger** 참고.

---

## 모듈별 상세 문서

| 주제 | 경로 |
|------|------|
| 지원서·프로필 스냅샷·DB 유니크 | [`src/apis/application/README.md`](src/apis/application/README.md) |
| 인증·네이버·카카오 | [`src/apis/auth/README.md`](src/apis/auth/README.md) |
| 알림·FCM | [`src/apis/notice/README.md`](src/apis/notice/README.md) |

이 저장소에서 `npm install` 후 `npm run start:dev`로 기동한다.
