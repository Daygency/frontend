# 채팅 API 명세

## 도메인 요약 (변경 반영)

- **참가자:** `chat_room_member`로 방–사용자 **다대다**. 현재 제품은 1:1만 사용한다.
- **COFFEE:** 커피챗 1:1. 방에 `application`·`announcement` 없음.
- **ANNOUNCEMENT:** 모집공고 스레드 1:1. **지원서(`application`) 1건당 방 1개** — DB 유니크 `UQ_chat_room_application` (`form_id` → `application.id`).
- **소프트 삭제:** `chat_room`, `chat_room_member`, `message`에 `deleted_at`. 목록·조회·검색은 삭제되지 않은 행만 사용. DB FK는 **CASCADE 없음** — 삭제는 애플리케이션에서 소프트 삭제로 처리한다.

---

## 공통

- **HTTP Base:** `GET|POST /chat/...` (글로벌 prefix 없음)
- **인증:** 보호 엔드포인트는 `Authorization: Bearer <access_token>`
- **Swagger:** 서버 기동 후 `/api` 에서 동일 태그 `chat` 확인 가능
- **날짜:** 응답 JSON에서 `Date`는 일반적으로 **ISO 8601 문자열**로 직렬화된다.

---

## 1. `GET /chat/rooms/coffee`

커피챗(일반 1:1) 채팅방 목록 — **본인이 멤버인 방만**, 삭제되지 않은 방만.

### Query (`ListChatRoomsQueryDto`)

| 필드 | 타입 | 기본 | 설명 |
|------|------|------|------|
| `cursor` | UUID (선택) | 없음 | 이전 페이지 마지막으로 받은 `chat_room.id`. 없으면 첫 페이지 |
| `limit` | number | `20` | 1~50 |

