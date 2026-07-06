---
sidebar_position: 1060
sidebar_label: "Remittance States"
---

# Remittance States

Once you initiate a remittance, it moves through the following states depending on the scenario before it is either rejected or disbursed.

> **Applies to:** Both

| State | Enum | Postback | Description |
|-------|------|----------|-------------|
| In Process | `in_process` | No | The remittance request has been successfully received |
| Published | `published` | No | The remittance request has been successfully sent to the payment channel |
| In Review | `in_review` | No | The remittance request is under review |
| On Hold | `on_hold` | Yes | The remittance request is on hold — usually due to low balance |
| Stuck | `stuck` | No | The remittance couldn't be processed by the payment switch, or needs human validation |
| Remitted | `remitted` | Yes | The remittance has been successfully executed |
| Rejected | `rejected` | Yes | The remittance failed for any given reason |
| Reversed | `reversed` | Yes | A previously remitted transaction has changed to rejected |
| AML Review | `aml_review` | No | The transaction is in review for compliance |

:::info
Decision-making should be based on the transaction state: `rejected` is a failure, `remitted` is a success.
:::
