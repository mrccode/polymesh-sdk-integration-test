# Testing Guide

## Overview

This guide provides instructions for testing the Ephemeral Next Major Release Integration process using this test repository.

## Test Environment Setup

### Prerequisites

- GitHub account with write access to this repository
- Git CLI configured with commit signing (ed25519-sk keys preferred)
- Node.js 18+ installed locally
- GitHub CLI (`gh`) installed and authenticated

### Environment Variables

For automated testing, configure these environment variables:

```bash
export GITHUB_TOKEN="your_github_token"
export NPM_TOKEN="your_npm_token"  # For package publishing tests
export GITHUB_ORG="mrccode"        # Organization/user owning test repo
export REPO_NAME="polymesh-sdk-integration-test"
```

## Test Scenarios

### 1. Basic Breaking Change Branch Creation

```bash
# Create a test breaking change branch
git checkout develop
git pull origin develop
git checkout -b bc-1-test-feature develop

# Add some test changes
echo "// Test breaking change" >> test-change.js
git add test-change.js
git commit -S -m "feat!: add test breaking change

BREAKING CHANGE: This is a test breaking change for validation"

git push origin bc-1-test-feature
```

### 2. Multiple Ordered Branches

```bash
# Create multiple breaking change branches with different numbers
for i in 1 5 10; do
  git checkout develop
  git checkout -b bc-$i-test-feature-$i develop
  echo "// Breaking change $i" >> "test-change-$i.js"
  git add "test-change-$i.js"
  git commit -S -m "feat!: breaking change $i

BREAKING CHANGE: Test breaking change number $i"
  git push origin bc-$i-test-feature-$i
done
```

### 3. Trigger Integration Workflow

```bash
# Trigger workflow via develop push
git checkout develop
git commit --allow-empty -S -m "chore: trigger integration workflow"
git push origin develop

# Or trigger manually via GitHub CLI
gh workflow run generate-next-preview.yml
```

### 4. Test Conflict Scenarios

```bash
# Create conflicting changes
git checkout develop
echo "const conflictingLine = 'develop version';" >> conflict-test.js
git add conflict-test.js
git commit -S -m "chore: add line that will conflict"
git push origin develop

git checkout -b bc-2-conflicting-change develop~1
echo "const conflictingLine = 'bc-2 version';" >> conflict-test.js
git add conflict-test.js
git commit -S -m "feat!: conflicting change

BREAKING CHANGE: This will conflict with develop"
git push origin bc-2-conflicting-change
```

## Validation Checklist

### Branch Protection Validation

- [ ] Cannot push directly to `master` branch
- [ ] Cannot push directly to `develop` branch
- [ ] Pull requests require appropriate number of reviewers
- [ ] Linear history is enforced (no merge commits)
- [ ] Force pushes are restricted appropriately

### Workflow Validation

- [ ] Branch name validation workflow runs on `bc-*` branches
- [ ] Invalid branch names are rejected
- [ ] Valid branch names pass validation
- [ ] Integration workflow discovers branches correctly
- [ ] Branches are processed in numerical order

### Integration Process Validation

- [ ] Breaking change branches are discovered automatically
- [ ] Branches are sorted by embedded number
- [ ] Conflicts are handled gracefully
- [ ] GitHub issues are created for conflicts
- [ ] Non-conflicting branches continue to integrate
- [ ] Preview releases are generated successfully

### Security Validation

- [ ] Repository access controls work correctly
- [ ] Bot accounts have appropriate permissions
- [ ] Secrets are properly configured and secured
- [ ] Branch protection includes administrators

## Monitoring and Debugging

### GitHub Actions Logs

- Check workflow logs in the Actions tab
- Look for specific job failures or warnings
- Verify all required secrets are configured

### API Rate Limits

```bash
# Check current GitHub API rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit
```

### Branch Status Checks

```bash
# List all breaking change branches
git branch -r | grep bc- | sort -V

# Check branch protection status
gh api repos/$GITHUB_ORG/$REPO_NAME/branches/develop/protection
gh api repos/$GITHUB_ORG/$REPO_NAME/branches/master/protection
```

## Cleanup Procedures

### After Test Completion

```bash
# Delete test breaking change branches
git branch -r | grep bc- | sed 's/origin\///' | xargs -I {} git push origin --delete {}

# Reset develop branch if needed
git checkout develop
git reset --hard origin/develop

# Clean up local branches
git branch | grep bc- | xargs git branch -D
```

### Emergency Reset

If the repository becomes unusable:

1. Document the current state and issue
2. Create a backup of important test data
3. Reset repository to last known good state
4. Restart affected test scenarios

## Troubleshooting

See [troubleshooting.md](troubleshooting.md) for common issues and solutions.

## Contact and Support

For issues with testing:

1. Check GitHub Actions logs first
2. Review this testing guide
3. Consult the troubleshooting guide
4. File an issue with detailed reproduction steps
