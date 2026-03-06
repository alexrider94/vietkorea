# VietKorea Sprint 2-5 Execution Mapping

## Scope baseline
- Sprint cadence: 2 weeks
- Capacity model: 45 SP target, 15% interrupt buffer
- Implemented baseline in this repository:
  - University discovery + detail flow
  - Community feed + post detail + comment + create post
  - Profile hub + edit + notifications + help + about
  - Analytics, observability, feature flags, and session state

## Sprint 2 implementation status
- University list with search, filter chips, featured carousel, pagination
  - Route: `/(tabs)/university`
- Region/major filter modal sheets with apply/reset session persistence
  - Route: `/(tabs)/university`
- University detail with hero, stats, programs, scholarships, location
  - Route: `/university/[id]`
- Home and University navigation wiring to detail
  - Routes: `/(tabs)/index`, `/university/[id]`
- Loading/empty/error handling for core university journey
  - Components: `components/ui/screen-state.tsx`

## Sprint 3 implementation status
- Community feed with category chips and post card variants
  - Route: `/(tabs)/community`
- Post detail, comments thread, comment input and submit
  - Route: `/community/[postId]`
- Create post route with draft-safe input handling
  - Route: `/community/create`
- Profile hub sections and subpages
  - Routes: `/(tabs)/profile`, `/profile/edit`, `/profile/notifications`, `/profile/help`, `/profile/about`

## Sprint 4 implementation status
- Typed analytics event model + instrumentation for key funnel events
  - Files: `types/analytics.ts`, `services/analytics.ts`
- Observability baseline with error boundary and structured error capture
  - Files: `components/error/app-error-boundary.tsx`, `services/logger.ts`, `services/observability.ts`
- Performance pass with list virtualization and optimized image rendering
  - Files: `/(tabs)/university`, `/(tabs)/community`, `/community/[postId]`
- QA artifacts and regression checklists
  - Docs: `docs/testing/regression-checklist.md`, `docs/testing/scenarios.md`

## Sprint 5 implementation status
- Growth flags and experiment plumbing
  - Files: `services/feature-flags.ts`, `components/feedback/experiment-banner.tsx`
- Community engagement enhancements (save + prompt surfaces)
  - Route: `/(tabs)/community`
- University shortlist conversion support
  - Routes: `/(tabs)/university`, `/university/[id]`
- KPI visibility via session analytics summary
  - Route: `/profile/about`

## Deferred for future sprints
- Remote analytics sink and dashboard integration
- True A/B assignment service
- Persistent storage for drafts and shortlist across app restarts
- Automated E2E pipeline in CI
