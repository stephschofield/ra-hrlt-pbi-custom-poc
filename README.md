# ra-hrlt-pbi-custom-poc

Power BI Custom Visual Proof of Concept with Mayor West Mode autonomous development workflows.

## Quick Start

This project uses **Mayor West Mode** for autonomous GitHub Copilot development. To set up:

```bash
npx github:shyamsridhar123/MayorWest setup
```

## GitHub PAT Setup

The Mayor West orchestrator requires a fine-grained Personal Access Token (PAT) to automate task assignment and PR management. This section guides you through creating and configuring the token.

### Why These Permissions Are Needed

The Mayor West orchestrator (`GH_AW_AGENT_TOKEN`) automates the entire development workflow:
- **Auto-approves** Copilot's pending workflow runs that require manual approval
- **Assigns** copilot-swe-agent to issues labeled `mayor-task` using GitHub's GraphQL API
- **Creates comments** with task instructions and project conventions
- **Approves and merges** Copilot's pull requests automatically when tests pass
- **Marks draft PRs** as ready for review when Copilot completes work

Without proper permissions, the orchestrator cannot fully automate the workflow.

### Required Fine-Grained PAT Scopes

When creating your Personal Access Token, configure these repository permissions:

| Permission | Access Level | Purpose |
|------------|-------------|---------|
| **Actions** | Read and Write | Approve and rerun pending workflow runs from Copilot |
| **Contents** | Read and Write | Allow Copilot to commit changes and push code to branches |
| **Issues** | Read and Write | Assign copilot-swe-agent to issues and create task comments |
| **Pull Requests** | Read and Write | Create, review, approve, and merge Copilot's PRs |
| **Workflows** | Read and Write | Interact with and manage workflow runs |

### Step-by-Step PAT Creation

1. **Navigate to GitHub Token Settings**
   - Go to [GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/tokens?type=beta)
   - Or: Click your profile picture → Settings → Developer settings → Personal access tokens → Fine-grained tokens

2. **Generate New Token**
   - Click **"Generate new token"**
   - Token name: `Mayor West Orchestrator` (or your preferred name)
   - Expiration: **90 days** (recommended for security; you'll be notified before expiration)
   - Description: "Autonomous Copilot orchestrator for ra-hrlt-pbi-custom-poc"

3. **Select Repository Access**
   - Choose **"Only select repositories"**
   - Select: `stephschofield/ra-hrlt-pbi-custom-poc`

4. **Configure Repository Permissions**
   Scroll to "Repository permissions" and set:
   - **Actions**: Read and Write
   - **Contents**: Read and Write
   - **Issues**: Read and Write
   - **Pull requests**: Read and Write
   - **Workflows**: Read and Write

5. **Generate and Copy Token**
   - Click **"Generate token"** at the bottom
   - **⚠️ IMPORTANT**: Copy the token immediately - you won't be able to see it again!

### Adding the Secret to Your Repository

1. **Navigate to Repository Settings**
   - Go to your repository: `https://github.com/stephschofield/ra-hrlt-pbi-custom-poc`
   - Click **Settings** tab (requires admin access)

2. **Access Secrets Configuration**
   - In the left sidebar, expand **"Secrets and variables"**
   - Click **"Actions"**

3. **Create New Secret**
   - Click **"New repository secret"**
   - Name: `GH_AW_AGENT_TOKEN`
   - Value: Paste the PAT you generated earlier
   - Click **"Add secret"**

4. **Verify Setup**
   - The secret should now appear in the list as `GH_AW_AGENT_TOKEN`
   - The orchestrator workflow will automatically use this token

### Token Security Best Practices

- **Never commit** the token value to your repository
- **Set expiration** - tokens should expire within 90 days maximum
- **Use fine-grained tokens** - they're more secure than classic PATs
- **Review token usage** regularly in GitHub Settings → Developer settings
- **Regenerate tokens** before they expire to avoid workflow disruptions

### Troubleshooting

**Workflow fails with "Resource not accessible by integration":**
- Verify all five permission scopes are set to "Read and Write"
- Ensure the token has access to this specific repository
- Check that the token hasn't expired

**Copilot not being assigned to issues:**
- Confirm the `GH_AW_AGENT_TOKEN` secret exists in repository settings
- Verify the token has "Issues: Read and Write" permission
- Check that issues are labeled with `mayor-task`

**PRs not being merged automatically:**
- Ensure token has "Pull requests: Read and Write" permission
- Verify all tests pass in the PR
- Check workflow logs at `.github/workflows/mayor-west-orchestrator.yml`

## Development

### Creating Tasks

All work in this project flows through GitHub issues using the Mayor Task workflow:

1. Go to [Issues → New Issue](../../issues/new/choose)
2. Select the **"Mayor Task"** template
3. Fill in clear acceptance criteria
4. Copilot will be auto-assigned
5. PRs are auto-merged when tests pass

### Commands

```bash
npm install           # Install dependencies
npm test              # Run tests
npm run lint          # Lint code
```

## Project Structure

This is a monorepo containing:
- `poc-frontend/` - Power BI custom visual implementation

## Contributing

This project uses Mayor West Mode for development. All contributions must:
- Originate from a GitHub issue labeled `mayor-task`
- Follow the commit format: `[MAYOR] <description>`
- Include `Fixes #<issue-number>` in PR descriptions
- Pass all tests before merging

## License

[License information to be added]
