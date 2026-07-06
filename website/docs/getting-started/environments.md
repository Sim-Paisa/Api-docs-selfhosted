---
sidebar_position: 90
sidebar_label: "Environments"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Environments

Sandbox and production base URLs by product and region.

***

## Unified Pay-In (BD · NP · EG · IQ)

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | `https://payin.simpaisa.com`   |

See [Unified Pay-In overview](../pay-in-apis/unified-pay-in/overview.md).

***

## Pakistan Pay-In

| Product                    | Sandbox                              | Production                       |
| -------------------------- | ------------------------------------ | -------------------------------- |
| Wallets / IBFT / E-Billing | `https://sandbox.simpaisa.com`       | `https://wallets.simpaisa.com`   |
| IBFT (1-Bill)              | `https://sandbox.simpaisa.com`       | `https://ibft.simpaisa.com`      |
| Hosted Page Inquire        | `https://stg-widgetapi.simpaisa.com` | `https://widgetapi.simpaisa.com` |
| Cards                      | `https://sandbox.simpaisa.com`       | Per merchant onboarding          |

***

## Pay-Out (Disbursement)

<Tabs>
<TabItem value="pakistan-pk" label="Pakistan (PK)">

| Environment       | Base URL                       |
| ----------------- | ------------------------------ |
| Sandbox / Staging | `https://sandbox.simpaisa.com` |
| Production / Live | `https://disb.simpaisa.com`    |

Headers: `mode: payout`, `region: PK`, `version: 3.0`

</TabItem>
<TabItem value="bangladesh-bd" label="Bangladesh (BD)">

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | `https://payout.simpaisa.com`  |

Headers: `mode: payout`, `region: BD`, `version: 3.0`

</TabItem>
<TabItem value="egypt-eg" label="Egypt(EG)">

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | NA                             |

Headers: Headers: `mode: payout`, `region: EG`, `version: 3.0`

</TabItem>
</Tabs>

***

## Remittance

<Tabs>
<TabItem value="pakistan-pk" label="Pakistan (PK)">

| Environment | Base URL                         |
| ----------- | -------------------------------- |
| Sandbox     | `https://sandbox.simpaisa.com`   |
| Production  | `https://remit.commerceplex.com` |

Headers: `mode: remittance`, `region: PK`, `version: 3.0`

</TabItem>
<TabItem value="bangladesh-bd" label="Bangladesh (BD)">

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | `https://bd.commerceplex.com`  |

Headers: `mode: remittance`, `region: BD`, `version: 3.0`

</TabItem>
<TabItem value="egypt-eg" label="Egypt(EG)">

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | NA                             |

Headers: Headers: `mode: payout`, `region: EG`, `version: 3.0`

</TabItem>
</Tabs>

See [Remittance overview](../remittance-apis/overview.md).
