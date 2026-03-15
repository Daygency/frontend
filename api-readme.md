# 5. 공고 수정

공고 정보를 수정합니다. **작성자만** 수정 가능합니다.

### Endpoint

```
PATCH /announcement/:id
```

### Headers

| 헤더          | 설명           |
|--------------|----------------|
| Authorization| Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명    |
|---------|--------|------|---------|
| id      | string | O    | 공고 ID |

### Request Body

CreateAnnouncementDto의 모든 필드 **선택(partial)**. 수정할 필드만 보내면 됩니다.

| 필드             | 타입    | 필수 | 설명                        |
|-----------------|---------|------|-----------------------------|
| title           | string  | X    | 제목                        |
| content         | string  | X    | 내용                        |
| deadlineAt      | string  | X    | 마감일 (ISO 8601)           |
| scheduledAt     | string  | X    | 예정일 (ISO 8601)           |
| status          | enum    | X    | 모집상태 (OPEN, CLOSED)     |
| address         | string  | X    | 공연위치                    |
| fileId          | string  | X    | 대표 파일 ID (null 가능)    |
| categoryId      | string  | X    | 공고 유형 ID                |
| majorIds        | array   | X    | 모집 전공 ID 배열           |
| applicationConfig | object | X | 지원서 양식 설정 (일부만 보내도 됨) |

### Response (200)

목록 아이템 형태 (create와 동일)

```json
{
  "postId": "d45ba94f-3e2a-4e2d-a25b-7b39b0c27a5c",
  "title": "2025 오케스트라 연주자 모집 (수정)",
  "type": "오디션(연주자모집)",
  "isRecruiting": true,
  "dDay": "D-7"
}
```

### 에러

| 상태 | 설명                |
|-----|---------------------|
| 401 | 인증 필요           |
| 403 | 수정 권한 없음 (작성자 아님) |
| 404 | 공고를 찾을 수 없음  |

### 참고

- 인증 필요 (access token)
- 작성자 본인만 수정 가능
- 전송한 필드만 업데이트 (partial update)

---