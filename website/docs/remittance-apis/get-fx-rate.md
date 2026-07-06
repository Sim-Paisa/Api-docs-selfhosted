---
sidebar_position: 1080
sidebar_label: "Get FX Rate"
unlisted: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Get FX Rate

The FX Rate API allows merchants to retrieve the foreign exchange (FX) rate between two currencies for remittance purposes. The rate is used to convert the remittance amount from one currency to another, ensuring the correct value is transferred.

> **Applies to:** Both

***

## Endpoint

|             |                                      |
| ----------- | ------------------------------------ |
| **Method**  | `POST`                               |
| **Path**    | `/remittance/{merchantId}/getFxRate` |
| **Sandbox** | `https://sandbox.simpaisa.com`       |

***

## Request Parameters

| Parameter      | Required | Type   | Length | Description                                  |
| -------------- | -------- | ------ | ------ | -------------------------------------------- |
| `fromCurrency` | Yes      | String | 3      | ISO code of the currency being converted     |
| `toCurrency`   | Yes      | String | 3      | ISO code of the target currency              |
| `quantity`     | Yes      | String | 15     | Amount or quantity of currency to convert    |
| `signature`    | Yes      | String | —      | RSA signature to ensure secure communication |

***

## Response Parameters

| Parameter               | Type   | Length | Description                                                                            |
| ----------------------- | ------ | ------ | -------------------------------------------------------------------------------------- |
| `status`                | String | 4      | Status code of the API response. `0000` indicates success.                             |
| `message`               | String | 50     | Message accompanying the status, e.g. "Success".                                       |
| `fxID`                  | String | —      | Generated when the FX rate changes                                                     |
| `fromCurrencyCode`      | String | 3      | ISO code of the currency being converted                                               |
| `toCurrencyCode`        | String | 3      | ISO code of the target currency                                                        |
| `rate`                  | Float  | —      | The exchange rate between the two currencies                                           |
| `convertedAmount`       | Float  | —      | The amount obtained after applying the FX rate to the quantity                         |
| `dateTime`              | String | 25     | Timestamp of when the rate was generated                                               |
| `qDetails.currency`     | String | 3      | ISO code of the target currency                                                        |
| `qDetails.iD`           | String | 20     | Used to process the transaction — passed as the `qID` parameter of Remittance Initiate |
| `qDetails.totalFees`    | Float  | 20     | Fees deducted in the specified currency for transaction processing                     |
| `qDetails.finalAmount`  | Float  | 20     | Amount remaining after fees deduction                                                  |
| `qDetails.dateTime`     | String | 25     | Timestamp of when fees were calculated                                                 |
| `qDetails.deductedFees` | Object | —      | Breakdown of fees                                                                      |

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/remittance/{merchantId}/getFxRate' \
  --header 'Content-Type: application/json' \
  --data '{
    "request": {
      "fromCurrency": "USD",
      "toCurrency": "PKR",
      "quantity": "100.0"
    },
    "signature": "signature_string"
  }'
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "data": {
    "fxId": 53,
    "fromCurrency": "USD",
    "toCurrency": "PKR",
    "rate": 278.0,
    "convertedAmount": 27800.00,
    "dateTime": "2024-11-11 08:17:50.0",
    "qDetails": {
      "currency": "PKR",
      "deductedFees": {
        "platformFees": "556",
        "paymentChannelFees": "139"
      },
      "totalFees": 695.00,
      "finalAmount": 27105.00,
      "dateTime": "2024-10-14 20:17:50.0",
      "qID": "153"
    }
  },
  "message": "Success",
  "status": "0000"
}
```

</TabItem>
</Tabs>
