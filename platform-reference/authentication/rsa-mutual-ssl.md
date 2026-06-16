# RSA Signatures & Mutual SSL

Simpaisa allows pay-out calls from external systems only when authentication is performed via mutual SSL with RSA encryption.

## RSA (digital signature) and SHA-256

RSA and SHA-256 are two widely used cryptographic algorithms that work together to secure data.

- **RSA (Rivest-Shamir-Adleman)** uses asymmetric encryption — two different keys secure the data. The private key is known only to the sender; the public key is shared with outside entities.
- **SHA-256** is a cryptographic hash function that produces a 256-bit message digest from input of any size. A minuscule change in the input results in an entirely different hash.

RSA encryption protects the data, and the SHA-256 hash protects its integrity — ensuring data is secure both at rest and in transit.

---

## Encryption for Simpaisa APIs

The merchant must send a digital signature with each API request. Simpaisa uses this signature to authenticate the client before processing the request.

- Merchant and Simpaisa must exchange RSA keys before making API calls. The RSA key length must be 2048-bit with PKCS8 padding.
- When making an API call, the merchant signs the request with their RSA private key. Simpaisa verifies the signature against the merchant's RSA public key.
- When the merchant receives an API response, it is highly recommended to verify the signature using Simpaisa's RSA public key.

---

## Generating an RSA key pair

Generate a 2048-bit RSA private key with OpenSSL:

```bash
openssl genpkey -algorithm RSA -out PRIVATE_KEY.pem -pkeyopt rsa_keygen_bits:2048
```

Generate the public key from the private key:

```bash
openssl rsa -in PRIVATE_KEY.pem -pubout -out PUBLIC_KEY.pem
```

{% hint style="info" %}
The commands above are examples to assist with the process. You may use your own technology or tooling to generate the key pair.
{% endhint %}

---

## Signing the API request

To sign an API request using your RSA private key with SHA-256:

1. **Prepare the data** — the entire API request or specific parts of it, depending on your requirements.
2. **Hash the data** — use SHA-256 to produce a fixed-length hash.
3. **Sign the hash** — encrypt the hash with your RSA private key to create a digital signature unique to your key and the data.
4. **Attach the signature** — include the signature with the API request (typically as a field in the request body).
5. **Verify the signature** — on the server side, Simpaisa uses the corresponding public key to verify the signature. If the hashes match, the request's authenticity and integrity are confirmed.

See [Sample code — signature generation](../signature-samples.md) for implementations in Java, PHP, Node.js, C#, and Python.

---

## SSL handshake

All API connections between Simpaisa and partner systems must be secured using 2-way (mutual) SSL. Unlike 1-way SSL — where the client only verifies the server — in a 2-way setup the server also verifies the client.

- **Outbound (Simpaisa → Partner):** the partner acts as the server and presents its SSL server certificate for Simpaisa to verify. If successful, Simpaisa presents its client certificate for the partner to verify.
- **Inbound (Partner → Simpaisa):** Simpaisa acts as the server and presents its SSL server certificate for the partner to verify. If successful, the partner presents its client certificate for Simpaisa to verify.

A partner may act as both a server (for one set of services) and a client (for others).

---

## Minimum SSL requirements

Any third-party endpoint connected to Simpaisa must meet the following minimum standards:

- The primary certificate's Common Name must match the resolved domain name (to avoid common-name mismatch errors).
- Wildcard and self-signed certificates are acceptable.
- The server must not be vulnerable to Heartbleed ([CVE-2014-0160](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0160)).
- The server must not be exploitable via the OpenSSL CCS Injection vulnerability ([CVE-2014-0224](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0224)).
- X.509 certificates must use an RSA key no smaller than 2048-bit.
- X.509 certificates must be signed using an SHA-2 hash.
- The server certificate must not have been revoked by a certificate authority.
- SSL 2.0 and SSL 3.0 must not be supported.
- TLS 1.2 or greater must be supported.
- Cipher suites for symmetric encryption must have a minimum key length of 112 bits.

---

## Generating a certificate & keystore

Generate a self-signed certificate:

```bash
openssl req -x509 -newkey rsa:2048 -keyout PUBLIC_KEY.pem -out CERTIFICATE.pem -sha256 -days 365
```

Generate a keystore from the self-signed certificate:

```bash
openssl pkcs12 -export -in CERTIFICATE.pem -inkey PUBLIC_KEY.pem -out CRT_BUNDLE.p12
keytool -importkeystore -deststorepass PASSWORD -destkeystore KEYSTORE.jks -srckeystore CRT_BUNDLE.p12 -srcstoretype PKCS12
```

If you already have a certificate and want to import it into a Java KeyStore, use `keytool -importcert`:

```bash
keytool -importcert -keystore YOURFILENAME.jks -alias customerxxxalias -file customerxxx.cer
```

- Replace `YOURFILENAME.jks` with the name of your existing KeyStore file.
- Replace `customerxxxalias` with the desired alias for the imported certificate.
- `customerxxx.cer` is the path to the certificate file to import.

You will be prompted for the KeyStore password and asked to confirm the import. Once imported, the certificate is associated with the specified alias in the KeyStore.
