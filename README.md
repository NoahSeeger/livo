# Livo - Your Personal Life Goals & Travel Tracker

Livo is a minimalist and inspiring web app designed to help users define, organize, and track their personal life goals and travel experiences. It combines goal-setting functionality with an interactive world map to visualize your global footp!
rint.

![livoapp](https://github.com/user-attachments/assets/481d96b0-dc3b-4df2-8b26-20ef69eb9239)

## Features

- 🎯 Goal Setting & Tracking
- 🌍 Interactive World Map
- 📱 Progressive Web App (PWA)
- 🔐 User Authentication
- 📊 Progress Visualization
- 🏷️ Goal Categorization
- 🔔 Optional Reminders

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Backend & Authentication)
- Netlify (Hosting)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/              # App router pages and layouts
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
└── styles/          # Global styles and Tailwind config
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
