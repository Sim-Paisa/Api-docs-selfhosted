# List Disbursements

Fetch disbursement transactions within a chosen date range.

<figure><img src="/files/dqX8B1NaDQYnjaFW4idm" alt=""><figcaption></figcaption></figure>

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/merchants/{merchantId}/disbursements` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `merchantId` | Yes | String | Simpaisa-assigned merchant ID |
| `fromDate` | Yes | String | Start of the date range (ISO 8601) |
| `toDate` | Yes | String | End of the date range (ISO 8601) |
| `state` | No | String | Filter by disbursement state (e.g. `rejected`, `disbursed`) |
| `offset` | No | String | Pagination offset |
| `limit` | No | String | Number of records to return |

---

## Response parameters

| Parameter | Description |
|-----------|-------------|
| `customerName` | The customer's name as provided by the merchant |
| `customerAccount` | The customer's account number (IBAN) shared for disbursement |
| `issueDate` | The date the disbursement was requested |
| `disbDate` | The date the disbursement was completed |
| `currency` | The currency used by all requests in the disbursement |
| `reason` | Purpose or reason for the funds transfer |
| `reference` | Unique identifier defined by the merchant for the disbursement |
| `path` | The path part of the URL to fetch the disbursement details |
| `disbursedAmount` | The total amount transferred after fees, taxes, and retentions |
| `adjustmentsWithTax` | Manual adjustments, if present; already included in the total disbursement amount |
| `state` | State of the disbursement |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "merchantId": "2000027",
    "fromDate": "2017-12-01",
    "toDate": "2017-12-31",
    "state": "rejected",
    "offset": "0",
    "limit": "25"
  }'
```

{% endtab %}
{% tab title="Response" %}

```json
[
  {
    "disbursement": {
      "customerName": "John Doe",
      "customerAccount": "BBBBAAAAAAAAAAAAAA",
      "issueDate": "2017-12-02",
      "disbDate": "2017-12-06",
      "currency": "PKR",
      "disbursedAmount": 34234,
      "adjustmentsWithTax": 0,
      "reason": "0100",
      "reference": "0000008mlHWOC",
      "path": "/merchants/yourMerchantId/disbursements/c6105f92-5718-4355-9f5b-56b24fe19baa",
      "state": "rejected"
    }
  },
  {
    "disbursement": {
      "customerName": "John Doe",
      "customerAccount": "BBBBAAAAAAAAAAAAAA",
      "issueDate": "2017-11-05",
      "disbDate": "2017-11-09",
      "currency": "PKR",
      "disbursedAmount": 54212,
      "adjustmentsWithTax": 1210,
      "reason": "0100",
      "reference": "0000008mkTH4s",
      "path": "/merchants/yourMerchantId/disbursements/1e8c4c63-3b24-40f5-bbbb-b264835ff40c",
      "state": "rejected"
    }
  }
]
```

{% endtab %}
{% endtabs %}
