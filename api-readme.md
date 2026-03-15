# Daygency API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 활동 아이디(activityName) 중복 여부 확인

회원가입 시 활동 아이디 입력 시 실시간으로 사용 가능 여부를 확인하는 API입니다.

### Endpoint

```
GET /users/check-activity-name
```

### Query Parameters

| 파라미터      | 타입   | 필수 | 설명                 |
|--------------|--------|------|----------------------|
| activityName | string | O    | 확인할 활동 아이디 값 |

### Response

| 필드      | 타입    | 설명                                         |
|----------|---------|----------------------------------------------|
| available | boolean | `true`: 사용 가능, `false`: 이미 사용 중      |

### Example

**Request**

```
GET /users/check-activity-name?activityName=my_activity_id
```

**Response (사용 가능)**

```json
{
  "available": true
}
```

**Response (이미 사용 중)**

```json
{
  "available": false
}
```

**Response (빈 값/공백 입력 시)**

```json
{
  "available": false
}
```

### 사용 시나리오

- 회원가입 폼에서 activityName 입력 필드에 `onBlur` 또는 `onChange` (debounce) 시 호출
- `available: true` → "사용 가능합니다" 안내
- `available: false` → "이미 사용 중인 활동 아이디입니다" 안내

### 참고

- 인증 불필요 (public API)
- activityName 길이 제한: 20자
- 대소문자 구분

---

## 공고 유형(announcement_category) 목록 조회

공고 작성/필터 시 사용하는 공고 유형 카테고리 목록을 반환하는 API입니다.

### Endpoint

```
GET /announcement/categories
```

### Query Parameters

없음

### Response

| 필드       | 타입   | 설명                    |
|-----------|--------|-------------------------|
| categoryId | string | 공고 유형 ID (UUID)     |
| name      | string | 공고 유형명             |

배열 형태로 반환됩니다.

### Example

**Request**

```
GET /announcement/categories
```

**Response**

```json
[
  {
    "categoryId": "uuid-1",
    "name": "오디션(연주자모집)"
  },
  {
    "categoryId": "uuid-2",
    "name": "콩쿨(경연)"
  },
  {
    "categoryId": "uuid-3",
    "name": "입시평가회"
  },
  {
    "categoryId": "uuid-4",
    "name": "마스터클래스"
  },
  {
    "categoryId": "uuid-5",
    "name": "행사"
  },
  {
    "categoryId": "uuid-6",
    "name": "스탭구인"
  },
  {
    "categoryId": "uuid-7",
    "name": "기타"
  }
]
```

### 사용 시나리오

- 공고 작성 폼: 카테고리 선택 드롭다운/셀렉트 옵션 로드
- 공고 목록 필터: 카테고리별 필터 옵션 로드

### 참고

- 인증 불필요 (public API)
- name 오름차순 정렬로 반환
