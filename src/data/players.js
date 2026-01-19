// Player positions for the nutrition game football field
// Offense: 49ers (user's team) - 7 players
// Defense: Seahawks (opponent) - 7 players

export const OFFENSE_PLAYERS = [
  {
    id: 'qb',
    name: 'Melvin Lum',
    number: 1,
    position: 'QB',
    role: 'quarterback',
    // Position relative to line of scrimmage (x: yards behind, y: field width position 0-100)
    relativePos: { x: -7, y: 50 }
  },
  {
    id: 'center',
    name: 'Center',
    number: 55,
    position: 'C',
    role: 'lineman',
    relativePos: { x: 0, y: 50 }
  },
  {
    id: 'lg',
    name: 'Left Guard',
    number: 62,
    position: 'LG',
    role: 'lineman',
    relativePos: { x: 0, y: 40 }
  },
  {
    id: 'rg',
    name: 'Right Guard',
    number: 64,
    position: 'RG',
    role: 'lineman',
    relativePos: { x: 0, y: 60 }
  },
  {
    id: 'wr1',
    name: 'Wide Receiver',
    number: 11,
    position: 'WR',
    role: 'receiver',
    relativePos: { x: 0, y: 15 }
  },
  {
    id: 'wr2',
    name: 'Wide Receiver',
    number: 85,
    position: 'WR',
    role: 'receiver',
    relativePos: { x: 0, y: 85 }
  },
  {
    id: 'rb',
    name: 'Running Back',
    number: 28,
    position: 'RB',
    role: 'runner',
    relativePos: { x: -5, y: 45 }
  }
]

export const DEFENSE_PLAYERS = [
  {
    id: 'de1',
    name: 'Defensive End',
    number: 91,
    position: 'DE',
    role: 'lineman',
    relativePos: { x: 2, y: 35 }
  },
  {
    id: 'dt',
    name: 'Defensive Tackle',
    number: 99,
    position: 'DT',
    role: 'lineman',
    relativePos: { x: 2, y: 50 }
  },
  {
    id: 'de2',
    name: 'Defensive End',
    number: 93,
    position: 'DE',
    role: 'lineman',
    relativePos: { x: 2, y: 65 }
  },
  {
    id: 'lb1',
    name: 'Linebacker',
    number: 54,
    position: 'LB',
    role: 'linebacker',
    relativePos: { x: 5, y: 40 }
  },
  {
    id: 'lb2',
    name: 'Linebacker',
    number: 56,
    position: 'LB',
    role: 'linebacker',
    relativePos: { x: 5, y: 60 }
  },
  {
    id: 'cb1',
    name: 'Cornerback',
    number: 21,
    position: 'CB',
    role: 'defensive-back',
    relativePos: { x: 3, y: 15 }
  },
  {
    id: 'cb2',
    name: 'Cornerback',
    number: 26,
    position: 'CB',
    role: 'defensive-back',
    relativePos: { x: 3, y: 85 }
  }
]

// Team colors
export const TEAM_COLORS = {
  niners: {
    primary: '#AA0000',
    secondary: '#FFD700',
    jersey: '#AA0000',
    pants: '#FFD700',
    text: '#FFD700'
  },
  seahawks: {
    primary: '#002244',
    secondary: '#69BE28',
    jersey: '#002244',
    pants: '#69BE28',
    text: '#69BE28'
  }
}
