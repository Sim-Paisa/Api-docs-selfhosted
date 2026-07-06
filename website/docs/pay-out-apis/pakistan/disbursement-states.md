---
sidebar_position: 800
sidebar_label: "Disbursement States"
---

# Disbursement States

Once you initiate a disbursement request, it moves through the following states depending on the scenario before it is either rejected or disbursed.

> **Applies to:** Pakistan

| State | Description |
|-------|-------------|
| Published | The payout request has been successfully received by Simpaisa |
| In-Review | The payout request is under review — happens if instant payout isn't enabled |
| On-Hold | The payout request is on hold — usually due to low or no balance |
| Stuck | The payout couldn't be processed by the payment switch and is parked under the stuck state, then processed at T+1 |
| Disbursed | The payout has been successfully executed and received by the beneficiary |
| Rejected | The payout failed for any given reason |

:::info
Base your decision on the state: `rejected` is a failure, `disbursed` is a success.
:::
