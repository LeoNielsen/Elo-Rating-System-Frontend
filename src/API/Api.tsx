import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getAllPlayers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/player/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getPlayerStatistics = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/player/statistics/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllPlayerStatistics = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/player/statistics/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const getPlayerSoloStatistics = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/player/statistics/solo/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllPlayerSoloStatistics = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/player/statistics/solo/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllTeams = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/team/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/match/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const getAllSoloMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/match/solo/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const getMatchRatings = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/rating/match/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const getSoloMatchRatings = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/rating/solo/match/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllRatings = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/rating/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const getAllSoloRatings = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/rating/solo/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createTeam = async (teamData: {
    attackerId: number,
    defenderId: number
}) => {
    try {
        const response = await axios.post(`${BASE_URL}/team`, teamData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createMatch = async (matchData: {
    redTeamId: number,
    blueTeamId: number,
    redTeamScore: number,
    blueTeamScore: number
}) => {
    try {
        const response = await axios.post(`${BASE_URL}/match`, matchData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createSoloMatch = async (matchData: {
    redPlayerId: number,
    bluePlayerId: number,
    redScore: number,
    blueScore: number
}) => {
    try {
        const response = await axios.post(`${BASE_URL}/match/solo/new`, matchData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createPlayer = async (playerData: {
    nameTag: string
}) => {
    try {
        const response = await axios.post(`${BASE_URL}/player`, playerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getChartData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/rating/chart`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getSoloChartData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/rating/solo/chart`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getAllPlayers,
    getPlayerStatistics,
    getAllPlayerStatistics,
    getPlayerSoloStatistics,
    getAllPlayerSoloStatistics,
    getAllTeams,
    getAllMatches,
    getAllSoloMatches,
    getMatchRatings,
    getSoloMatchRatings,
    getAllRatings,
    getAllSoloRatings,
    createTeam,
    createMatch,
    createSoloMatch,
    createPlayer,
    getChartData,
    getSoloChartData
};
