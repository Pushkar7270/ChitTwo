# ChitTwo — Frontend

A React frontend for the [ChitTwo](https://github.com/Pushkar7270/ChitTwo) Spring Boot chat
backend, visually based on a dark, gradient-heavy chat UI reference. Built with Vite, plain
CSS (design tokens in `src/styles/tokens.css`), `@stomp/stompjs` + `sockjs-client` for the
live connection, and `lucide-react` for icons.

## Running it

1. Start the ChitTwo backend (see its own README — Java 21, `./mvnw test`/Spring Boot run,
   MySQL on `localhost:3306/chitTwo` by default).
2. `cp .env.example .env` and adjust the URLs if your backend isn't on `localhost:8080`.
3. `npm install`
4. `npm run dev`

## How this maps to the backend

ChitTwo's `GroupController` + `ChatController` only support: creating a room, fetching a
room by id, fetching a room's message history, and sending/receiving messages over STOMP.
There's no authentication, no user profiles, no file storage, and no way to list existing
rooms. The UI is built around what's actually there rather than pretending those features
exist:

- **No accounts** → a one-time "pick a display name" screen (`IdentityGate`) stores a name
  in `localStorage` and sends it as `MessageRequest.sender` on every message. Anyone can
  type any name; there's no real identity system to enforce it.
- **No "list all rooms" endpoint** → the sidebar is a locally-remembered list of rooms this
  browser created or joined by ID (`RoomsContext`, persisted to `localStorage`), not a
  server-fetched inbox. See "Suggested backend changes" below.
- **No profile photos** → every name/room gets a deterministic gradient + initials avatar
  (`utils/avatar.js`) instead of a broken `<img>`.
- **No "online" presence** → the header/profile panel show the actual STOMP connection
  state (Connected / Connecting / Disconnected), not a fabricated "Active now".
- **No file uploads** → `Message.content` is plain text. If a message is *just* a URL, it's
  rendered as an image preview or a file-link card (mimicking the reference design's
  attachment bubbles); the right-hand "Attachment" panel is built from those detected links
  across the room's history, not a real file store.

## Suggested backend changes

A few things worth fixing/adding on the Spring Boot side:

1. **Add `GET /api/v1/group`** to list all rooms. Right now there is no way for a client to
   discover existing rooms without already knowing a `roomId` — this frontend works around
   it with a client-side "recently used rooms" list, but a real inbox needs this endpoint.
2. **`GroupController.getMessage` returns unsorted history.** It calls
   `group.getMessage()` (the plain `@OneToMany` collection, no ordering), while
   `MessageRepository.findByRoomIdOrderByTimeSentAsc` already exists and isn't used. The
   frontend sorts by `timeSent` defensively, but the API itself should return it in order
   (either add `@OrderBy("timeSent ASC")` to `ChatGroup.message`, or call the repository
   method directly).
3. **`ChatController.sendMessage` trusts the client-supplied `roomId`.** It persists
   `messageRequest.getRoomId()` (from the request body) instead of the `@DestinationVariable
   roomId` (from the STOMP destination that the message is actually broadcast to). If those
   two ever disagree, the message is broadcast to one room but saved under another, so it
   silently disappears from that room's history on reload. This frontend always keeps the
   body's `roomId` in sync with the destination, but the server should validate/derive it
   from the path instead of trusting the body.
4. **`POST /api/v1/group` takes a raw JSON string**, not `{ "roomName": "..." }`. That's
   unusual for a REST API — most clients would send an object. Not a bug, just worth a
   comment in the controller (or a payload DTO) since it's easy to get wrong; this frontend
   handles it in `api/groups.js`.

## Project structure

```
chittwo-frontend/
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 entry point
    ├── App.jsx                  provider wiring (identity -> rooms -> socket -> shell)
    ├── styles/
    │   ├── tokens.css           design tokens (colors, gradients, type, radii)
    │   └── global.css           resets + base styles
    ├── api/
    │   ├── http.js              fetch wrapper (base URL, error handling)
    │   ├── groups.js            REST calls matching GroupController
    │   └── socket.js            STOMP/SockJS client + subscribe/publish helpers
    ├── context/
    │   ├── IdentityContext.jsx  local display-name "identity", persisted
    │   ├── RoomsContext.jsx     locally-known room list, persisted
    │   └── ChatSocketContext.jsx  one shared STOMP connection for the app
    ├── hooks/
    │   ├── useRoomMessages.js   REST history + live subscription for a room
    │   └── useAutoScroll.js     keeps the message list pinned to bottom
    ├── utils/
    │   ├── avatar.js            deterministic initials/gradient from a name
    │   ├── time.js              timestamp formatting
    │   └── linkDetect.js        detects image/file links for attachment bubbles
    └── components/
        ├── onboarding/IdentityGate.jsx      first-run name prompt
        ├── layout/AppShell.jsx              4-column layout, owns active room state
        ├── IconRail/IconRail.jsx            left nav rail + identity switcher
        ├── RoomList/
        │   ├── RoomList.jsx                 search + create/join menu
        │   ├── RoomListItem.jsx             one row (avatar, preview, unread badge)
        │   ├── NewRoomDialog.jsx            POST /api/v1/group
        │   └── JoinRoomDialog.jsx           GET /api/v1/group/{roomId}
        ├── ChatPanel/
        │   ├── ChatPanel.jsx                header + list + composer, or empty state
        │   ├── ChatHeader.jsx               room name, connection status, room-id copy
        │   ├── MessageList.jsx              scrollable history
        │   ├── MessageBubble.jsx            text / image / file-link bubble styles
        │   ├── MessageComposer.jsx          input bar
        │   └── EmptyChatState.jsx
        ├── ProfilePanel/ProfilePanel.jsx    room info + derived attachment grid
        └── common/
            ├── Avatar.jsx / Avatar.css
            ├── StatusDot.jsx / StatusDot.css
            └── Modal.jsx / Modal.css
```

## Known limitations (by design, given the backend)

- No message editing/deleting, typing indicators, or read receipts — the backend has no
  support for any of these.
- Rooms you "leave" from the sidebar are just forgotten locally (X button) — there's no
  delete-room endpoint, so the room still exists on the server and is rejoinable by ID.
- Sending a message while the socket is reconnecting is disabled (composer greys out) since
  `@stomp/stompjs` won't queue publishes for us here.
