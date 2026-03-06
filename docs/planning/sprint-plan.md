# VietKorea Sprint Plan (Sprint 2-5)

## Summary
- Planning horizon: Sprint 2 through Sprint 5
- Baseline assumption: Sprint 1 foundation is complete
- Team baseline: 2 RN engineers, 1 designer, 1 PM
- Capacity baseline: 45 SP target, 15% buffer, 38 SP committed

## Sprint 2: University discovery and detail
### Goal
Deliver end-to-end university search, filter, and detail flow.

### Committed scope
- University list with search, filter chips, featured carousel, paginated cards
- Region and major filter sheets with apply/reset session persistence
- University detail with hero, stats, programs, scholarships, and location
- Home and University routes wired to detail path
- Loading, empty, and error states for university journey

### Exit criteria
- Search/filter/detail works from both Home and University tab
- Filter behavior is deterministic for apply/reset/back navigation
- Core university journey is smoke-testable on iOS/Android

## Sprint 3: Community and Profile completion
### Goal
Ship engagement and account-center flows for MVP completion.

### Committed scope
- Community feed with category chips and card variants
- Post detail with comment thread and comment submit
- Create-post entry with draft-safe input
- Profile hub sections and subpages (edit/notifications/help/about)

### Exit criteria
- Community flow works feed -> detail -> comment submit
- Profile flow works hub -> subpages -> back navigation
- MVP routes are complete and demoable

## Sprint 4: Reliability and analytics hardening
### Goal
Stabilize operations and measurement before growth iteration.

### Committed scope
- Typed analytics model and instrumentation for key funnel events
- Observability baseline: error boundary, structured logging, error counter alerts
- Performance pass: list virtualization and optimized image rendering
- QA artifacts and regression checklist coverage

### Exit criteria
- Core funnel events are emitted and inspectable
- Crash/error paths are captured with retry handling
- Critical-path regression checklist is runnable

## Sprint 5: Post-hardening growth iteration
### Goal
Improve conversion/engagement via controlled, measurable UX improvements.

### Committed scope
- Feature-flag framework and experiment hooks
- Community engagement prompts and saved-post behaviors
- University shortlist and comparison-support entry points
- KPI visibility artifact in app session (About analytics summary)

### Exit criteria
- Growth surfaces are shipped behind flags
- Session-level KPI signals are visible for analysis
- Sprint 6+ backlog can be prioritized from instrumentation and feedback

## Contract references
- API contracts: `docs/api-contracts.md`
- Scenario matrix: `docs/testing/scenarios.md`
- Regression checklist: `docs/testing/regression-checklist.md`
- Implementation mapping: `docs/planning/sprint-2-5-execution.md`
