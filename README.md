# Polymesh SDK Integration Test

[![CI](https://github.com/test-org/polymesh-sdk-integration-test/workflows/CI/badge.svg)](https://github.com/test-org/polymesh-sdk-integration-test/actions)
[![Coverage](https://codecov.io/gh/test-org/polymesh-sdk-integration-test/branch/main/graph/badge.svg)](https://codecov.io/gh/test-org/polymesh-sdk-integration-test)
[![npm version](https://badge.fury.io/js/%40test-org%2Fpolymesh-sdk-integration-test.svg)](https://badge.fury.io/js/%40test-org%2Fpolymesh-sdk-integration-test)

A comprehensive TypeScript project designed specifically for testing the **Ephemeral Next Major Release Integration** process. This repository serves as a realistic codebase with meaningful inter-module dependencies to validate breaking change management workflows.

## 🎯 Project Purpose

This project is part of the infrastructure for testing breaking change integration processes. It provides:

- **Realistic TypeScript codebase** with modern tooling and dependencies
- **Inter-module relationships** that create cascading effects when modified
- **Comprehensive test coverage** to validate breaking change detection
- **CI/CD integration** for automated testing and validation
- **Security-hardened configuration** following 2025 best practices

## ⚠️ Important Notice

**This is a test repository.** It contains:

- Sample code for testing purposes only
- Automated workflows designed for validation scenarios
- Test data that should not be used in production
- Ephemeral branches that may be created and deleted during testing

## 🏗️ Architecture

The project simulates a blockchain SDK with the following modules:

```
src/
├── api/           # API layer with pagination and response formatting
├── asset/         # Asset management with metadata and validation
├── transaction/   # Transaction processing with inter-asset dependencies
├── types/         # Shared type definitions with Zod validation
└── utils/         # Error handling and common utilities
```

### Key Dependencies

- **Asset ↔ Transaction**: Transactions validate against asset supply limits
- **API ↔ All Modules**: API layer orchestrates all business logic
- **Types ↔ All Modules**: Shared types create coupling across modules
- **Utils ↔ All Modules**: Error handling provides cross-cutting concerns

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
trigger workflow clean
trigger final workflow validation
