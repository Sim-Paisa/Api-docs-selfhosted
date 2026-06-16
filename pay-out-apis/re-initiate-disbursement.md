# Re-initiate Disbursement

Re-initiate a disbursement request against an individual through the Simpaisa platform. A disbursement can only be re-initiated when its state is `on_hold`. The fund transfer is executed with the appropriate authorization and authentication.

<figure><img src="/files/0DtalhnURvSaU9B4WbnW" alt=""><figcaption></figcaption></figure>

---

## Endpoint

| | |
|---|---|
| **Method** | `PUT` |
| **Path** | `/merchants/{merchantId}/disbursements/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Request parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `reference` | Yes | String | 255 | A unique reference number provided by the merchant, identifying the transaction. Preserved on the Simpaisa platform for reconciliation and returned in the response. |
| `re-initiate` | Yes | String | 3 | Pass `yes` to re-initiate the disbursement |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request PUT 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/initiate' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "request": {
      "reference": "db-55-92",
      "re-initiate": "yes"
    },
    "signature": "eWoxVHDDrhcJ4VTfpD3/t+nr/vz5lwFt/ChGcw9+jw95Z0uEig3rgCIez0EKmayFVtLpuwmUMVhplO7AeUyrgztZ3p2TPkEUsM3DjsXCaNyqa2w4hg90y3bfCa58ou65yMchO/ZKJBrG9CvimGnDBabbxrstLqZFprOLfUNhL+bnL7AxIfQ97lEA43W+QpArWMHlEpZaaYfh12s7ZcslvIGB1bxdgTODRne5PkHecISXNk7xhQkyA+F9RGdHSURCK2YwwcXi1nNrbxu+/r1QXZHQ3JIq4OihX65zZRwQ1tYlZ4M2pw8Ao7tkwjE20cm3NdE6rs8j+F5OXTpDnru5sg=="
  }'
```

{% endtab %}
{% tab title="Response" %}

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "db-55-92",
    "state": "in_review"
  },
  "signature": "0x650c9f2e6701e3fe73d3054904a9a4bbdb96733f1c4c743ef573ad6ac14c5a3bf8a4731f6e6276faea5247303677fb8dbdf24ff78e53c25052cdca87eecfee85476bcb8a05cb9a1efef7cb87dd68223e117c"
}
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
The signature is generated only for the `request` and `response` sections.
{% endhint %}
