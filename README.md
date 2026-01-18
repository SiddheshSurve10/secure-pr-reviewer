# Secure PR Reviewer

A production-ready GitHub App that provides intelligent, automated PR review comments on GitHub repositories.  Built with TypeScript, Probot, and designed for security-focused code analysis.

## 🎯 Features

- **Automated PR Reviews**: Listens to PR events and provides comprehensive analysis
- **Multi-Agent Review System**:
  - 🔒 **Security Reviewer**: Detects common vulnerabilities and security patterns
  - 📊 **Scope Reviewer**: Analyzes PR size and focus
  - 🔍 **Behavior Reviewer**: Checks code quality and best practices
  - 🧪 **Tests Reviewer**: Validates test coverage
- **Intelligent Verdict System**:  APPROVE, WARN, or BLOCK based on findings
- **Safe by Design**: Read-only access, evidence-based comments only, no code suggestions
- **Production Ready**: TypeScript, comprehensive error handling, logging
- **Extensible**: Ready for LLM integration (OpenAI, Gemini, Claude) and Semgrep

## 📋 Requirements

- **Node.js**: 20.x or higher
- **npm** or **yarn**: For dependency management
- **GitHub Account**: To create and manage the GitHub App
- **GitHub App Credentials**: APP_ID, PRIVATE_KEY, and WEBHOOK_SECRET

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/SiddheshSurve10/secure-pr-reviewer.git
cd secure-pr-reviewer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a GitHub App

