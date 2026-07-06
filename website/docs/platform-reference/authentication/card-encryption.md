---
sidebar_position: 150
sidebar_label: "Card Encryption"
---

# Card-encryption

### Encryption And Authentication

#### AES Card Encryption (what To Encrypt And How)

The `card` field in the Payments API is **not plain card data**.

It must be an **AES-encrypted** value of the string below:

`<CardNumber>.<Month>.<Year>.<CVV>`

Then Base64-encode the encrypted bytes.

Simpaisa decrypts the value using the same `secretKey` configured for your merchant.

:::info
AES keys must be **16 / 24 / 32 bytes** long (AES-128 / AES-192 / AES-256).

In Java, `Cipher.getInstance("AES")` usually resolves to `AES/ECB/PKCS5Padding`.
:::

#### Sample AES Encryption Code (Java)

```java title="AES encryption helper (Java)"
public static String encrypt(final String secret, final String data) {
    // byte[] decodedKey = Base64.getDecoder().decode(secret);

    try {
        setKey(secret);
        Cipher cipher = Cipher.getInstance("AES");
        // rebuild key using SecretKeySpec

        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] cipherText = cipher.doFinal(data.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(cipherText);
    } catch (Exception e) {
        throw new RuntimeException("Error occured while encrypting data", e);
    }
}
```
