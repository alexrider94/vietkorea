# VietKorea Product Plan (Figma-based)

## Source of truth
- Figma file: `VietKorea-Community` (`umW3IlAFaP3ZcSv8SCsWkY`)
- Frames used:
  - Home: `1:2`
  - University: `21:2`
  - Community: `21:356`
  - Profile: `21:1926`

## Product objective
Build a bilingual (Vietnamese + Korean) mobile app that helps Vietnamese users in Korea with:
1. University discovery and filtering
2. Community Q&A and peer support
3. Personal profile, activity, and app settings

## Target users
- Primary: Vietnamese students planning to study in Korea
- Secondary: Current students and alumni sharing practical guidance
- Tertiary: Community moderators and support/admin users

## MVP scope

### 1) Home
- Top header with app identity + utility actions (search/notifications)
- Hero search box
- Top universities carousel
- Quick action shortcuts
- Community post preview list
- Persistent bottom navigation

### 2) University
- Search input
- Filter chips and modal/bottom-sheet filters (region, major)
- Featured universities carousel
- University list cards
- University detail screen with:
  - Hero image and summary
  - Stats (ranking/location/type)
  - Program categories
  - Scholarship summary
  - Map/location block

### 3) Community
- Feed with category chips/tabs
- Post cards (with and without media)
- Post detail with comments thread
- Reactions, comments, share actions
- Composer entry (floating button + comment input)

### 4) Profile
- Profile header (avatar, verification badge, user meta)
- Activity counters (posts/comments/saved)
- Settings hub sections:
  - Account
  - Activity
  - App settings (language/dark mode/notifications)
  - Support (help center/about/logout)
- Subscreens:
  - Edit profile
  - Notifications list
  - Help center
  - About app

## Out of scope for MVP
- Realtime chat
- Payment and subscription flows
- Full admin moderation dashboard
- Advanced recommendation ranking/ML

## Functional requirements
- Authentication-aware profile state
- Bottom tab navigation for core routes: Home, Community, University, Profile
- Filter state persistence inside session
- Bilingual content rendering at UI level
- Pagination/infinite scroll for feed and lists
- Draft-safe input for comments/posts

## Non-functional requirements
- Mobile-first for iOS/Android via Expo Router
- Smooth scrolling in long feeds and lists
- Accessibility baseline (tap targets, contrast, dynamic type readiness)
- Crash-free session target >= 99.5%

## Success metrics (first 30 days post launch)
- Activation: >= 60% of new users visit at least 2 tabs in first session
- Discovery: >= 35% of active users open at least one university detail page/week
- Community: >= 20% of weekly active users post or comment
- Retention: D7 retention >= 22%

## Key risks and mitigations
- Risk: Content sparsity in early community phase
  - Mitigation: Seed starter posts, curated prompts, and moderator playbook
- Risk: Filter UX complexity
  - Mitigation: Keep chips shallow; use one-level bottom sheets for MVP
- Risk: Scope creep from many profile subpages
  - Mitigation: Deliver shell routes first, deepen highest-traffic pages later

## Delivery strategy
- Build vertical slices by tab
- Ship MVP in 3 sprints (2 weeks each)
- Prioritize end-to-end journeys over isolated components:
  - Home -> University detail
  - Community feed -> Post detail -> Comment
  - Profile -> Edit profile + Notifications
