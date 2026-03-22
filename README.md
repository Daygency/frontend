# Daygency API 명세 — 유저 목록·상세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 유저 목록 조회 (가입일 최신순, 무한 스크롤)

가입일(`createdAt`) 기준 **최신순**으로 유저를 페이지 단위로 가져옵니다. 무한 스크롤은 **커서** 방식입니다.

### Endpoint

```
GET /users
```

### Query Parameters

| 파라미터   | 타입   | 필수 | 기본값 | 설명 |
|------------|--------|------|--------|------|
| limit      | number | X    | 20     | 한 번에 가져올 개수 (1–50) |
| cursor     | string | X    | —      | **직전 응답의 `nextCursor`** 값. 첫 요청에서는 생략 |
| majorIds   | string | X    | —      | 전공 UUID를 **콤마(`,`)로 여러 개** 지정. 해당 전공 **중 하나라도** 일치하는 유저만 (OR). 미지정 시 전공 필터 없음 |

### 정렬

- `createdAt` **내림차순** (최근 가입자가 먼저)
- 동일 시각이면 `userId` 내림차순

### Response

| 필드        | 타입    | 설명 |
|-------------|---------|------|
| items       | array   | 유저 요약 목록 |
| items[].userId | string | 유저 ID (UUID) |
| items[].nickname | string | 닉네임 |
| items[].activityName | string | 활동명 |
| items[].profileImgUrl | string | 프로필 이미지 URL |
| items[].aboutMe | string \| null | 한 줄 소개 |
| items[].createdAt | string (ISO 8601) | 가입일 |
| items[].major | object \| null | `{ majorId, name }`. 전공 미설정이면 `null` |
| nextCursor  | string \| null | 다음 페이지 요청 시 `cursor`에 넣을 값. 없으면 `null` |
| hasMore     | boolean | 다음 페이지 존재 여부 |

### 참고

- 인증 불필요 (public)
- `majorIds`를 지정하면 **전공이 없는 유저는 결과에 포함되지 않음**

### Example

**Request (첫 페이지)**

```
GET /users?limit=20
```

**Request (전공 필터 + 다음 페이지)**

```
GET /users?limit=20&majorIds=uuid1,uuid2&cursor=<이전_nextCursor>
```

**Response**

```json
{
  "items": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "nickname": "닉네임",
      "activityName": "activity_id",
      "profileImgUrl": "https://...",
      "aboutMe": "소개",
      "createdAt": "2025-03-01T12:00:00.000Z",
      "major": { "majorId": "...", "name": "피아노" }
    }
  ],
  "nextCursor": "eyJjYSI6IjIwMjUtMDMtMDFUMTI6MDA6MDAuMDAwWiIsInVpZCI6Ii4uLiJ9",
  "hasMore": true
}
```

---

## 유저 상세 조회 (포트폴리오, 공개)

특정 유저의 **프로필·포트폴리오**를 조회합니다. `GET /users/profile/my`(내 프로필)와 **같은 본문 필드**이나, **이메일·전화번호 등 연락처는 포함하지 않습니다.**

### Endpoint

```
GET /users/:id/profile
```

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명 |
|----------|--------|------|------|
| id       | string (UUID) | O | 조회할 유저의 `userId` |

### Response

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | string | 유저 ID |
| profileImgUrl | string | 프로필 이미지 URL |
| nickname | string | 닉네임 |
| activityName | string | 활동명 |
| role | string | 역할 (`user` / `admin` 등) |
| aboutMe | string | 소개 |
| selfIntroduction | string | 자기소개 |
| educations | array | 학력 목록 |
| careers | array | 경력 목록 |
| awards | array | 수상 목록 |
| major | object \| null | 전공 `{ majorId, name }` |

`contact`(이메일, 전화번호)는 **내 프로필 API**에서만 제공됩니다.

### Errors

| HTTP | 설명 |
|------|------|
| 404 | 해당 유저 없음 또는 삭제된 계정 |

### 참고

- 인증 불필요 (public)
- 삭제(soft delete)된 유저는 404

### Example

**Request**

```
GET /users/550e8400-e29b-41d4-a716-446655440000/profile
```

**Response**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "profileImgUrl": "https://...",
  "nickname": "닉네임",
  "activityName": "activity_id",
  "role": "user",
  "aboutMe": "소개",
  "selfIntroduction": "자기소개",
  "educations": [],
  "careers": [],
  "awards": [],
  "major": { "majorId": "...", "name": "피아노" }
}
```
