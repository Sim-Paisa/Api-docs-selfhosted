# Mutual-ssl

Simpaisa allows pay-out calls from external systems only when authentication is performed via mutual SSL with RSA encryption.

## SSL handshake

All API connections between Simpaisa and partner systems must be secured using 2-way (mutual) SSL. Unlike 1-way SSL — where the client only verifies the server — in a 2-way setup the server also verifies the client.

* **Outbound (Simpaisa → Partner):** the partner acts as the server and presents its SSL server certificate for Simpaisa to verify. If successful, Simpaisa presents its client certificate for the partner to verify.
* **Inbound (Partner → Simpaisa):** Simpaisa acts as the server and presents its SSL server certificate for the partner to verify. If successful, the partner presents its client certificate for Simpaisa to verify.

A partner may act as both a server (for one set of services) and a client (for others).

***

## Minimum SSL requirements

Any third-party endpoint connected to Simpaisa must meet the following minimum standards:

* The primary certificate's Common Name must match the resolved domain name (to avoid common-name mismatch errors).
* Wildcard and self-signed certificates are acceptable.
* The server must not be vulnerable to Heartbleed ([CVE-2014-0160](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0160)).
* The server must not be exploitable via the OpenSSL CCS Injection vulnerability ([CVE-2014-0224](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0224)).
* X.509 certificates must use an RSA key no smaller than 2048-bit.
* X.509 certificates must be signed using an SHA-2 hash.
* The server certificate must not have been revoked by a certificate authority.
* SSL 2.0 and SSL 3.0 must not be supported.
* TLS 1.2 or greater must be supported.
* Cipher suites for symmetric encryption must have a minimum key length of 112 bits.

***

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

* Replace `YOURFILENAME.jks` with the name of your existing KeyStore file.
* Replace `customerxxxalias` with the desired alias for the imported certificate.
* `customerxxx.cer` is the path to the certificate file to import.

You will be prompted for the KeyStore password and asked to confirm the import. Once imported, the certificate is associated with the specified alias in the KeyStore.
