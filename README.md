# Polymesh SDK Integration Test Repository

## Purpose

This repository is specifically created for end-to-end testing of the **Ephemeral Next Major Release Integration** process. It serves as a controlled environment to validate all aspects of the breaking change management system described in the main project documentation.

## ⚠️ Important Notice

**This is a test repository.** It contains:
- Sample code for testing purposes only
- Automated workflows designed for validation scenarios
- Test data that should not be used in production
- Ephemeral branches that may be created and deleted during testing

## Repository Structure

```
├── master              # Production-like release branch (protected)
├── develop             # Integration branch for stable features (protected)
├── bc-*-*             # Breaking change branches (created during tests)
├── feature/*          # Test feature branches
├── bugfix/*           # Test bug fix branches
└── docs/              # Test documentation and guides
```

## Branch Protection Rules

### Master Branch
- ✅ Requires 2 pull request reviews
- ✅ Requires status checks to pass
- ✅ Enforces linear history (no merge commits)
- ✅ Restricts force pushes and deletions
- ✅ Includes administrators in restrictions

### Develop Branch
- ✅ Requires 1 pull request review
- ✅ Requires status checks to pass
- ✅ Enforces linear history (no merge commits)
- ✅ Restricts force pushes and deletions
- ✅ Configured for automation integration

## Testing Workflows

This repository supports testing of:

1. **Breaking Change Management**: Using `bc-<number>-<description>` branch naming
2. **Automated Integration**: GitHub Actions workflows for preview generation
3. **Conflict Resolution**: Simulated merge conflicts and resolution processes
4. **Release Candidate Creation**: Automated RC branch generation
5. **Linear History Enforcement**: Validation of merge commit prevention

## Usage During Tests

### Creating Test Breaking Changes
```bash
# Create a breaking change branch for testing
git checkout -b bc-1-test-breaking-change develop
git commit -S -m "feat!: test breaking change for validation"
git push origin bc-1-test-breaking-change
```

### Triggering Test Workflows
```bash
# Trigger preview generation workflow
git checkout develop
git commit --allow-empty -S -m "chore: trigger test workflow"
git push origin develop
```

## Access and Permissions

- **Test Team Members**: Read/write access for creating test scenarios
- **Automation Bot**: Push access for workflow testing
- **Administrators**: Full access with enforcement of protection rules

## Cleanup and Lifecycle

This repository is designed for:
- **Setup**: Initial configuration and validation
- **Testing**: Comprehensive test execution over 2-3 weeks
- **Analysis**: Results collection and documentation
- **Cleanup**: Removal after successful testing completion

## Related Documentation

- [Main Process Documentation](../PROCESS.md)
- [Test Execution Guide](../specs/execution-guide.md)
- [Task Specifications](../specs/tasks.md)

## Support and Issues

For testing-related issues or questions:
1. Check the [troubleshooting guide](docs/troubleshooting.md)
2. Review test execution logs
3. Contact the test coordination team
4. File issues using the provided templates

---

**Last Updated**: 2025-07-24
**Test Phase**: Infrastructure Setup
**Status**: Active Testing Repository
