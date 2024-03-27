import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const getAllPlayers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/player/all`);
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

export {
    getAllPlayers,
    getAllTeams,
    getAllMatches,
    createTeam,
    createMatch,
    createPlayer
};
