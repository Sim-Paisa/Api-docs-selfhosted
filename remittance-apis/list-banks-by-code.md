# List Banks by Code

The bank code (and optionally a routing number) serves as an identifier to retrieve a specific `bankId`. If a routing number is provided, the API returns the corresponding `bankId` directly, which can then be used to process the remittance. If the routing number is omitted, the API returns all routing numbers associated with the bank — letting merchants either retrieve the full list or directly access a specific one.

<figure><img src="/files/3HFfOLbOh6AZuPRHB52E" alt=""><figcaption></figcaption></figure>

> **Applies to:** Bangladesh

---

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/banks/list/{bankCode}?routingNo={routingNumber}` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Request parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | Int | 10 | The unique ID of a merchant provided by Simpaisa |
| `bankCode` | Yes | Int | 4 | Bank code against which the branches are to be fetched |
| `routingNum` | No | Int | 9 | If provided, the BankID is returned directly. If left blank, all routing numbers associated with the bank are returned. |

---

## Response parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | Int | 4 | Status of the API call |
| `message` | String | 50 | Status message of the API call |
| `bankList` | Array | — | The list of available banks on which remittance can be initiated |
| `bankId` | Int | 5 | The ID of the bank on which the remittance is initiated, or the beneficiary is registered |
| `bankName` | String | 30 | Name of the available bank |
| `distName` | String | 10 | Name of the district where the branch is located |
| `distCode` | Int | 3 | Code of the district |
| `branchCode` | Int | 3 | Code of the bank branch |
| `branchName` | String | 20 | Name of the branch where the beneficiary's account is registered |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request GET \
  'https://sandbox.simpaisa.com/remittance/{merchantId}/banks/list/{bankCode}' \
  --header 'Content-Type: application/json'
```

{% endtab %}
{% tab title="Response" %}

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "bankList": [
      {
        "bankId": 12481,
        "bankName": "HBL",
        "bankType": "BA",
        "distName": "Karachi",
        "distCode": "111",
        "branchCode": "001",
        "branchName": "Karachi DHA"
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}
