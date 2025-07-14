# GitHub Workflows & Configuration

This directory contains GitHub Actions workflows and configuration files for the Vibe-Sync project.

## Workflows

### 🔄 CI/CD Workflows

- **`frontend-ci.yml`**: Builds and tests the Next.js frontend
  - Runs on Node.js 18.x and 20.x
  - Performs linting, type checking, and builds
  - Triggers on changes to `frontend/` directory

- **`backend-ci.yml`**: Tests and validates the FastAPI backend
  - Runs on Python 3.9, 3.10, and 3.11
  - Performs linting (flake8), formatting checks (black, isort)
  - Includes security scanning with safety and bandit

- **`integration.yml`**: Full-stack integration testing
  - Tests frontend and backend together
  - Validates API connectivity
  - Deploys to staging on main branch

### 🛡️ Quality & Security

- **`code-quality.yml`**: Code quality checks and security scanning
  - Dependency review for pull requests
  - CodeQL analysis for JavaScript and Python
  - Runs weekly security scans

### 🚀 Release Management

- **`release.yml`**: Automated release creation
  - Triggers on version tags (v*.*.*)
  - Creates GitHub releases with changelogs
  - Builds and uploads release artifacts

### 🏷️ Automation

- **`labeler.yml`**: Automatic issue and PR labeling
  - Labels issues based on content
  - Labels PRs based on changed files
  - Adds size labels based on change volume

## Configuration Files

### 📦 Dependabot (`dependabot.yml`)
- Updates frontend npm dependencies weekly
- Updates backend pip dependencies weekly
- Updates GitHub Actions monthly

### 📋 Issue Templates (`ISSUE_TEMPLATE/`)
- **Bug Report**: Structured bug reporting template
- **Feature Request**: Template for feature suggestions

### 📝 Pull Request Template
- Comprehensive PR checklist
- Component change tracking
- Testing requirements

## Setup Instructions

1. **Replace Placeholders**: Update `your-github-username` in templates
2. **Configure Secrets**: Add necessary secrets in repository settings:
   - `DOCKERHUB_USERNAME` (optional)
   - `DOCKERHUB_TOKEN` (optional)
3. **Create Labels**: Add these labels to your repository:
   - `enhancement`, `bug`, `documentation`
   - `frontend`, `backend`, `configuration`
   - `dependencies`, `github-actions`
   - `music-feature`, `ai-ml`
   - `size/XS`, `size/S`, `size/M`, `size/L`, `size/XL`

## Customization

### Modifying Workflows
- Adjust Node.js/Python versions in CI workflows as needed
- Update paths if you reorganize the project structure
- Modify security scanning frequency in `code-quality.yml`

### Adding New Workflows
- Follow existing naming conventions
- Use appropriate triggers (`on:` events)
- Include proper `defaults.run.working-directory` for multi-directory projects

## Usage

### Running Tests Locally
```bash
# Frontend
cd frontend
npm install
npm run lint
npm run build

# Backend
cd backend
pip install -r requirements.txt
pip install flake8 black isort
black --check .
flake8 .
```

### Creating Releases
```bash
git tag v1.0.0
git push origin v1.0.0
```

This will trigger the release workflow automatically.

## Contributing

When adding new workflows:
1. Test workflows in a fork first
2. Use the least permissions necessary
3. Add appropriate documentation
4. Follow the existing patterns for consistency
