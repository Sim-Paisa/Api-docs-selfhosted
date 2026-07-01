# Errors

Errors from the Cards API appear in **two distinct shapes**. Which shape you get depends on whether the request was rejected before processing (validation) or was processed but declined by business rules.

---

## Shape 1 — Request Validation Errors

Returned when the request itself is malformed, references something invalid, or fails a business precondition before any transaction is created. No `id`, `status`, or `transaction_id` is present.

```json
{
  "response": {
    "request_id": "<uuid>",
    "error_type": "request_invalid" | "processing_error",
    "error_codes": ["<code>"]
  },
  "signature": "..."
}
```

| `error_codes` value | `error_type` | Trigger |
|----------------------|---------------|---------------------|
| `invalid_signature` | `request_invalid` | The request signature does not verify against the merchant's registered public key. |
| `data_encryption_invalid` | `processing_error` | The `source.card` value is not valid encrypted card data for this merchant's encryption key. |
| `reference_already_exists` | — | `request.reference` was already used in a prior request. References must be unique per attempt. |
| `success_url_required` / `failure_url_required` | `request_invalid` | `success_url`/`failure_url` omitted — required on every flow, including non-3DS `directcharge`. |
| `customer_required` | `processing_error` | `directcharge` sent without `request.customer.id` set to a `cref_`. Also returned if `customer_id` is sent top-level or nested directly under `request` instead of inside `customer`. |
| `token_does_not_exist` | `processing_error` | `source.card` (the `c_token`) does not exist for this merchant. Simpaisa does not distinguish "never existed" from "deleted" in this error. |
| `invalid_customer_for_token` | `processing_error` | The `c_token` exists, but the `cref_` in `request.customer.id` does not own it. |
| `3ds_required_for_tokenization` | `request_invalid` | `payment_type: "tokenization"` sent with `3ds.enabled: "false"`. |
| `payment_type_must_be_tokenization_for_zero_amount` | `request_invalid` | `amount: "0.00"` sent with a `payment_type` other than `tokenization`. |
| `forbidden` | `request_invalid` | The request is blocked at the account or network level. Verify your IP/network is allowlisted for your merchant account. |

---

## Shape 2 — Business Decline On An Otherwise-Valid Transaction

Returned when the request was well-formed and a transaction record exists, but a specific action against it is disallowed by business rules. Looks like a normal transaction response, but `approved: "false"`, `status: "Declined"`, and `response_code` carries a specific numeric code.

```json
{
  "response": {
    "id": "...",
    "action_id": "...",
    "approved": "false",
    "status": "Declined",
    "response_code": "<code>",
    "response_summary": "<message>",
    "processed_on": "...",
    "reference": "...",
    "transaction_id": "..."
  },
  "signature": "..."
}
```

All numeric `response_code` values for this API are documented in [Cards Status Codes](../../../platform-reference/status-codes/cards.md).
