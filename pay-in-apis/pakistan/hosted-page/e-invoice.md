# E-Invoice

The e-invoice (link to pay) solution is designed for merchants with minimal technical requirements, or to go live **without API integration**. It covers all payment channels accessible via link; payment status is monitored on the Simpaisa dashboard in real time.

***

## How It Works

1. **Register** and request the e-invoice feature from Simpaisa.
2. Once enabled, generate payment links from the **Simpaisa Portal** with amount, order ID, payment channel, expiry date, and optional customer data fields.
3. Share the link with customers via email or any channel.
4. Customer opens the link, enters required details, selects a payment method, and completes payment.
5. Track status on the dashboard; transaction data can be downloaded from the portal.

***

## Steps In The Portal

### Select E-Invoice

Select the **E-invoice** feature from the dashboard.

### Configure Payment Details

Add amount, order ID, payment channel, expiry (or lifetime link), and any custom customer fields. Review details and choose the payment page color theme.

Click **Generate Link** to create the payment URL. **One-time links** can only be opened once — reopening shows an error.

### Share The Link

Share the generated link with customers via email or your preferred channel.

### Customer Payment Page

When a customer opens the link, they see a payment page with mandatory fields before paying.

After entering personal details, the customer sees available payment options. The email address they provide also receives payment status.

The customer selects a payment channel and completes payment.

### Dashboard Status

After payment, view status on the Simpaisa dashboard. All transaction data is available and can be downloaded.

***

## When To Use E-invoice Vs Hosted Page API

|                 | E-Invoice (portal)                    | [Hosted Page API](overview.md)           |
| --------------- | ------------------------------------- | ---------------------------------------- |
| Integration     | No code — portal only                 | GET checkout URL from your backend       |
| Link generation | Simpaisa dashboard                    | Your application                         |
| Status tracking | Dashboard                             | [Inquire API](inquire.md)                |
| Best for        | Low-volume, manual, or pilot launches | Production checkout embedded in your app |
