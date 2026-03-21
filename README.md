# Backend API 변경사항 (2026-03-21)

최근 반영된 API 수정사항 요약입니다.

## 1) 댓글(Comment) API 추가

- 엔티티: `comment`
- 댓글 대상 enum: `NEWS`, `COMMUNITY` (두 게시판만 허용)
- 대댓글 지원: `parentId`
- 삭제 방식: soft delete (`deleted_at`)

### 엔드포인트

- `POST /comment` 댓글/대댓글 작성 (인증 필요)
- `GET /comment?targetType={NEWS|COMMUNITY}&targetId={uuid}` 댓글 목록 조회
- `GET /comment/:id` 댓글 단건 조회
- `PATCH /comment/:id` 댓글 수정 (작성자만)
- `DELETE /comment/:id` 댓글 삭제 (작성자만)

문서: `docs/comment-api.md`

---

## 2) 좋아요(Like) API 추가

- 엔티티: `like`
- 좋아요 대상 enum: `NEWS`, `COMMUNITY`, `ANNOUNCEMENT`, `COMMENT`
- 중복 좋아요 방지: 같은 유저가 같은 대상에 중복 생성 시 `409 Conflict`

### 엔드포인트

- `POST /like` 좋아요 생성 (인증 필요)
- `GET /like?likeType={...}&targetId={uuid}` 좋아요 목록 조회 (`count`, `items` 반환)
- `GET /like/:id` 좋아요 단건 조회
- `DELETE /like/:id` 좋아요 ID로 삭제 (본인만)
- `DELETE /like?likeType={...}&targetId={uuid}` 대상 기준 좋아요 취소 (본인만)

문서: `docs/like-api.md`

---

## 3) 뉴스/커뮤니티 목록 응답 확장

목록 조회 시 각 항목에 아래 필드가 추가되었습니다.

- `likeCount`: 해당 게시글 좋아요 수
- `commentCount`: 해당 게시글 댓글 수

적용 API:

- `GET /news`
- `GET /community`

---

## 4) 뉴스/커뮤니티 조회수(viewCount) 추가

엔티티 컬럼 추가:

- `news.view_count` (기본값 0)
- `community.view_count` (기본값 0)

상세 조회 호출 시 동작:

- 상세 조회가 호출될 때마다 `viewCount` 1 증가

적용 API:

- `GET /news/:id`
- `GET /community/:id`

상세 응답에 포함되는 주요 카운트 필드:

- `viewCount`
- `likeCount`
- `commentCount`

---

## 참고

- 현재 설정이 `TypeORM synchronize: true`이므로 서버 재시작 시 신규 컬럼(`view_count`)이 DB에 반영됩니다.
