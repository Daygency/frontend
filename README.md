# Daygency API 요약

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 프로필 응답 필드 (팔로우 집계)

백엔드(mbackend, NestJS)와 동일하게, 아래 조회 응답 JSON에 **`followingCount`**, **`followerCount`** (number)가 포함됩니다.

| API | 인증 |
|-----|------|
| `GET /users/profile/my` | 필요 |
| `GET /users/:id/profile` | 불필요 (토큰이 있으면 전달 시 추가 필드 가능) |
| `PATCH /users/profile/my` 성공 응답 | 필요 |

- **`followingCount`**: 그 유저가 팔로우한 사람 수  
- **`followerCount`**: 그 유저를 팔로우한 사람 수  

프론트는 `src/lib/apis/portfolio/profileApi.ts`의 `getMyProfile` / `getUserPublicProfile`에서 위 필드를 우선 반영합니다.

---

## 상대(타인) 프로필 조회

내 프로필(`GET /users/profile/my`)과 같은 포트폴리오 필드이나, **이메일·전화번호는 없습니다.**

### Endpoint

```
GET /users/:id/profile
```

| Path | 타입 | 설명 |
|------|------|------|
| id | UUID | 조회할 상대의 `user_id` |

- **인증**: 불필요
- **404**: 해당 유저 없음

---

## 팔로우 / 차단

`follow`·`block`은 각각 복합 PK (`sender_id`+`receiver_id`, `blocker_id`+`blocked_id`).  
**차단 시** 서버가 두 유저 사이 **양방향 팔로우**를 모두 지운 뒤 `block` 행을 저장합니다.

### 팔로우

```
POST /follow
```

`Authorization: Bearer <access_token>` 필수

| Body | 타입 | 필수 | 설명 |
|------|------|------|------|
| receiverId | UUID | O | 팔로우할 상대 `user_id` |

- 자기 자신 불가 · 차단 관계면 403 · 이미 팔로우면 409

### 언팔로우

```
DELETE /follow/:receiverId
```

`Authorization: Bearer <access_token>` 필수

### 차단

```
POST /block
```

`Authorization: Bearer <access_token>` 필수

| Body | 타입 | 필수 | 설명 |
|------|------|------|------|
| blockedId | UUID | O | 차단할 상대 `user_id` |

- 트랜잭션으로 양방향 팔로우 삭제 후 `block` 저장 · 이미 차단이면 409

### 차단 해제

```
DELETE /block/:blockedId
```

`Authorization: Bearer <access_token>` 필수

---

## 특정 유저 팔로잉 / 팔로워 목록

**최근 팔로우(또는 팔로우된) 시점이 늦은 순**으로 정렬합니다. **커서 기반** 페이지네이션입니다.

### 팔로잉 (이 유저가 팔로우한 사람들)

```
GET /follow/users/:userId/following
```

| Path | 설명 |
|------|------|
| userId | 대상 유저 `user_id` (UUID) |

- **인증**: 불필요

### 팔로워 (이 유저를 팔로우한 사람들)

```
GET /follow/users/:userId/followers
```

| Path | 설명 |
|------|------|
| userId | 대상 유저 `user_id` (UUID) |

- **인증**: 불필요

### Query (공통)

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| cursor | string | 아니오 | 직전 응답의 `nextCursor` (첫 요청은 생략) |
| limit | number | 아니오 | 페이지 크기, 기본 20, 최대 50 |

### Response (공통)

| 필드 | 설명 |
|------|------|
| items | 목록 항목 배열 |
| items[].userId | 유저 `user_id` |
| items[].nickname | 닉네임 |
| items[].activityName | 활동명 |
| items[].profileImgUrl | 프로필 이미지 URL |
| items[].followedAt | 팔로우 관계가 생긴 시각 (`follow.created_at`) |
| nextCursor | 다음 페이지용 커서, 없으면 `null` |
| hasMore | 다음 페이지 존재 여부 |

- **팔로잉**: `followedAt`은 대상 유저가 그 사람을 팔로우한 시각입니다.
- **팔로워**: `followedAt`은 그 사람이 대상 유저를 팔로우한 시각입니다.

### 오류

| 상태 | 설명 |
|------|------|
| 404 | `userId`에 해당하는 유저 없음 |
| 400 | `cursor` 형식이 잘못됨 |

### Example

```
GET /follow/users/550e8400-e29b-41d4-a716-446655440000/following?limit=20
```

```json
{
  "items": [
    {
      "userId": "…",
      "nickname": "…",
      "activityName": "…",
      "profileImgUrl": "…",
      "followedAt": "2025-03-01T12:00:00.000Z"
    }
  ],
  "nextCursor": "…",
  "hasMore": false
}
```

다음 페이지:

```
GET /follow/users/550e8400-e29b-41d4-a716-446655440000/following?limit=20&cursor=<직전 nextCursor>
```

---

더 많은 엔드포인트는 `docs/api-readme.md`를 참고하세요.
