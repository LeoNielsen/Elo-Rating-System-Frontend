interface Match {
    id: number;
    redTeam: Team;
    blueTeam: Team;
    redTeamScore: number;
    blueTeamScore: number;
}

interface Player {
    id: number;
    nameTag: string;
    rating: number;
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
    nameTag: string,
    rating: number,
    totalWins: number,
    totalLost: number,
    totalGoals: number
}

export type {
    Match,
    Player,
    Team,
    MatchRating,
    PlayerStatistics
}