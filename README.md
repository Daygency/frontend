# 신고 (Report)

## API 명세

### `GET /reports/categories`

**설명:** 신고 시 `category`에 넣을 enum 값과 한글 표시 라벨 목록을 반환한다.

**인증:** 없음

**Response 200 OK**

```typescript
interface ReportCategoriesResponse {
  categories: Array<{
    value: ReportCategory;
    labelKo: string;
  }>;
}
```

`value`는 `POST /reports`의 `category`와 동일하며, `labelKo`는 UI 표기용이다. 순서는 아래 **ReportCategory** 표와 같다.

---

### `POST /reports`

**설명:** 로그인한 사용자가 다른 사용자를 신고한다. (커뮤니티 글 / 공연 소식 / 댓글 / 모집 공고 중 하나를 근거로 제출)

**인증:** 필수 — `Authorization: Bearer <access_token>`

**Request headers**

| 이름 | 값 |
|------|-----|
| `Content-Type` | `application/json` |

**Request body (JSON)**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `reportedUserId` | `string` (UUID) | O | 신고 대상 **사용자** ID |
| `category` | `string` (enum) | O | 아래 **ReportCategory** |
| `targetType` | `string` (enum) | O | 아래 **ReportTargetType** |
| `targetId` | `string` (UUID) | O | 대상 콘텐츠 ID (`targetType`에 따라 다름) |

**ReportTargetType**

| 값 | `targetId` 의미 |
|----|------------------|
| `COMMUNITY` | 커뮤니티 글 ID (`community_id`) |
| `NEWS` | 공연 소식 글 ID (`news_id`) |
| `COMMENT` | 댓글 ID (`comment.id`) |
| `ANNOUNCEMENT` | 모집 공고 ID (`post_id`) |

**ReportCategory** (API 값 — 한글은 UI 표기용)

| API 값 | 한글(표시용) |
|--------|----------------|
| `HATE_OR_SLUR` | 혐오/욕설 표현 |
| `SPAM` | 스팸/도배 |
| `HARMFUL_TO_YOUTH` | 청소년 유해 |
| `ILLEGAL` | 불법정보 포함 |
| `OBSCENE` | 음란물 |
| `OFFENSIVE` | 불쾌한 표현 |

**Request body 예시**

```json
{
  "reportedUserId": "550e8400-e29b-41d4-a716-446655440000",
  "category": "SPAM",
  "targetType": "COMMUNITY",
  "targetId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response 201 Created**

```typescript
interface CreateReportResponse {
  ok: true;
  reportedUserId: string;
  /** 피신고자에 대한 누적 신고 건수(이번 접수 포함) */
  totalReportsAgainstUser: number;
}
```

**에러 HTTP 상태**

| 상태 | 조건 |
|------|------|
| **400** | 본인을 신고함 / 대상 글·댓글의 작성자가 `reportedUserId`와 불일치 |
| **401** | 미인증, 또는 계정 `activity === BAN`(이용 제한 — 액세스·리프레시 토큰 모두) |
| **403** | 신고자↔피신고자 **차단 관계**가 있음 (한쪽이 다른 쪽을 차단한 경우) |
| **404** | 피신고 사용자 없음 / 대상 콘텐츠 없음 |
| **409** | 동일 신고자가 **이미 해당 사용자**를 신고함 (`reporter`–`reported_user` 유니크) |

---

## 서버 규칙 요약

1. **자기 자신 신고 불가** (`reporterId === reportedUserId`).
2. **피신고 사용자 존재** 여부 확인 (`user` 행).
3. **차단 관계**면 신고 불가 (`block`: `blocker_id`/`blocked_id` 양방향 중 하나라도 일치).
4. **동일 (신고자, 피신고자)** 조합은 DB 유니크로 **1회만** 신고 가능.
5. 대상 콘텐츠가 존재하고, **작성자 `user_id`가 `reportedUserId`와 일치**해야 함.
6. 피신고자에 대한 **누적 신고 건수**가 `REPORT_LIMIT`을 **초과**하면 (`totalReportsAgainstUser > REPORT_LIMIT`), 해당 사용자 `User.activity`가 `NORMAL`일 때 **`FLAGGED`** 로 변경.  
   - 기본 한도: **5** (`REPORT_LIMIT` 환경변수로 변경 가능). 즉 **6번째** 신고 접수 시 조건 충족 시 `FLAGGED`.

---

## `User.activity` (계정 조치 상태)

| 값 | 의미 |
|----|------|
| `NORMAL` | 일반 |
| `FLAGGED` | 신고 누적으로 조치 필요(표시) |
| `BAN` | 이용 제한 — **액세스 JWT 검증 시 401** (로그인·API 사용 불가) |

`BAN` 은 관리자·배치 등 **별도**에서 올리는 것을 가정 (신고 API만으로 자동 `BAN` 하지는 않음).

---

## 엔티티 · 코드 위치

| 내용 | 경로 |
|------|------|
| `report` 테이블 | `entities/report.entity.ts` |
| 한도 상수 | `constants/report.constants.ts` (`REPORT_LIMIT`, `process.env.REPORT_LIMIT`) |
| 서비스 | `report.service.ts` |
| 컨트롤러 | `report.controller.ts` |
| 카테고리 라벨·순서 | `constants/report-categories.ts` |
| 사용자 `activity` | `../user/entities/user.entity.ts` — `UserActivity` |
| 액세스 토큰 `BAN` 거부 | `../auth/strategies/jwt-access.strategy.ts` |
| 탈퇴 시 `report` 행 삭제 | `../user/utils/user-hard-delete-cascade.ts` |

---

## TypeScript (요청/응답 참고)

```typescript
import type { ReportCategory, ReportTargetType } from 'src/apis/report/entities/report.entity';

type CreateReportRequestBody = {
  reportedUserId: string;
  category: ReportCategory;
  targetType: ReportTargetType;
  targetId: string;
};

type CreateReportResponseBody = {
  ok: true;
  reportedUserId: string;
  totalReportsAgainstUser: number;
};
```
