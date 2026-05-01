# README

### Simple chatbot, using Claude's API. React frontend and Ruby on Rails backend.

## Prerequisites

- Ruby 3.2.2 (via rbenv or similar)
- Node.js & npm
- PostgreSQL

## Setup

Clone the repository:

```bash
git clone <repo-url>
cd chatbot_ai
```

### API (Rails)

```bash
cd api
bundle install
cp .env.example .env  # then add your Anthropic API key
rails db:create db:migrate
rails server
```

### Web (React)

In a separate terminal:

```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Environment Variables

Create `api/.env` with the following:

```
ANTHROPIC_API_KEY=your-api-key-here
SSL_CERT_FILE=/etc/ssl/cert.pem
```

Get an API key at [console.anthropic.com](https://console.anthropic.com).
