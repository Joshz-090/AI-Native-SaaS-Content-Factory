# Contributing to AI-Native SaaS Content Factory

First off, thank you for considering contributing to this enterprise AI platform. As a Staff-level repository, we maintain high standards for code quality, safety, and documentation.

## ⚖️ Standards
- **Type Safety**: All new features MUST be written in strict TypeScript. No `any` types unless absolutely unavoidable for library interop.
- **Architectural Integrity**: Ensure any new services follow the shared domain boundaries. Avoid tight coupling between the UI and the Worker layers.
- **Multi-tenancy**: New database queries MUST include Row-Level Security (RLS) considerations.
- **Testing**: PRs with complex logic require unit or integration tests.

## 🚀 Getting Started
1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Follow the [README.md](./README.md) for local setup.
4. Ensure your code passes linting: `npm run lint`.

## 📦 Pull Request Process
1. Update documentation if you're changing the API or folder structure.
2. Ensure the build passes: `npm run build`.
3. Describe the problem your PR solves and the engineering trade-offs you made.

## 🛡️ Security
If you find a security vulnerability, please do NOT open a public issue. Email the maintainer directly to ensure a private disclosure process.

---

Maintainers reserve the right to reject PRs that do not align with the enterprise design goals of the platform.
