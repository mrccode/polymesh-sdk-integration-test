# Troubleshooting Guide

## Common Issues

### Branch Protection Violations

**Issue**: Unable to push directly to protected branches
**Solution**: 
```bash
# Always use pull requests for protected branches
git checkout -b feature/my-change develop
# Make changes
git push origin feature/my-change
# Create PR via GitHub web interface
```

### Linear History Violations

**Issue**: Merge commits rejected by branch protection
**Solution**:
```bash
# Use squash merge or rebase merge instead
git checkout develop
git merge --squash feature/my-change
# OR
git rebase feature/my-change
```

### API Rate Limits

**Issue**: GitHub API requests being rate limited during tests
**Solution**:
- Check current rate limit status: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit`
- Wait for rate limit reset
- Use conditional requests with ETags where possible
- Implement exponential backoff in automation

### Workflow Failures

**Issue**: GitHub Actions workflows failing during tests
**Solution**:
1. Check workflow logs in Actions tab
2. Verify all required secrets are configured
3. Confirm branch protection rules allow workflow execution
4. Validate workflow syntax and permissions

## Emergency Procedures

### Repository Recovery
If the repository becomes unusable during testing:
1. Document the current state and issue
2. Create a backup of any important test data
3. Reset repository to last known good state
4. Restart affected test scenarios

### Access Issues
If team members lose access during testing:
1. Verify current collaborator permissions
2. Check organization membership status
3. Regenerate access tokens if needed
4. Update repository settings if permissions changed

## Contact Information

- **Test Lead**: [Contact information]
- **Repository Admin**: [Contact information]
- **Emergency Contact**: [Contact information]