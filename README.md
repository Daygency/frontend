# Review API 명세

## 테이블(`review`) 컬럼

- `rating` (`DISAPPOINTING` | `GOOD` | `IMPRESSED`)
- `disappointment_reason_codes` (`json`, nullable)
  - `rating=DISAPPOINTING`일 때만 사용
  - 값 목록:
    - `TIME_NOT_KEPT`
    - `COMMUNICATION`
    - `RESPONSE_LATE_OR_UNCLEAR`
    - `INSUFFICIENT_PREP`
    - `UNCOMFORTABLE_PROCESS`
    - `REQUESTS_NOT_REFLECTED`
    - `PROBLEM_RESPONSE_WEAK`
- `private_note_to_ops` (`text`, nullable)
  - 운영팀 개선용 메모
  - 상대방에게 전달되지 않음

## 후기 작성

- `POST /announcement/:postId/reviews`
- Body

```json
{
  "revieweeUserId": "550e8400-e29b-41d4-a716-446655440111",
  "rating": "DISAPPOINTING",
  "disappointmentReasonCodes": ["TIME_NOT_KEPT", "COMMUNICATION"],
  "privateNoteToOps": "연락이 늦어서 리허설 조율이 어려웠어요."
}
```

### nullable 사용 예시

- `disappointmentReasonCodes: null` 가능
- `privateNoteToOps: null` 가능
- 둘 다 미전송 가능

```json
{
  "revieweeUserId": "550e8400-e29b-41d4-a716-446655440111",
  "rating": "DISAPPOINTING",
  "disappointmentReasonCodes": null,
  "privateNoteToOps": null
}
```

## 후기 수정

- `PATCH /reviews/:reviewId`
- Body (수정 필드만 전송)

```json
{
  "disappointmentReasonCodes": ["REQUESTS_NOT_REFLECTED"],
  "privateNoteToOps": "요청사항 합의가 늦어 준비 시간이 부족했어요."
}
```

## 유효성 규칙

- `rating !== DISAPPOINTING`인 경우:
  - `disappointmentReasonCodes` 값 전달 불가
  - `privateNoteToOps` 값 전달 불가
- `privateNoteToOps` 최대 길이: 2000
