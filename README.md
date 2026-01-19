# Go Melvin! - 49ers Nutrition Tracker 🏈

A 49ers-themed gamified nutrition tracker designed to make meeting daily intake goals fun and engaging. Track your fluids, calories, and baking soda swishes to drive down the field and score touchdowns!

## 🎮 Game Overview

Turn your daily nutrition goals into a football game! The day is split into four quarters, simulating a real game. As you log your intake, you gain yards, get first downs, and score touchdowns against the opponent (Seahawks).

### Key Features
- **49ers Theme**: Custom animations and visuals celebrating the San Francisco 49ers.
- **Real-time Game Clock**: The day is divided into 4 quarters (15-hour "game day" from 8 AM to 11 PM).
- **Progress Tracking**: 
  - 💧 Fluids (Goal: 1000ml)
  - 🍽️ Calories (Goal: 1500cal)
  - 🧂 Baking Soda (Goal: 2 swishes)
- **Game Mechanics**:
  - Gain yards based on your intake.
  - Earn pace bonuses for staying ahead of schedule.
  - Complete 4 downs to get a first down.
  - Score Touchdowns by reaching the end zone!
- **Data Persistence**: Uses Firebase for saving progress and history.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Styling**: CSS, Framer Motion (for animations)
- **Backend/Storage**: Firebase (Firestore, Auth)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/godwinlaw/cancer-football.git
   cd cancer-football
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Create a web app and get your configuration object.
   - Update `src/firebase.js` with your config keys (or use environment variables).

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📖 How to Play

1. **Start the Day**: The game clock starts at 8:00 AM.
2. **Log Intake**: Click the buttons on the tracker cards to log water, food, or treatments.
3. **Watch the Action**: 
   - Every log triggers a play on the field.
   - See your player run down the field.
   - Watch the down and distance update.
4. **Stay on Pace**: Check the status bar to see if you are "Ahead", "On Track", or "Behind". Being ahead gives you yardage bonuses!
5. **Score**: Reach the end zone to trigger a Touchdown celebration!

## 📄 License

This project is licensed under the MIT License.
