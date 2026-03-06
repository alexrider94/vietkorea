# VietKorea API Contracts (Initial)

## Endpoints
- `GET /universities?query=&region=&major=&page=`
  - Used by university list screen
- `GET /universities/:id`
  - Used by university detail screen
- `GET /posts?category=&page=`
  - Used by community feed
- `GET /posts/:id`
  - Used by post detail
- `POST /posts/:id/comments`
  - Used by comment input on post detail
- `GET /me`
  - Used by profile overview and edit prefill
- `PATCH /me`
  - Used by edit profile save

## Current implementation
- The current repository uses a mock API service (`services/api.ts`) that mirrors these contracts and payload shapes.
- Contract-compatible domain types are defined in `types/domain.ts`.
- Transport integration can replace this mock layer without UI contract changes.
