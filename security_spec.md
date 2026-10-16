# Security Specification - Marvel Universe

## 1. Data Invariants

- **User Profiles (`/users/{userId}`)**:
  - Only the authenticated owner (`request.auth.uid == userId`) can read or write their own profile document.
  - No user can set arbitrary administrative privileges or modify another user's profile.
  - The `email` and `uid` fields must match the authenticated user's credentials.
  - `displayName` must be a valid string of reasonable length (3 to 100 characters).
  - No passwords or sensitive hashes are ever written to Firestore.

- **Favorites (`/users/{userId}/favorites/{characterId}`)**:
  - Only the authenticated owner (`request.auth.uid == userId`) can create, list, view, or delete their favorites.
  - An attacker cannot inject favorites into another user's subcollection or query someone else's favorites.
  - Character IDs must be valid numeric or slug string identifiers with maximum length limits.
  - Total isolation: no public reads or shared writes exist on the favorites subcollection.

## 2. The "Dirty Dozen" Threat Payloads

1. **Ghost Field Injection**: Attempt to write `{ "isAdmin": true, "role": "superadmin" }` to `/users/{userId}`. (Blocked by `isValidUserProfile`).
2. **UID Spoofing**: User with UID `victim123` attempts to write profile with `uid: "attacker456"`. (Blocked by `incoming().uid == request.auth.uid`).
3. **Cross-User Snooping**: Unauthenticated or user `userB` attempting to read `/users/userA`. (Blocked by `isOwner(userId)`).
4. **Cross-User Favorite Scraping**: User `userB` performing `list` on `/users/userA/favorites`. (Blocked by path-level owner gate).
5. **Favorite Hijacking**: User `userB` attempting to write a document to `/users/userA/favorites/1`. (Blocked by `request.auth.uid == userId`).
6. **Denial-of-Wallet Payload Overflow**: Writing a 2MB string as `name` or `image`. (Blocked by `size() <= max` string length guards).
7. **Path Variable Traversal / Poisoning**: Attempting to write to `/users/{invalid_id_characters}/favorites/1`. (Blocked by `isValidId(userId)`).
8. **Negative / Non-integer characterId Injection**: Setting `characterId: "drop table"` or negative id. (Blocked by schema validation).
9. **Unauthenticated Read of Collections**: Anonymous user reading `/users` or `/users/{userId}`. (Blocked by default deny and auth check).
10. **Timestamp Manipulation Attack**: Submitting arbitrary past/future dates as created timestamps.
11. **Malicious Code / Script Injection in Names**: Input strings with `<script>` tags are validated and safely handled without executing in DOM.
12. **Subcollection Orphan Writes**: Creating favorite documents without valid parent user identity matching current auth.

## 3. Security Rules Architecture

Rules implement:
- Default deny: `match /{document=**} { allow read, write: if false; }`
- Context-aware validation helpers (`isValidUserProfile`, `isValidFavorite`, `isValidId`, `isOwner`, `isSignedIn`)
- Zero blanket reads; list queries strictly enforced at the owner level.
