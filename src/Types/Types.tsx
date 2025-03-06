interface Match {
    id: number;
    date: Date;
    redTeam: Team;
    blueTeam: Team;
    redTeamScore: number;
    blueTeamScore: number;
}

interface SoloMatch {
    id: number;
    date: Date;
    redPlayer: Player;
    bluePlayer: Player;
    redTeamScore: number;
    blueTeamScore: number;
}

interface Player {
    id: number;
    nameTag: string;
    rating: number;
    soloRating: number;
}

interface Team {
    id: number,
    attacker: Player,
    defender: Player,
    won: number,
    lost: number
}

interface MatchRating {
    matchId: number,
    player: Player,
    oldRating: number,
    newRating: number
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
    todayRatingChance: number
}

interface PlayerSoloStatistics {
    id: number
    nameTag: string,
    rating: number,
    wins: number,
    lost: number,
    totalGoals: number,
    todayRatingChance: number
}

export type {
    Match,
    SoloMatch,
    Player,
    Team,
    MatchRating,
    PlayerStatistics,
    PlayerSoloStatistics
}