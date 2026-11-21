# ScopeSnap

**An AI-assisted client project scoping and proposal generation tool.**

ScopeSnap helps freelancers and small agencies turn client briefs into structured project scopes, estimates, and professional proposals.

Instead of manually organizing every client request, users can use AI-assisted brief analysis to identify project requirements, organize deliverables, review potential risks, prepare quotations, and generate proposals.

## Live Demo

**Live Application:** https://scopesnap.klyscape.com/

**GitHub Repository:** https://github.com/Joseph-Gana/scopesnap

Explore the live application and experience AI-assisted brief analysis, project scoping, quotation generation, and proposal creation.

## Features

- **AI-Powered Brief Analysis** – Analyze client briefs and extract important project requirements.
- **Project Scoping** – Organize project deliverables, tasks, and scope details.
- **Quotation Generation** – Prepare project estimates with support for multiple currencies.
- **Milestone Planning** – Organize project payments and milestones.
- **Proposal Generation** – Turn project details and quotations into structured client proposals.
- **Project Management** – Keep project information organized in a central workspace.
- **Print-Ready Documents** – Prepare project documents for printing or sharing.
- **Sample Project Data** – Explore the application with example project information.

## Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

**Backend and AI**
- Supabase
- Supabase Edge Functions
- Google Gemini API

**Deployment**
- Netlify
- GitHub

## Supported Currencies

ScopeSnap supports:
- USD – US Dollar
- GBP – British Pound
- EUR – Euro
- NGN – Nigerian Naira

## Getting Started

Follow these steps to run ScopeSnap locally.

### Prerequisites

- Node.js and npm
- Git
- A Supabase account
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Joseph-Gana/scopesnap.git
```

### 2. Navigate to the project directory

```bash
cd scopesnap
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with your Supabase project credentials.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Supabase Configuration

ScopeSnap uses Supabase to connect the frontend to its AI analysis service.

The AI functionality is handled through a Supabase Edge Function:

`supabase/functions/gemini-proxy`

Configure the `GEMINI_API_KEY` secret in your Supabase project. The Gemini API key should remain server-side and must never be exposed in frontend code or committed to GitHub.

Ensure the Edge Function is deployed and configured before using AI-powered brief analysis.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |

## Deployment

ScopeSnap is configured for deployment on Netlify.

Recommended build settings:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Add the following environment variables to your Netlify project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Gemini API key should remain configured as a Supabase secret, not as a publicly exposed frontend variable.

## Project Structure

```text
scopesnap/
├── src/
│   ├── components/       # Application pages and UI components
│   ├── hooks/            # Application state and controller hooks
│   ├── lib/              # Supabase, analysis, currency and data utilities
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── supabase/
│   ├── config.toml
│   └── functions/
│       └── gemini-proxy/ # AI analysis Edge Function
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Security Notes

- Environment files are excluded from version control.
- Never commit API keys, passwords, or private credentials.
- Keep the Gemini API key in Supabase Edge Function secrets.
- Use the public Supabase client key only for its intended frontend use.

## License

No open-source license has been specified for this project. All rights are reserved by the project owner unless a license is added.

---

**Developed as a portfolio project by [Joseph Gana](https://github.com/Joseph-Gana).**
