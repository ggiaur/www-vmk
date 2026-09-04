# VMK parity P0 role contract

- **Cloud/Claude:** sole implementation writer for the active remediation slice.
- **Codex:** independent adversarial reviewer; no alternate implementation unless explicitly reassigned after review failure.
- **Gemini/Jeremy:** independent reference/coverage reviewer; no implementation.
- **ChatGPT/Product Architect:** acceptance-contract owner and reconciliation supervisor.

Only one remediation family/slice may be ACTIVE at a time. A reviewer finding creates a fix request on the active slice; it does not authorize a new architecture, new site rewrite, or unrelated cleanup.
