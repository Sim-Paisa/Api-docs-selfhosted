---
sidebar_position: 1020
sidebar_label: "Disbursement States"
---

# Disbursement States

State transitions used by Bangladesh and Egypt disbursement flows.

> **Applies to:** Bangladesh, Egypt&#x20;

| State      | Enum         | Description                                 |
| ---------- | ------------ | ------------------------------------------- |
| In Process | `in_process` | Request accepted and queued                 |
| Published  | `published`  | Request pushed to payment channel           |
| In Review  | `in_review`  | Request under operational review            |
| On Hold    | `on_hold`    | Request paused, commonly due to low balance |
| Stuck      | `stuck`      | Request needs retry or manual validation    |
| Remitted   | `remitted`   | Request completed successfully              |
| Rejected   | `rejected`   | Request failed                              |
| Reversed   | `reversed`   | Previously remitted request reversed        |

:::info
For business decisions, treat `remitted` as success and `rejected` as failure.
:::
