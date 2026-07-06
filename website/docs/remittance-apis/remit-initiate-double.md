---
sidebar_position: 1120
sidebar_label: "Remit Initiate Double"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Remit Initiate Double

`remit-initiate` is the second call in the **double API** remittance flow. After registering the remitter and beneficiary with [Register Remit](register-remit.md), this call remits the amount against the reference returned by that step.

**Applies to:** Pakistan · Bangladesh

***

## Endpoint

|             |                                           |
| ----------- | ----------------------------------------- |
| **Method**  | `POST`                                    |
| **Path**    | `/remittance/{merchantId}/remit-initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com`            |

***

## Request Parameters

| Parameter   | Required | Type   | Length | Description                                                    |
| ----------- | -------- | ------ | ------ | -------------------------------------------------------------- |
| `reference` | Yes      | String | 45     | Unique reference used to register the remitter and beneficiary |
| `amount`    | Yes      | String | 15     | The amount to be sent or remitted                              |
| `narration` | Yes      | String | 30     | Comments or a brief description of the remittance              |
| `purpose`   | Yes      | String | 4      | Reason for the remittance or funds transfer                    |

***

## Response Parameters

| Parameter        | Type   | Length | Description                                                                                      |
| ---------------- | ------ | ------ | ------------------------------------------------------------------------------------------------ |
| `status`         | String | 4      | Status of the API call                                                                           |
| `remitReference` | String | 20     | Unique reference for the remittance                                                              |
| `message`        | String | 50     | Status message of the API call                                                                   |
| `reference`      | String | 45     | The unique reference of the remittance provided for registration of the remitter and beneficiary |
| `signature`      | String | —      | The signature of the response body, sent by Simpaisa for validation                              |

:::info
The signature is generated only for the `request` and `response` sections.
:::

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "request": {
    "reference": "remette_225",
    "remitReference": "customer122_249",
    "amount": "100",
    "narration": "testing",
    "purpose": "1152"
  },
  "signature": "sq2UgUnGlyr7ah4djdtazIrBKexoiLut+Cve3AF0svyevhR8r9aOJera9ji4H6vbXFrPgZBCC9aldWP1JXV13pNFAuzxyi28q0EX8BbwogOKQjMx4aXxdiFPGTmM+I/xrtWTuV183NFrwRdwjW4xWK4wqNS7TNW2d63kzR2Fymv/0kcGY/H/qzloflSRFkmx+HbrJxRaqV6SLIkEnXJM+KFEjsIxlo4StEknbL/Kd1El2z5b5e3yDdq5Xv9kElQZOpNem9KhoptXyXeH84xfzMZovK3EiHjOBOHjjKAnk63TBo20kGttUE+fpWVUQ3iOgMquWAJRygHVBvGuU34wYQ=="
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "test-11652124231266"
  },
  "signature": "0x650c9f2e6701e3fe73d3054904a9a4bbdb96733f1c4c743ef573ad6ac14c5a3bf8a4731f617c"
}
```

</TabItem>
</Tabs>
