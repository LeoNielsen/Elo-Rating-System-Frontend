interface Match {
    id: number;
    date: Date;
    redAtk: string;
    redDef: string;
    blueAtk: string;
    blueDef: string;
    redScore: number;
    blueScore: number;
}

interface SoloMatch {
    id: number;
    date: Date;
    redPlayer: string;
    bluePlayer: string;
    redScore: number;
    blueScore: number;
}

interface Player {
    id: number;
    nameTag: string;
    rating: number;
    soloRating: number;
}

interface Team {
    id: number,
    attacker: string,
    defender: string,
    won: number,
    lost: number
}

interface MatchRating {
    matchId: number,
    player: Player,
    oldRating: number,
    newRating: number
}

interface chartData {
    playerTag: string,
    rating: number,
    date: string
}

interface PlayerStatistics {
    id: number
    nameTag: string,
    rating: number,
    attackerWins: number,
    defenderWins: number,
    attackerLost: number,
    defenderLost: number,
    totalGoals: number,
    todayRatingChance: number,
    highestELO: number,
    lowestELO: number,
    longestWinStreak: number,
    currentWinStreak: number,
    shutouts: number,
}

interface PlayerSoloStatistics {
    id: number
    nameTag: string,
    rating: number,
    wins: number,
    lost: number,
    totalGoals: number,
    todayRatingChance: number,
    highestELO: number,
    lowestELO: number,
    longestWinStreak: number,
    currentWinStreak: number,
    shutouts: number
}

interface achievement {
    id: number,
    code: string,
    name: string,
    description: string,
    gameType: string,
    type: string,
    metric: string,
    amount: number,
}

interface playerAchievement {
    id: number,
    player: Player,
    achievement: achievement,
    unlocked: boolean,
}

export type {
    Match,
    SoloMatch,
    Player,
    Team,
    MatchRating,
    PlayerStatistics,
    PlayerSoloStatistics,
    chartData,
    achievement,
    playerAchievement,
}