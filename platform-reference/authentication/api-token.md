# API Token Authentication

Used for unified pay-in regions: **Bangladesh**, **Nepal**, **Egypt**, and **Iraq**.

| Header | Value |
|--------|-------|
| `api-token` | Token issued by Simpaisa during onboarding |
| `mode` | `payin` |
| `region` | `BD` · `NP` · `EG` · `IQ` |
| `version` | `3.0` |

Required on every `POST /payins/payments/initiate` and `POST /payins/payments/inquire` request.

See [Unified Pay-In overview](../../pay-in-apis/unified-pay-in/overview.md) for full endpoint documentation.
