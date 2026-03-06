# Critical Path Regression Checklist

## University flow
- Open University tab and confirm first-page list renders.
- Search for a keyword and verify result set updates.
- Apply region filter and major filter; confirm deterministic results.
- Reset filters and verify full list returns.
- Open a university detail from both Home and University list.
- Validate loading, empty, and error states.

## Community flow
- Open Community tab and switch categories.
- Open post detail and verify comments render.
- Submit comment and verify comment count updates.
- Start typing comment, navigate back, return, and verify draft persists.
- Create a new post and verify redirect to created post detail.

## Profile flow
- Open Profile tab and verify stats and menu sections.
- Open Edit profile, change fields, save, and verify updates on return.
- Open Notifications, Help Center, and About pages and verify navigation/back stack.

## Analytics + observability
- Trigger tab changes and verify analytics buffer grows.
- Trigger university detail and post open to verify key events are emitted.
- Confirm profile edit save emits analytics event.
- Force a handled load error and verify retry state appears.