### 응답 200 — `ChatRoomListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "kind": "COFFEE",
      "post": null,
      "peer": {
        "userId": "uuid",
        "nickname": "string",
        "activityName": "string",
        "profileImgUrl": "string"
      },
      "lastMessage": {
        "content": "string | null",
        "createdAt": "2026-01-01T00:00:00.000Z"
      },
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "nextCursor": "uuid | null",
  "hasMore": true
}
```

- `lastMessage`: 해당 방에 메시지가 없으면 `null`. (삭제된 메시지는 제외)

---

## 2. `GET /chat/rooms/applied`

**내가 지원자인** 공고 1:1 채팅방 목록 (지원서 기준).

### Query

`GET /chat/rooms/coffee` 와 동일 (`cursor`, `limit`).

### 응답 200

구조는 동일하나 `kind` 가 항상 `"ANNOUNCEMENT"` 이며 `post` 가 채워질 수 있다.

```json
{
  "items": [
    {
      "id": "uuid",
      "kind": "ANNOUNCEMENT",
      "post": {
        "postId": "uuid",
        "title": "공고 제목"
      },
      "peer": {
        "userId": "uuid",
        "nickname": "string",
        "activityName": "string",
        "profileImgUrl": "string"
      },
      "lastMessage": null,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "nextCursor": null,
  "hasMore": false
}
```

---

## 3. `GET /chat/rooms/by-post/:postId`

**내가 작성한** 특정 공고에 대해, 지원자별 1:1 채팅방 목록 — **공고 작성자만**.

### Path

| 파라미터 | 설명 |
|----------|------|
| `postId` | 모집공고 UUID |

### Query

`cursor`, `limit` — 위와 동일.

### 응답 200

`ChatRoomListResponse` — `kind` 는 `"ANNOUNCEMENT"`, `peer` 는 해당 스레드의 상대(지원자 또는 모집자).

### 에러

- `404` — 공고 없음  
- `403` — 본인이 작성한 공고가 아님  

---

## 4. `POST /chat/rooms/coffee`

커피챗 1:1 방 **조회 또는 생성** (이미 있으면 기존 방 반환).

### Request body — `CreateCoffeeRoomDto`

```json
{
  "peerUserId": "uuid"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `peerUserId` | UUID | 1:1 대화 상대 사용자 ID |

### 응답 200 — `ChatRoom` 엔티티

생성/조회 후 `members` 등 관계가 로드된 경우가 있다. 예시:

```json
{
  "id": "uuid",
  "kind": "COFFEE",
  "application": null,
  "announcement": null,
  "members": [
    {
      "id": "uuid",
      "joinedAt": "2026-01-01T00:00:00.000Z",
      "deletedAt": null,
      "user": {
        "userId": "uuid",
        "nickname": "…",
        "activityName": "…",
        "profileImgUrl": "…"
      }
    }
  ],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

- `members`·`user` 내부 필드는 TypeORM 직렬화에 따라 일부만 노출될 수 있다.
- **참고:** 공고와 무관한 방이므로 `application`·`announcement` 는 `null` 이다.

### 에러 (예시)

- `400` — 자기 자신과 채팅 불가  
- `404` — 상대 사용자 없음  

---

## 5. `POST /chat/rooms/announcement`

공고 1:1 방 **조회 또는 생성**. 해당 공고에 **지원 완료된 지원서**가 있어야 한다.

### Request body — `CreateAnnouncementChatRoomDto`

```json
{
  "postId": "uuid",
  "applicantUserId": "uuid"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `postId` | UUID | 예 | 모집공고 ID |
| `applicantUserId` | UUID | 아니오 | 지원자 사용자 ID. **생략 시** 요청자 본인이 지원자. **공고 작성자만** 다른 지원자를 지정할 수 있음 |

### 응답 200 — `ChatRoom`

이미 방이 있으면 그대로 반환. 소프트 삭제됐던 행은 서버에서 복구(`recover`) 후 반환될 수 있다.

```json
{
  "id": "uuid",
  "kind": "ANNOUNCEMENT",
  "application": {
    "id": "uuid",
    "postId": "uuid",
    "userId": "uuid"
  },
  "announcement": {
    "postId": "uuid",
    "title": "…",
    "userId": "uuid"
  },
  "members": [],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

- 실제 중첩 객체 필드는 `Application`·`Announcement` 엔티티 전체가 아닐 수 있음(직렬화 설정에 따름).

### 에러 (예시)

- `404` — 공고 없음 / 지원자 사용자 없음  
- `403` — 작성자가 아닌데 `applicantUserId` 지정  
- `400` — 작성자 본인을 지원자로 지정 / 해당 공고에 지원 이력 없음  

---

## 6. `GET /chat/rooms/:roomId/messages`

채팅방 메시지 목록 — **해당 방 멤버만**. 삭제되지 않은 메시지만.

### Path

| 파라미터 | 설명 |
|----------|------|
| `roomId` | `chat_room.id` (UUID) |

### Query — `ListMessagesQueryDto`

| 필드 | 타입 | 기본 | 설명 |
|------|------|------|------|
| `page` | number | `1` | 페이지 (1부터) |
| `limit` | number | `50` | 1~100 |

### 응답 200

```json
{
  "items": [
    {
      "id": "uuid",
      "chatRoomId": "uuid",
      "userId": "uuid",
      "content": "string | null",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

- 정렬: **최신순** (`createdAt` DESC).

### 에러

- `404` — 방 없음  
- `403` — 멤버 아님  

---

## 7. WebSocket — namespace `/chat`

Socket.IO. 연결 시 **액세스 토큰** 필요.

### 인증

다음 중 하나:

- Handshake: `auth: { token: "<access_token>" }`
- 또는 헤더: `Authorization: Bearer <access_token>`

연결 실패 시 소켓이 끊긴다.

### 클라이언트 → 서버 이벤트

#### `joinRoom`

방 입장(해당 `chatRoomId` 룸에 조인). 멤버만 가능.

**Body — `JoinRoomSocketDto`**

```json
{
  "chatRoomId": "uuid"
}
```

**응답(ack)**

```json
{
  "event": "joined",
  "data": {
    "chatRoomId": "uuid"
  }
}
```

#### `leaveRoom`

**Body**

`joinRoom` 과 동일 (`chatRoomId`).

**응답(ack)**

```json
{
  "event": "left",
  "data": {
    "chatRoomId": "uuid"
  }
}
```

#### `sendMessage`

메시지 저장 + 같은 Socket.IO 룸에 브로드캐스트.

**Body — `SendMessageSocketDto`**

```json
{
  "chatRoomId": "uuid",
  "content": "선택, 최대 255자"
}
```

- `content` 생략 가능(빈 메시지 등). 서버는 공백 트림 후 저장.

**응답(ack)**

```json
{
  "ok": true,
  "messageId": "uuid"
}
```

### 서버 → 클라이언트 이벤트

#### `message`

누군가(HTTP `createMessage` 또는 `sendMessage`로) 메시지를 보내면, 해당 `chatRoomId` 룸을 구독한 클라이언트에게 전달.

**Payload — `MessagePayload`**

```json
{
  "id": "uuid",
  "chatRoomId": "uuid",
  "userId": "uuid",
  "content": "string | null",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

---

## 타입 참고 (코드)

| 용도 | 파일 |
|------|------|
| 목록 응답 | `chat.service.ts` — `ChatRoomListResponse`, `ChatRoomListItemDto` |
| 메시지 한 건 | `MessagePayload` |
| REST DTO | `dto/*.dto.ts` |
| 소켓 DTO | `join-room-socket.dto.ts`, `send-message-socket.dto.ts` |
