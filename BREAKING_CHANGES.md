# Breaking Changes

## Migration Guide

### Removed APIs

- `Transaction.submit()` -> Use `Transaction.submitAndWait()`

### Updated Interfaces

- `ErrorResponse` now includes `context` and `timestamp` fields
- `Transaction` now requires `metadata` field

### Configuration Changes

- Default network timeout changed from 10s to 30s
