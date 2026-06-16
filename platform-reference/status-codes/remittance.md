# Remittance Status Codes

Response codes for remittance APIs. The same codes apply to **Pakistan** and **Bangladesh**.

| Code | Message |
| ---- | ------- |
| 0000 | Success |
| 0005 | Pending |
| 0009 | Not-Enough-Balance |
| 0010 | Account-Not-Found |
| 0011 | Transaction-Not-Allowed |
| 0050 | Invalid-Account |
| 0051 | Account-Blocked |
| 0081 | Account-Limit-Exhaused |
| 0082 | Simpaisa-NEF |
| 0083 | Simpaisa-MAL |
| 0084 | Simpaisa-IRNA |
| 0086 | Simpaisa-MTAFR |
| 0087 | Simpaisa-MTAR |
| 0088 | Simpaisa-C |
| 0089 | Simpaisa-CDNE |
| 0090 | Account-Inactive |
| 0091 | Simpaisa-ICR |
| 0092 | Simpaisa-FD |
| 0093 | Simpaisa-ITD |
| 0094 | Simpaisa-IE |
| 0099 | Simpaisa-RTI |
| 0100 | Simpaisa-MEF |
| 0101 | Simpaisa-NCK |
| 0102 | Simpaisa-PD |
| 0103 | Invalid-Bank-Indentification |
| 0104 | Simpasia-EO |
| 0105 | Simpaisa-DNF |
| 0106 | Simpaisa-GAHRD |
| 0107 | Simpaisa-TUA |
| 0108 | Simapisa-TQUA |
| 0109 | Simpaisa-GE |
| 0110 | Simpaisa-ISE |
| 0111 | Simpaisa-AIRL6 |
| 0112 | Simpaisa-BNE25 |
| 0113 | Simpaisa-CPAIR |
| 0114 | Simpaisa-POSEMLSBE3 |
| 0116 | Simpaisa-DT |
| 0117 | Simpaisa-STH |
| 0118 | Simpaisa-D |
| 0120 | Simpaisa-EWSDIDB |
| 0121 | Simpaisa-ANTLSBG0LTE28 |
| 0123 | Simpaisa-ICS |
| 0125 | Simpaisa-LB |
| 0127 | Simpaisa-TR |
| 0128 | Simpaisa-SVF |
| 0160 | Invalid-Amount |
| 0161 | Simpaisa-THDTD |
| 0162 | Simpaisa-CBS |
| 0163 | Simpaisa-BNR |
| 0164 | Simpaisa-BKYCF |
| 0208 | Simpaisa-SYTCNBCPTAL |
| 0209 | Simpaisa-GFRI |
| 0211 | Simpaisa-RM |
| 0212 | Invalid-IBAN-Length |
| 0213 | Simpaisa-IC |
| 0301 | Transection-Not-Allowed |
| 0303 | Simpaisa-CLE |
| 0304 | Simpaisa-IC |
| 0305 | Customer-Bank-Unreachable |
| 0306 | Simpaisa-ODA |

{% hint style="warning" %}
Make final decisions using **transaction state** (`remitted` = success, `rejected` = failure) from postbacks or [Transaction Inquiry](../../remittance-apis/transaction-inquiry.md).
{% endhint %}
