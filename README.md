# Daygency Backend

NestJS API 서버입니다.

| 항목 | 값 |
|------|-----|
| 기본 포트 | `3000` (`PORT` 환경변수) |
| Swagger | `http://localhost:3000/api` |
| 인증 | `Authorization: Bearer <access_token>` |

```bash
npm install
# .env 에 DATABASE_*, JWT 등 설정 후
npm run start:dev
```

---

## 공고 상세 — `applicationConfig` 포함

`GET /announcement/:id` (공고 상세 조회) 응답에 **`applicationConfig`** 가 함께 내려옵니다. 지원서 양식이 없는 공고면 `applicationConfig` 가 `null` 일 수 있습니다.

`applicationConfig` 필드 의미 (각각 해당 항목을 지원 폼에 **포함할지** 여부, DB는 tinyint/boolean):

| 필드 | 설명 |
|------|------|
| `postId` | 공고 ID와 동일 |
| `includeName` | 이름 |
| `includeBirth` | 출생연도 |
| `includeGender` | 성별 |
| `includeMajor` | 전공 |
| `includeMajorDetail` | 세부전공 |
| `includeEducation` | 학력 |
| `includeCategory` | 참가부문 |
| `includeMusic` | 참가곡 |
| `includeAddress` | 주소 |
| `includeFile` | 파일 첨부 여부 |
| `includeLink` | 링크 |
| `includeDepartment` | 소속학부 |
| `includeCareer` | 경력 |
| `includeIntroduce` | 자기소개/지원동기 |

프론트에서는 이 값으로 지원 폼 필드를 노출·필수 처리한 뒤, `POST /applications` 등에 응답 값을 맞춰 보내면 됩니다. 상세 응답에는 `category`, `majors`, 로그인 시 `isMine` 도 포함됩니다.

---

## 모집 지원서 API (`/applications`)

지원서를 **제출하면**(`POST /applications` 성공 시) 다음이 자동으로 처리됩니다.

1. 해당 공고와 지원자 1:1 **공고 전용 채팅방**(`chat_room`, `kind: ANNOUNCEMENT`)이 없으면 생성합니다. (이미 있으면 재사용만 하며, 첫 메시지는 중복 전송하지 않습니다.)
2. 지원자가 다음 **첫 메시지**를 보냅니다. (공고 제목이 반영됩니다.)

   `[{공고 제목}] 공고에 신청하였습니다.`

프론트는 지원 완료 후 `GET /chat/rooms/applied` 또는 `GET /chat/rooms/by-post/:postId` 등으로 방 목록을 새로고침하고, 소켓 `namespace /chat`에서 `joinRoom` 후 `message` 이벤트로 실시간 수신을 맞추면 됩니다.

| Method | URL | 설명 |
|--------|-----|------|
| `POST` | `/applications` | 지원서 제출 (공고당·유저당 1건) |
| `GET` | `/applications/post/:postId/me` | 해당 공고에 내 지원서 |
| `GET` | `/applications/post/:postId` | 해당 공고 지원 목록 (작성자만) |
| `GET` | `/applications/:id` | 지원서 단건 (지원자 또는 공고 작성자) |
| `PATCH` | `/applications/:id` | 지원서 수정 (지원자 본인, 마감 전·OPEN) |

Body 스키마·에러 코드는 Swagger `applications` 태그를 참고하세요.

---

기타 엔드포인트는 `http://localhost:3000/api` 에서 확인할 수 있습니다.
