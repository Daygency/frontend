# 모집공고 (Announcement)

Base path: `/announcement` (인증·쿼리는 각 엔드포인트 참고). Swagger: `/api` → **announcements** 태그.

---

## 금액: `priceType` + `price`

DB에는 **`price_type`(enum)** 과 **`price`(정수, 원)** 두 컬럼이 있다. 프론트·API 응답 필드명은 **`priceType`**, **`price`** 이다.

### `AnnouncementPriceType` (문자열 enum)

| 값 | 의미 |
|----|------|
| `EXPENSE` | 참가비 |
| `INCOME` | 수입 |
| `FREE` | 무료 |
| `PENDING` | 협의 가능 |

### `price`

- **0 이상** 정수(원). DTO에서 `@Min(0)` 로 검증한다.
- 의미는 **`priceType`과 조합**해서 해석한다.
  - **`FREE`**, **`PENDING`** 일 때는 보통 **`0`** 을 쓰면 된다.
  - **`EXPENSE`**, **`INCOME`** 일 때는 실제 금액 등으로 **`price`** 에 숫자를 넣는 식으로 쓰면 된다(도메인 규칙은 제품에 맞게).

### TypeScript 타입 (참고)

```typescript
import type { AnnouncementPriceType } from 'src/apis/announcement/entities/announcement.entity';
// 또는 문자열 리터럴 유니온: 'EXPENSE' | 'INCOME' | 'FREE' | 'PENDING'

/** 작성·수정 요청 (CreateAnnouncementDto / UpdateAnnouncementDto) */
interface AnnouncementPriceFields {
  /** 생략 시 서버에서 FREE */
  priceType?: AnnouncementPriceType;
  /** 생략 시 0 */
  price?: number;
}

/** 목록·일부 요약 응답에 포함 */
interface AnnouncementListPriceFields {
  priceType: AnnouncementPriceType;
  price: number;
}
```

---

## 작성·수정 (`CreateAnnouncementDto` / `UpdateAnnouncementDto`)

- **`priceType`**: 선택. 생략 시 **`FREE`** 로 저장된다.
- **`price`**: 선택. 생략 시 **`0`** 이다.
- 수정(`PATCH`) 시에는 보낸 필드만 갱신한다(`UpdateAnnouncementDto`는 `PartialType`).

---

## 응답에 `priceType` / `price` 가 실리는 곳

| 구분 | 설명 |
|------|------|
| 공고 목록·내 공고 목록 | `AnnouncementService` 목록 아이템에 둘 다 포함 |
| 공고 상세 | `findOne` — 엔티티 스프레드 + `isMine` 등 |
| 홈 | `latestAnnouncements` 항목 |
| 사용자 마이페이지 | 작성 글·내 공고·스크랩 공고·포스트 하이라이트 등 공고가 붙는 응답 |

---

## 관련 코드

| 내용 | 위치 |
|------|------|
| enum·컬럼 정의 | `entities/announcement.entity.ts` |
| 작성 DTO | `dto/create-announcement.dto.ts` |
| 수정 DTO | `dto/update-announcement.dto.ts` |
| 생성·수정·목록 매핑 | `announcement.service.ts` |
