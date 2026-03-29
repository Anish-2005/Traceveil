# Contributing to Traceveil

Thanks for contributing.

This guide explains how to make changes safely and consistently across the FastAPI backend and Next.js frontend.

## Development Setup

### 1) Clone and install dependencies

Backend:
```bash
pip install -r requirements.txt
```

Frontend:
```bash
cd webapp
npm install
```

### 2) Run locally

Recommended:
```bash
# Windows
start.bat

# macOS/Linux
./start.sh
```

Manual:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
cd webapp && npm run dev
```

## Branching and Commits

- Create a feature/fix branch from `main`.
- Keep each pull request focused on one concern.
- Use clear commit messages with intent and scope.

Suggested commit format:
```text
type(scope): summary
```

Examples:
- `feat(webapp): add model intelligence card animation`
- `fix(api): prevent model status crash when torch unavailable`
- `docs(readme): refresh quickstart and API matrix`

## Code Standards

- Prefer small, readable functions and explicit names.
- Avoid introducing breaking API changes without documenting migration steps.
- Keep UI changes responsive and consistent with the existing design system.
- Do not commit secrets, tokens, or private credentials.

## Testing and Validation

Before opening a PR:

Backend:
```bash
pytest
```

Frontend:
```bash
cd webapp
npm run build
```

If you changed API contracts, also verify affected UI pages manually.

## Pull Request Checklist

- [ ] Changes build successfully
- [ ] Tests pass (or rationale provided)
- [ ] README/docs updated when behavior changes
- [ ] No sensitive data committed
- [ ] Screenshots attached for major UI changes

## Reporting Security Issues

Do not open a public issue for sensitive vulnerabilities.
Share a private report with reproduction details, impact, and suggested remediation.

