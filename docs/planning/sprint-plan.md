# VietKorea Sprint Plan (3x2 weeks)

## Current baseline
- Current app is Expo starter template with 2 tabs:
  - `app/(tabs)/index.tsx`
  - `app/(tabs)/explore.tsx`
- Need to move from starter UI to production IA based on Figma nodes:
  - Home `1:2`
  - University `21:2`
  - Community `21:356`
  - Profile `21:1926`

## Team assumptions
- 2 React Native engineers + 1 designer + 1 PM
- Sprint cadence: 2 weeks
- Capacity target: ~40-50 story points per sprint (adjust after sprint 1)

## Sprint 1: App foundation + Home + Navigation
### Sprint goal
Replace starter scaffold with production app shell and deliver Home MVP.

### Scope
- Routing and information architecture
  - Create tab routes for `home`, `community`, `university`, `profile`
  - Replace starter `index/explore` flow
- Shared design system primitives
  - Theme tokens (colors, spacing, radius, typography)
  - Reusable UI blocks: card, chip, icon button, section header
- Home page MVP
  - Header, hero search, top universities carousel, quick links, community preview list
  - Bottom navigation aligned to Figma
- Static mock data layer for Home + University preview cards

### Exit criteria
- User can open app and navigate across 4 tabs
- Home visually matches Figma structure and hierarchy
- No starter-template content visible in core flow

## Sprint 2: University discovery and detail
### Sprint goal
Deliver searchable university browsing with filter and detail flow.

### Scope
- University list screen
  - Search input + chips
  - Featured carousel and list cards
- Filter bottom sheets
  - Region selector
  - Major selector
  - Apply/reset behavior
- University detail screen
  - Hero, stats, summary, programs, scholarships, location block
- Navigation links from Home and University list to detail

### Exit criteria
- User can search/filter universities and open detail
- Filter apply/reset works with predictable state
- University core journey is end-to-end testable

## Sprint 3: Community + Profile + hardening
### Sprint goal
Deliver engagement surfaces and account/settings center for MVP launch.

### Scope
- Community
  - Feed, category tabs, post card variants
  - Post detail, comments thread, comment input bar
  - Floating create-post entry
- Profile
  - Profile overview and stats
  - Menu sections (account/activity/settings/support)
  - Subpages: edit profile, notifications, help center, about
- App quality hardening
  - Loading/empty/error states
  - Basic analytics events (tab_open, university_detail_open, post_open, comment_submit)
  - Performance pass on long lists and media cards

### Exit criteria
- Community and Profile routes are production-ready for MVP
- Core analytics events emitted
- QA checklist passed for iOS and Android smoke tests

## Cross-sprint backlog (priority)
1. Navigation and route migration from starter template
2. Home page vertical slice
3. University filters + detail
4. Community feed + post detail + comments
5. Profile hub + edit/notifications/help/about
6. Analytics, QA, and launch checklist

## Dependencies
- Design: final token values and interaction notes for bottom sheets, tabs, and chips
- Product: language behavior decisions (mixed bilingual vs locale-based primary)
- Data/API: endpoint contracts for universities, posts, comments, and user profile

## Risks and controls
- Risk: Large UI surface in short timeline
  - Control: ship static data first, then wire API contracts incrementally
- Risk: Inconsistent visual system across tabs
  - Control: enforce shared primitives and single token source early (Sprint 1)
- Risk: Scroll performance on feed/detail screens
  - Control: use list virtualization and defer heavy media work until visible

## Definition of done (all sprints)
- Route accessible from intended navigation entry
- Empty/loading/error states implemented
- TypeScript and lint pass
- Visual check against Figma structure and spacing intent
- QA notes recorded for iOS + Android
