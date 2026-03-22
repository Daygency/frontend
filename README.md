# Daygency API — 팔로우 / 차단

> Base URL: 개발 `http://localhost:3000`  
> 모든 엔드포인트에 `Authorization: Bearer <access_token>` 필요

---

## 팔로우 `POST /follow`

**Body (JSON)**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| receiverId | string (UUID) | O | 팔로우할 상대 `user_id` |

- 자기 자신 불가
- **차단 관계**(서로 중 한 명이 다른 쪽을 차단)가 있으면 403
- 이미 팔로우 중이면 409

---

## 언팔로우 `DELETE /follow/:receiverId`

- Path `receiverId`: 언팔로우할 상대 UUID
- 팔로우 관계 없으면 404

---

## 차단 `POST /block`

**Body (JSON)**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| blockedId | string (UUID) | O | 차단할 상대 `user_id` |

- 자기 자신 불가
- **차단 저장 전에** 두 유저 간 **양방향 팔로우** `(A→B)`, `(B→A)`가 **모두 삭제**됨
- 이미 같은 차단이 있으면 409

---

## 차단 해제 `DELETE /block/:blockedId`

- Path `blockedId`: 차단 해제할 상대 UUID
- 차단 관계 없으면 404
