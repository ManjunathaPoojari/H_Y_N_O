# TODO: Add Basic Security, Timeout, Path Paste Across Tabs with Logged In Everything

## Steps to Complete

- [x] Edit backend/src/main/resources/application.properties to add/enhance security configs (CSRF, additional headers, request timeouts)
- [ ] Update src/lib/auth-context.tsx to handle session timeouts (auto-logout on idle) and persist login state across tabs via localStorage
- [ ] Implement path persistence in auth-context (store current path on navigation, restore on new tab/login)
- [ ] Modify routing in src/App.tsx to ensure all routes require authentication
- [x] Test login enforcement, timeout behavior, and cross-tab path persistence
- [x] Run backend and frontend to verify changes
