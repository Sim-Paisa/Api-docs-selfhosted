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

{% tabs %}
{% tab title="Pakistan (PK)" %}
| Environment       | Base URL                       |
| ----------------- | ------------------------------ |
| Sandbox / Staging | `https://sandbox.simpaisa.com` |
| Production / Live | `https://disb.simpaisa.com`    |

Headers: `mode: payout`, `region: PK`, `version: 3.0`
{% endtab %}

{% tab title="Bangladesh (BD)" %}
| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | `https://payout.simpaisa.com`  |

Headers: `mode: payout`, `region: BD`, `version: 3.0`
{% endtab %}
{% endtabs %}

See [Pay-Out overview](/broken/pages/scSBYWV61JpwedoHoPbY).

***

## Remittance

{% tabs %}
{% tab title="Pakistan (PK)" %}
| Environment | Base URL                         |
| ----------- | -------------------------------- |
| Sandbox     | `https://sandbox.simpaisa.com`   |
| Production  | `https://remit.commerceplex.com` |

Headers: `mode: remittance`, `region: PK`, `version: 3.0`
{% endtab %}

{% tab title="Bangladesh (BD)" %}
| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | `https://bd.commerceplex.com`  |

Headers: `mode: remittance`, `region: BD`, `version: 3.0`
{% endtab %}
{% endtabs %}

See [Remittance overview](/broken/pages/7JFvdPcWoSuojK2bLq3f).
