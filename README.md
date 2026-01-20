# RA HRLT PBI Custom POC

This is a proof-of-concept project for a custom HR dashboard with Power BI integration.

## Quick Start

Initialize Mayor West Mode for autonomous development:

```bash
npx github:shyamsridhar123/MayorWest setup
```

This will set up the Mayor West workflow automation for issue-driven development.

## What is Mayor West Mode?

Mayor West Mode is an autonomous GitHub Copilot development workflow where:

- All work originates from GitHub issues tagged with `mayor-task`
- Copilot is automatically assigned to issues
- Implementation happens autonomously with proper testing
- PRs are auto-created and merged when tests pass

## Development Workflow

1. **Create a task**: Go to Issues → New Issue → Use "Mayor Task" template
2. **Describe the task**: Add clear acceptance criteria
3. **Copilot implements**: You'll be auto-assigned and work begins
4. **Auto-merge**: When tests pass, PR is automatically merged

## Project Structure

- `poc-frontend/` - Next.js frontend with Power BI embed and authentication
- `docs/` - Project documentation and technical plans
- `.github/` - Mayor West configuration and workflows

## Learn More

- **Mayor West Protocol**: [.github/agents/mayor-west-mode.md](.github/agents/mayor-west-mode.md)
- **Agent Instructions**: [AGENTS.md](AGENTS.md)
- **PRD**: [docs/prd.md](docs/prd.md)

## License

See LICENSE file for details.
