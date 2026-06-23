# Signature-Generation

Pay-out, remittance, and card APIs require an RSA-SHA256 signature on the `request` (and verification of `response`) object. Replace `API request data goes here` with your serialized `request` JSON.

***

### RSA (digital signature) and SHA 256

RSA and SHA 256 are two of the most popular encryption algorithms designed to secure data fully.

#### How it works?

• RSA (Rivest-Shamir-Adleman) uses asymmetric encryption, which means two keys are needed to secure data. One key is private, and only the sender and recipient have access to it. The other key is public and shared with entities outside the secure conversation.

• SHA 256 is a cryptographic hash function used to produce a 256-bit hash or message digest from input of any size. Miniscule changes in the input result in an entirely different hash.

RSA and SHA 256 safely work together to protect digital data. RSA encryption is used to encrypt the data, and the SHA 256 hash protects it. The entire process ensures that the data is secure on-site and in transit, ensuring that data is protected from malicious hackers or malicious network conditions.

### Encryption for Simpaisa APIs

The merchant must send a digital signature along with each API request. Simpaisa uses this signature to authenticate the client before processing the request. The steps required to perform this encryption are described below:

● Merchants and Simpaisa must exchange RSA keys before making API calls. The RSA key must be 2048 bits long with pkcs8 padding.

● When making an API call to Simpaisa, the merchant shall use the RSA private key to sign the API request. After receiving the API request, Simpaisa will use the merchant’s RSA public key to verify whether the signature matches the content of the API request.

Similarly, when the merchant receives the API response, it is highly recommended that the client verifies the signature of the API response by using Simpaisa’s RSA public key.

### Generating RSA Key

You can generate a SHA-256 key pair with RSA 2048 bit using OpenSSL by running the following command in your terminal:

```bash
openssl genpkey -algorithm RSA -out PRIVATE_KEY.pem -pkeyopt rsa_keygen_bits:2048
```

This command generates a private key and RSA 2048-bit key length. To generate a public key from the private key, run the following command:

```bash
openssl rsa -in PRIVATE_KEY.pem -pubout -out PUBLIC_KEY.pem
```

Note

The above method is only an example to assist with the process, one can follow their respective technology or structure or generate the Key Pair.

### Signing the API Request

To generate a signature or sign an API request using an RSA private key with the SHA-256 algorithm, you may follow these steps:

• Prepare the Data: First, prepare the data you want to sign. Depending on your application's requirements, this could be the entire API request or specific parts.

• Hash the Data: Use the SHA-256 algorithm to hash the prepared data. This generates a fixed-length hash value.

• Sign the Hash: Use your RSA private key to the hashed data. Encrypting the hash with your private key creates a digital signature unique to your private key and the hashed data.

• Attach the Signature to the API Request: Include the generated signature and the API request. This could be done by adding it as a parameter in the request body, depending on the API's authentication mechanism.

• Verify the Signature: The API will use the corresponding public key to verify the signature on the server side. It decrypts the signature using the public key and compares the resulting hash with the hash of the received data. If they match, the signature is considered valid, confirming the authenticity and integrity of the API request.<br>

## Signature-Samples

### Java

```java
import java.nio.file.*;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

byte[] keyBytes = Files.readAllBytes(Path.of("private-key.pem"));
PrivateKey key = KeyFactory.getInstance("RSA")
    .generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
String data = "API request data goes here";
Signature s = Signature.getInstance("SHA256withRSA");
s.initSign(key);
s.update(data.getBytes());
String sig = Base64.getEncoder().encodeToString(s.sign());
System.out.println("Signature: " + sig);
```

***

### PHP

```php
<?php
$key = openssl_pkey_get_private(file_get_contents('private-key.pem'));
$data = 'API request data goes here';
$hash = hash('sha256', $data, true);
openssl_sign($hash, $sigBin, $key, OPENSSL_ALGO_SHA256);
echo "Signature: " . base64_encode($sigBin);
openssl_free_key($key);
?>
```

***

### Node.js

```javascript
const fs = require('fs'), crypto = require('crypto');
const key = fs.readFileSync('private-key.pem', 'utf8');
const data = 'API request data goes here';
const hash = crypto.createHash('sha256').update(data).digest();
const sig = crypto.createSign('RSA-SHA256').update(hash).sign(key, 'base64');
console.log('Signature:', sig);
```

***

### C\#

```csharp
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

string xml = File.ReadAllText("private-key.pem");
var rsa = new RSACryptoServiceProvider();
rsa.FromXmlString(xml);
byte[] data = Encoding.UTF8.GetBytes("API request data goes here");
byte[] hash = SHA256.Create().ComputeHash(data);
byte[] sig = rsa.SignHash(hash, CryptoConfig.MapNameToOID("SHA256"));
Console.WriteLine("Signature: " + Convert.ToBase64String(sig));
```

***

### Python

```python
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

with open("private-key.pem", "rb") as f:
    key = serialization.load_pem_private_key(f.read(), password=None)
data = b"API request data goes here"
h = hashes.Hash(hashes.SHA256())
h.update(data)
sig = key.sign(h.finalize(), padding.PKCS1v15(), hashes.SHA256())
print("Signature:", sig.hex())
```

***

See [RSA Signatures & Mutual SSL](authentication/rsa-mutual-ssl.md) for key exchange and mutual SSL setup.
