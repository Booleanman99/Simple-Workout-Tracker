# YEA BUDDY - Gym & Nutrition Tracker 💪

A clean, Squarespace-inspired PWA for tracking your gym workouts and nutrition. Works great on iPhone when added to home screen!

## Features

- **Workout Logging** - Track exercises with sets, reps, and weight (lbs/kg)
- **Nutrition Tracking** - Log foods with calories and macros (protein, carbs, fats)
- **Calendar View** - See your workout history with muscle group indicators
- **Export/Import** - Backup your data to JSON file
- **PWA Ready** - Add to iPhone home screen for app-like experience

## Muscle Group Abbreviations

| Abbrev | Muscle Group |
|--------|-------------|
| Ba | Back |
| Bi | Bicep |
| C | Chest |
| L | Legs |
| S | Shoulder |
| T | Tricep |

## Deploy to Vercel

### Option 1: Via GitHub (Recommended)

1. Create a new repository on GitHub
2. Push this code to your repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/yea-buddy-app.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
4. Click "Add New Project"
5. Import your `yea-buddy-app` repository
6. Click "Deploy" - Vercel auto-detects Vite config!
7. Your app will be live at `https://your-project.vercel.app`

### Option 2: Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Add to iPhone Home Screen

1. Open your deployed URL in Safari on iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "YEA BUDDY" and tap Add

The app will launch in full-screen mode like a native app!

## Data Storage

Your data is stored in the browser's localStorage. To keep your data safe:
- Use the **Export Backup** feature in Settings regularly
- Save the JSON file to iCloud Drive or your preferred storage
- You can restore data anytime using **Import Backup**

---

*LIGHTWEIGHT BABY!* 🏋️
