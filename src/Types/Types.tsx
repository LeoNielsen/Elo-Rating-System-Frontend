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

interface MonthlyWinner {
    nameTag: string;
    year: number,
    month: number,
    monthlyRating: number;
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

interface Record {
    nameTag: string,
    amount: number,
}

interface PlayerRecords {
    highestRating2v2: Record,
    lowestRating2v2: Record,
    highestRating1v1: Record,
    lowestRating1v1: Record,
    mostGames2v2: Record,
    mostGames1v1: Record,
    mostWins2v2: Record,
    mostAttackerWins: Record,
    mostDefenderWins: Record,
    mostWins1v1: Record,
    mostLost2v2: Record,
    mostAttackerLost: Record,
    mostDefenderLost: Record,
    mostLost1v1: Record,
    mostGoals2v2: Record,
    mostGoals1v1: Record,
    longestWinStreak2v2: Record,
    longestWinStreak1v1: Record,
    highestDailyEloChange2v2: Record,
    lowestDailyEloChange2v2: Record,
    highestDailyEloChange1v1: Record,
    lowestDailyEloChange1v1: Record,
}

interface MatchStatistics {
    games: number,
    redWins: number,
    blueWins: number,
    redGoals: number,
    blueGoals: number,
    goals: number
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
    MonthlyWinner,
    Team,
    MatchRating,
    PlayerStatistics,
    PlayerSoloStatistics,
    Record,
    MatchStatistics,
    PlayerRecords,
    chartData,
    achievement,
    playerAchievement,
}