1. Go to **Settings → Developer settings → GitHub Apps → New GitHub App**
2. Fill in the form: 
   - **App Name**: `secure-pr-reviewer` (or your preferred name)
   - **Homepage URL**: `https://github.com/SiddheshSurve10/secure-pr-reviewer`
   - **Webhook URL**:  Leave blank for now (we'll update after deployment)
   - **Webhook secret**: Generate a random string and save it
   - **Permissions**:
     - **Repository permissions**:
       - `Contents`: Read-only
       - `Pull requests`: Read & write
       - `Issues`: Read & write
     - **Subscribe to events**:
       - `Pull request`

3. Save the **App ID** and generate a **Private Key** (save as `private-key.pem`)

### 4. Setup Environment

```bash
cp .env.example . env
```

Fill in your `.env` file:

```env
APP_ID=your_app_id_here
PRIVATE_KEY_PATH=./private-key.pem
WEBHOOK_SECRET=your_webhook_secret_here
```

**Important**: Add `private-key.pem` to `.gitignore` (already configured)

### 5. Local Development

```bash
npm run build
npm run dev
```

The app will start on `http://localhost:3000`. Probot will show you a tunnel URL to receive webhooks.

### 6. Install the App on a Repository

1. Go to `https://github.com/apps/your-app-name/installations/new`
2. Select repositories to install the app on
3. The app will immediately start reviewing new/updated PRs

## 📁 Project Structure

```
secure-pr-reviewer/
├── src/
│   ├── index.ts                 # App entry point
│   ├── webhook.ts               # PR event handler
│   ├── reviewers/
│   │   ├── scope.ts            # Scope analysis agent
│   │   ├── security.ts         # Security analysis agent
│   │   ├── behavior.ts         # Code quality agent
│   │   ├── tests.ts            # Test coverage agent
│   │   └── aggregate.ts        # Results aggregation
│   ├── github/
│   │   ├── diff.ts             # Diff fetching
│   │   ├── comments.ts         # Comment generation
│   │   └── api.ts              # GitHub API utilities
│   └── utils/
│       └── llm.ts              # LLM integration stubs
├── package.json
├── tsconfig. json
├── .env.example
└── README.md
```

## 🔧 Development Guide

### Running Tests

```bash
npm run test
npm run test:watch  # Watch mode
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

Output will be in `./dist/`

## 🧠 How It Works

1. **Webhook Event**: PR is opened/updated
2. **Fetch Diff**: App retrieves the PR diff from GitHub API
3. **Multi-Agent Analysis**: Runs 4 parallel review agents
4. **Aggregate Results**: Combines findings into verdict
5. **Post Comment**: Posts comprehensive review comment on PR

### Review Agents

#### Security Reviewer
- Detects hardcoded secrets
- Checks for SQL injection patterns
- Identifies unsafe deserialization
- Validates input handling

**Integration Points**:  Semgrep API, OpenAI/Claude for LLM analysis

#### Scope Reviewer
- Analyzes number of changed files
- Tracks lines added/removed
- Ensures PR focus

#### Behavior Reviewer
- Checks for error handling patterns
- Detects debug logging
- Validates code comments

#### Tests Reviewer
- Checks for test file changes
- Estimates coverage
- Validates test patterns

### Verdict Logic

- **BLOCK** ⛔: Critical or high security issues detected
- **WARN** ⚠️: Medium severity issues or unfocused scope
- **APPROVE** ✅: All checks pass or only low severity issues

## 🔐 Safety Guarantees

✅ **Read-Only Access**: Never modifies repo files
✅ **No Auto-Merge**: Never merges PRs automatically
✅ **Evidence-Based**: All comments backed by analysis
✅ **No Code Suggestions**: Uses GitHub's suggestion feature instead
✅ **Rate Limited**:  Respects GitHub API limits
✅ **Error Safe**: Graceful error handling without crashes

## 🔌 Integrations

### Optional:  LLM Integration

To enable advanced AI-powered analysis:

1. **OpenAI API**:
   ```env
   LLM_PROVIDER=openai
   LLM_API_KEY=sk-... 
   LLM_MODEL=gpt-4-turbo
   ```

2. **Google Gemini**:
   ```env
   LLM_PROVIDER=gemini
   LLM_API_KEY=...
   LLM_MODEL=gemini-pro
   ```

3. **Anthropic Claude**:
   ```env
   LLM_PROVIDER=anthropic
   LLM_API_KEY=sk-ant-...
   LLM_MODEL=claude-3-opus
   ```

See `src/utils/llm.ts` for integration points. 

### Optional: Semgrep Integration

Enable static security analysis:

```env
SEMGREP_API_KEY=your_semgrep_key
```

See `src/reviewers/security.ts` for integration.

## 🚢 Deployment

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add environment variables
railway variables

# Deploy
railway up
```

### Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Create app
flyctl apps create secure-pr-reviewer

# Deploy
flyctl deploy
```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku apps:create secure-pr-reviewer

# Set config variables
heroku config:set APP_ID=...  PRIVATE_KEY=...  WEBHOOK_SECRET=...

# Deploy
git push heroku main
```

## 📊 Monitoring

The app includes a health check endpoint:

```bash
curl http://localhost:3000/health
# {"status":  "ok"}
```

### Logs

View app logs (local):
```bash
npm run dev
```

View app logs (production):
```bash
# Fly.io
flyctl logs -a secure-pr-reviewer

# Railway
railway logs

# Heroku
heroku logs --tail
```

## 🐛 Troubleshooting

### App doesn't receive webhooks
1. Check webhook URL is correct in GitHub App settings
2. Verify WEBHOOK_SECRET matches in `.env`
3. Check logs for errors

### Permission errors
1. Verify GitHub App has correct permissions set
2. Check if app is installed on the repository
3. Verify PRIVATE_KEY is valid

### LLM integration not working
1. Check API key is correct in `.env`
2. Verify API key has necessary permissions
3. Check rate limits not exceeded

## 📝 Example Output

When you open a PR, you'll see a comment like:

```
## ✅ Review Passed

**Recommendation:** This PR looks good and ready for review.

### Summary
✅ PR scope is focused and well-defined | ✅ No obvious security issues detected | ✅ Code quality looks good | ✅ Tests added for code changes

### Detailed Analysis

#### 📊 Scope
- Files changed: 3
- Lines added: 45
- Lines removed: 12
- Status: ✅ PR scope is focused and well-defined

#### 🔒 Security
No obvious security issues detected.

#### 🔍 Code Quality
Code quality looks good.

#### 🧪 Tests
✅ Tests added for code changes

---
_This is an automated review by secure-pr-reviewer.  Maintainers should review all findings and use their judgment._
```

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📧 Support

For issues or questions: 
1. Check [GitHub Issues](https://github.com/SiddheshSurve10/secure-pr-reviewer/issues)
2. Review the documentation above
3. Check Probot docs:  https://probot.github.io

## 🔗 References

- [Probot Documentation](https://probot.github.io)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Apps Guide](https://docs.github.com/en/developers/apps)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

**Built with ❤️ by SiddheshSurve10**