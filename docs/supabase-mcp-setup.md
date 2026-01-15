# Supabase MCP Setup Guide

This guide will help you set up the Supabase MCP server for use with your v0 custom agent.

## Prerequisites

- Node.js and npm installed
- A Supabase project (free tier works fine)
- VS Code with GitHub Copilot Chat extension

## Step 1: Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Service Role Key** (under "Project API keys" - this is the secret key, not the anon key)

⚠️ **Important**: Keep your service role key secure! Never commit it to version control.

## Step 2: Configure Environment Variables

You have two options for setting environment variables:

### Option A: User Settings (Recommended for multiple projects)

1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "GitHub Copilot Chat: Env"
3. Click "Edit in settings.json"
4. Add your Supabase credentials:

```json
{
  "github.copilot.chat.env": {
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key-here"
  }
}
```

### Option B: Workspace Settings (Project-specific)

1. Create or edit `.vscode/settings.json` in your project root
2. Add your Supabase credentials:

```json
{
  "github.copilot.chat.env": {
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key-here"
  }
}
```

⚠️ **If using workspace settings**: Add `.vscode/settings.json` to your `.gitignore`!

## Step 3: Verify MCP Configuration

The MCP configuration is already set up in `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "supabase-mcp": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "${env:SUPABASE_URL}",
        "SUPABASE_SERVICE_ROLE_KEY": "${env:SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

This configuration will automatically download and run the Supabase MCP server when needed.

## Step 4: Reload VS Code

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Reload Window"
3. Press Enter

## Step 5: Test the Integration

Open GitHub Copilot Chat and use your v0 agent mode:

1. Type `@v0` in the chat (or whatever you named your agent)
2. Ask something like:
   - "List all tables in my Supabase database"
   - "Show me the schema for the users table"
   - "What authentication providers are configured?"

## Available Supabase MCP Tools

Your v0 agent now has access to these Supabase tools:

- **supabase_list_projects** - List all Supabase projects
- **supabase_get_project_details** - Get details about a specific project
- **supabase_list_tables** - List all tables in your database
- **supabase_get_table_schema** - Get the schema for a specific table
- **supabase_execute_sql** - Execute SQL queries
- **supabase_list_functions** - List database functions
- **supabase_get_function_details** - Get details about a specific function
- **supabase_list_storage_buckets** - List storage buckets
- **supabase_list_bucket_files** - List files in a storage bucket
- **supabase_get_auth_config** - Get authentication configuration
- **supabase_list_auth_users** - List authenticated users

## Troubleshooting

### MCP Server Not Starting

If you see errors about the MCP server:

1. Ensure Node.js and npm are installed: `node --version && npm --version`
2. Try manually installing the server: `npm install -g @modelcontextprotocol/server-supabase`
3. Check that your environment variables are set correctly
4. Reload VS Code window

### Authentication Errors

If you get authentication errors:

1. Verify your service role key is correct (not the anon key)
2. Check that the SUPABASE_URL matches your project URL exactly
3. Ensure your Supabase project is active and not paused

### Tools Not Appearing

If the Supabase tools don't appear in your agent:

1. Verify `.github/agents/v0.agent.md` includes the Supabase tools in the `tools` array
2. Reload VS Code window
3. Try closing and reopening Copilot Chat

## Security Best Practices

1. **Never commit credentials** - Always use environment variables
2. **Use service role key carefully** - It has full access to your database
3. **Consider using .env files** - For local development (add to .gitignore)
4. **Rotate keys regularly** - Generate new keys periodically in Supabase dashboard
5. **Use RLS policies** - Even with service role key, implement Row Level Security

## Next Steps

Now that Supabase MCP is configured, you can:

- Ask your v0 agent to explore your database schema
- Generate SQL migrations
- Create table schemas based on your requirements
- Query data and build UI components based on your actual data structure
- Set up authentication flows
- Manage storage buckets

## Example Queries

Try asking your v0 agent:

```
@v0 What tables do I have in my database and what are their relationships?

@v0 Create a Next.js component that displays data from my users table

@v0 Generate a SQL migration to add a posts table with proper foreign keys

@v0 Show me the current authentication configuration and suggest improvements
```

---

**Need help?** Check the [Supabase MCP Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/supabase) or ask in the [Supabase Discord](https://discord.supabase.com/).
