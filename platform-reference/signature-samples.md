# Sample Code — Signature Generation

Pay-out, remittance, and card APIs require an RSA-SHA256 signature on the `request` (and verification of `response`) object. Replace `API request data goes here` with your serialized `request` JSON.

---

## Java

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

---

## PHP

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

---

## Node.js

```javascript
const fs = require('fs'), crypto = require('crypto');
const key = fs.readFileSync('private-key.pem', 'utf8');
const data = 'API request data goes here';
const hash = crypto.createHash('sha256').update(data).digest();
const sig = crypto.createSign('RSA-SHA256').update(hash).sign(key, 'base64');
console.log('Signature:', sig);
```

---

## C#

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

---

## Python

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

---

See [RSA Signatures & Mutual SSL](./authentication/rsa-mutual-ssl.md) for key exchange and mutual SSL setup.
