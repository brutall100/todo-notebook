**English** · [Lietuviškai](README.lt.md)

# Todo Notebook

A to-do list that feels like a paper notebook: write tasks on a sticky note, tick them off on a ruled page, and watch the progress bar fill up.

**[▶ Live demo](https://brutall100.github.io/todo-notebook/)** · **[Source code](https://github.com/brutall100/todo-notebook)**

![Todo Notebook in light mode](docs/screenshot.webp)

<p>
  <img src="docs/screenshot-dark.webp" alt="Todo Notebook in dark mode" width="620" />
  <img src="docs/screenshot-mobile.webp" alt="Todo Notebook on a 390px phone screen" width="180" />
</p>

## About

Todo Notebook is a full-stack task manager with a React front end and an Express + MongoDB API. People create an account, log in, and see **only their own** tasks.

The project works in two modes:

| Mode | Where | Data | Accounts |
|---|---|---|---|
| **Demo** | GitHub Pages (the live demo) | Saved in your browser (`localStorage`) | Made-up demo user “Alex Doe” |
| **Server** | Your computer, with the API running | Saved in MongoDB | Real register / log in with JWT |

GitHub Pages can only host static files, so the live demo runs without the server. Run the project locally to try the full version.

## Features

- Add, edit, tick off and delete tasks
- Four colour-coded categories: Work, Home, Study, Errands
- Filter by status (All / To do / Done) and by category
- Progress stats that count up, plus a striped progress bar
- Register and log in (bcrypt-hashed passwords, JWT sessions); each user sees only their own tasks
- **Live background**: sticky notes drift down and spin at random speeds on a dotted desk, with a slow lamp glow and ink glow behind them
- Paper-cut buttons that lift on hover, press down on click and leave an **ink blot ripple**; the pencil icon scribbles on hover
- Hand-drawn check marks and strike-through lines, and a highlighter swipe on the title
- Light and dark mode: follows the system setting, remembers your choice, and never flashes on load
- Accessible: “Skip to content” link, visible focus rings, labelled fields, a native `<dialog>`, and `prefers-reduced-motion` support (the notes stop falling and only the static glow stays)
- Works on a 390px phone with no sideways scrolling; phones get half as many falling notes

## Built with

| Part | Tools |
|---|---|
| Client | React 18, Vite 6, React Router 7 (hash routing for GitHub Pages), PropTypes |
| API | Node.js 20+, Express 4, Mongoose 8 |
| Database | MongoDB |
| Security | bcryptjs (password hashing), jsonwebtoken (JWT), Mongoose `sanitizeFilter` against NoSQL injection |
| Deploy | GitHub Actions → GitHub Pages |

### Colour palette

All colours live as CSS variables in [`client/src/styles/tokens.css`](client/src/styles/tokens.css). Change them there to re-skin the whole app.

| Role | Light | Dark |
|---|---|---|
| Background (desk) | `#F6F1E7` | `#1C1B24` |
| Surface (page, cards) | `#FFFDF8` | `#262532` |
| Sticky note | `#FFF3BF` | `#3A3425` |
| Text (ink) | `#2B2A33` | `#EDE7DA` |
| Accent (ink blue) | `#1F4FD1` | `#8FB0FF` |
| Highlight (sticky-note yellow) | `#FFD84D` | `#FFD84D` |
| Red pen (handwriting, errors) | `#B93A10` | `#FF9A76` |

Every text colour meets WCAG AA: at least 4.5:1 for normal text and 3:1 for UI parts.

### Fonts (Google Fonts)

- **Fraunces**: headings
- **Nunito**: body text
- **Caveat**: handwritten notes

## What I learned

- Splitting an app into a React client and a REST API, and connecting them with `fetch` and a bearer token
- Hashing passwords with bcrypt and protecting routes with JWT middleware
- Scoping every database query to the logged-in user so nobody can read or change someone else's tasks
- Designing one data layer with two back ends (browser demo and real API) so the same UI runs on GitHub Pages and locally
- Building a performant animated background that animates only `transform` and `opacity` and respects reduced motion
- Theming with CSS variables and preventing the dark-mode flash with a tiny script that runs before the page is drawn
- Checking colour contrast with numbers instead of guessing

## Run it locally

You need **Node.js 20+**, plus **MongoDB** (local or a free MongoDB Atlas cluster) for server mode.

### 1. Demo mode (no database needed)

```bash
cd client
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173). Tasks are saved in your browser.

### 2. Server mode (real accounts and database)

**API:**

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

In `server/.env`, fill in:

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: a long random string (the file shows a command that makes one)
- `PORT`, `DB_NAME` and `CLIENT_ORIGIN` can stay as they are

**Client** (in a second terminal):

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

`client/.env` holds `VITE_API_URL=http://localhost:3030`, which tells the client to use the API instead of demo mode. Remove that line (or the file) to go back to demo mode.

### API endpoints

| Method | Path | What it does |
|---|---|---|
| `POST` | `/api/auth/register` | Create an account → `{ token, user }` |
| `POST` | `/api/auth/login` | Log in with email + password → `{ token, user }` |
| `GET` | `/api/auth/me` | The logged-in user |
| `GET` | `/api/todos` | Your tasks |
| `POST` | `/api/todos` | Add a task |
| `PATCH` | `/api/todos/:id` | Edit a task or tick it off |
| `DELETE` | `/api/todos/:id` | Delete a task |

All `/api/todos` routes need an `Authorization: Bearer <token>` header.

## Project structure

```
todo-notebook/
├── client/                    React app (Vite)
│   ├── public/                favicon.svg, theme-init.js (sets the theme before first paint)
│   ├── src/
│   │   ├── api/               demo-api.js (browser), http-api.js (server), index.js picks one
│   │   ├── components/        header, task form, task item, live background, buttons…
│   │   ├── context/           auth-context.jsx
│   │   ├── hooks/             theme, count-up, reduced-motion
│   │   ├── pages/             home, about, 404
│   │   ├── styles/            tokens.css (palette), base, background, components, pages
│   │   └── config/            categories.js
│   └── .env.example
├── server/                    Express API
│   ├── src/
│   │   ├── models/            user.js, todo.js
│   │   ├── routes/            auth.js, todos.js
│   │   ├── middleware/        require-auth.js (JWT check)
│   │   ├── app.js, config.js, index.js
│   └── .env.example
├── docs/                      screenshots
├── .github/workflows/         deploy.yml (GitHub Pages)
└── LICENSE
```

## Credits

- Started from the official [Vite React template](https://github.com/vitejs/vite/tree/main/packages/create-vite) (MIT)
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Nunito](https://fonts.google.com/specimen/Nunito) and [Caveat](https://fonts.google.com/specimen/Caveat) from Google Fonts (SIL Open Font License)
- Icons are hand-made SVGs in `client/src/components/icons.jsx`
- “Alex Doe” is a made-up demo user

## License

[MIT](LICENSE) © 2026 brutall100
