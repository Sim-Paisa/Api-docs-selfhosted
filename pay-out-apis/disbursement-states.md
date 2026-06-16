# Disbursement States

Once you initiate a disbursement request, it moves through the following states depending on the scenario before it is either rejected or disbursed.

> **Applies to:** Both

---

## Pakistan

| State | Description |
|-------|-------------|
| Published | The payout request has been successfully received by Simpaisa |
| In-Review | The payout request is under review — happens if instant payout isn't enabled |
| On-Hold | The payout request is on hold — usually due to low or no balance |
| Stuck | The payout couldn't be processed by the payment switch and is parked under the stuck state, then processed at T+1 |
| Disbursed | The payout has been successfully executed and received by the beneficiary |
| Rejected | The payout failed for any given reason |

{% hint style="info" %}
Base your decision on the state: `rejected` is a failure, `disbursed` is a success.
{% endhint %}

---

## Bangladesh

| State | Enum | Description |
|-------|------|-------------|
| In Process | `in_process` | The disbursement request has been successfully received |
| Published | `published` | The disbursement request has been successfully sent to the payment channel |
| In Review | `in_review` | The disbursement request is under review |
| On Hold | `on_hold` | The disbursement request is on hold — usually due to low balance |
| Stuck | `stuck` | The disbursement couldn't be processed by the payment switch, or needs human validation |
| Remitted | `remitted` | The disbursement has been successfully executed |
| Rejected | `rejected` | The disbursement failed for any given reason |
| Reversed | `reversed` | A previously remitted transaction has changed to rejected |

{% hint style="info" %}
Base your decision on the transaction state: `rejected` is a failure, `remitted` is a success.
{% endhint %}
