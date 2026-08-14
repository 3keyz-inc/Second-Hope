# Contributing to OmniHealth Portal

Thank you for your interest in contributing to OmniHealth! We welcome contributions from clinical researchers, software engineers, and health data scientists.

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/omnihealth-portal.git
   cd omnihealth-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY from https://aistudio.google.com/
   ```

4. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## Conventional Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) to maintain a clean git history:

- `feat: add personalized clinical trial filtering by target biomarker`
- `fix: resolve JWT token refresh edge case in auth middleware`
- `docs: update API documentation with admin endpoints`
- `refactor: extract user profile modal into separate subcomponent`
- `perf: memoize biomarker chart rendering`

## Code Standards

- **TypeScript**: Strict typing with no implicit `any`.
- **Linting & Verification**: Run `npm run lint` and `npm run build` before submitting a PR.
- **Tailwind CSS**: Use utility classes directly with responsive modifiers (`sm:`, `md:`, `lg:`).

## Pull Request Process

1. Fork the repo and create your feature branch: `git checkout -b feat/my-feature`.
2. Commit your changes following conventional commit syntax.
3. Push to your branch and open a Pull Request.
4. Provide a clear description of the problem solved and test steps.
