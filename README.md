# User API Spec (Frontend)

프론트 연동 시 자주 사용하는 사용자 API 스펙입니다.

## 1) 사용자 목록 조회

- **Method**: `GET`
- **Path**: `/users`
- **Auth**: 불필요 (Public)
- **Query**
  - `cursor?: string`
  - `limit?: number` (기본 20, 최대 50)
  - `majorIds?: string` (콤마 구분 UUID 목록)

### Response (200)

```json
{
  "items": [
    {
      "userId": "string",
      "nickname": "string",
      "activityName": "string",
      "profileImgUrl": "https://...",
      "aboutMe": "string or null",
      "createdAt": "2026-03-24T10:00:00.000Z",
      "major": {
        "majorId": "string",
        "name": "string"
      }
    }
  ],
  "nextCursor": "string or null",
  "hasMore": true
}
```

- `profileImgUrl`가 사용자 목록 응답에 포함됩니다.

## 2) 내 프로필 수정 (이미지 업로드 지원)

- **Method**: `PATCH`
- **Path**: `/users/profile/my`
- **Auth**: 필요 (`Bearer access token`)
- **Content-Type**
  - `application/json` 또는
  - `multipart/form-data`

### A. JSON 요청 (기존 방식)

```json
{
  "nickname": "newNickname",
  "aboutMe": "소개 문구",
  "majorId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### B. multipart/form-data 요청 (이미지 + 데이터 동시 수정)

- `profileImage`: 이미지 파일 1개 (`file`)
- `payload`: `UpdateUserDto` JSON 문자열

`payload` 예시:

```json
{
  "nickname": "newNickname",
  "aboutMe": "소개 문구",
  "selfIntroduction": "자기소개"
}
```

form-data 예시:

- `profileImage` = (binary image file)
- `payload` = `{"nickname":"newNickname","aboutMe":"소개 문구"}`

### Response (200)

`GET /users/profile/my`와 동일한 프로필 응답을 반환합니다.

- `profileImgUrl`은 업로드된 이미지 URL로 갱신됩니다.
- 파일을 보내지 않으면 기존 `profileImgUrl`은 유지됩니다.
