# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security vulnerability in SciCalc Pro, please **do not** open a public issue.

Instead, report it privately by emailing:
📧 **pantane254@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

You can expect a response within **48 hours**. If the vulnerability is confirmed, a fix will be released as soon as possible and you will be credited.

## Security Measures

- All payment requests are processed via **Lipana.dev** — no card data touches our servers
- Webhook payloads are verified using `x-lipana-signature` before processing
- API keys are stored as environment variables — never hardcoded
- License state is validated server-side on every calculation request
