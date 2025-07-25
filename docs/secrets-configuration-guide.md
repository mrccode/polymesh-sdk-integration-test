# GitHub Actions Secrets Configuration Guide

## Required Secrets for generate-next-preview.yml Workflow

The following secrets must be configured in the repository settings before the workflow can run successfully:

### 1. BOT_PAT (GitHub Personal Access Token)
**Purpose**: Enables the workflow to authenticate with GitHub API for creating issues, releases, and branches.

**Configuration Steps**:
1. Navigate to Repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `BOT_PAT`
4. Value: Personal Access Token from the bot account (see scripts/bot-setup/github-pat-setup.txt)
5. Click "Add secret"

**Required Permissions**:
- Contents: Read and Write
- Issues: Write
- Pull requests: Write
- Metadata: Read
- Actions: Read
- Checks: Write
- Commit statuses: Write

### 2. NPM_TOKEN (NPM Publishing Token)
**Purpose**: Enables the workflow to publish preview packages to NPM registry.

**For Test Environment (Mock Publishing)**:
- **NOT REQUIRED** - The workflow uses `npm publish --dry-run` by default
- Mock publishing validates package building without actual publication
- See docs/npm-mock-publishing-guide.md for details

**For Production Environment (Real Publishing)**:
1. Navigate to Repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: NPM Automation Token (see scripts/bot-setup/npm-token-setup.txt)
5. Click "Add secret"

## Verification

After configuring secrets, verify they are accessible:

```bash
# List configured secrets (this will show names only, not values)
gh secret list --repo owner/repo

# Expected output:
# BOT_PAT
# NPM_TOKEN  (if using real NPM publishing)
```

## Security Notes

- Secrets are encrypted and can only be used in workflow runs
- Never log or echo secret values in workflow steps
- Tokens should be rotated regularly (BOT_PAT: 90 days, NPM_TOKEN: 365 days)
- Use minimal permissions for all tokens
- Monitor secret usage in repository security logs

## Troubleshooting

### Common Issues:
1. **"Secret not found"** - Verify secret name matches exactly (case-sensitive)
2. **"Authentication failed"** - Check token permissions and expiration
3. **"Rate limit exceeded"** - Bot token may need higher rate limits

### Testing Secret Access:
The workflow will fail early if required secrets are not accessible, preventing unnecessary execution time.