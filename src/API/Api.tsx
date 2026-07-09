import axios from 'axios';
import UserService from '../Keycloak/UserService';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAllPlayers = async () => {

        const response = await axios.get(`${BASE_URL}/player/all`);
        return response.data;
};

const getPlayer = async (name: string) => {

        const response = await axios.get(`${BASE_URL}/player/${name}`);
        return response.data;

};

const deactivatePlayer = async (name: string) => {
    const token = await UserService.getFreshToken();

        const response = await axios.put(`${BASE_URL}/admin/player/activation/${name}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

};

const getMonthlyWinner = async () => {

        const response = await axios.get(`${BASE_URL}/monthly/winner/last`);
        return response.data;

};

const getMonthlyWinners = async () => {

        const response = await axios.get(`${BASE_URL}/monthly/winner/all`);
        return response.data;

};

const getMatchDays = async () => {

        const response = await axios.get(`${BASE_URL}/match/days`);
        return response.data;

};

const getSoloMatchDays = async () => {

        const response = await axios.get(`${BASE_URL}/match/solo/days`);
        return response.data;

};

const getRecords = async () => {

        const response = await axios.get(`${BASE_URL}/player/records`);
        return response.data;

};

const getMatchStatistics = async () => {

        const response = await axios.get(`${BASE_URL}/match/statistics`);
        return response.data;

};

const getSoloMatchStatistics = async () => {

        const response = await axios.get(`${BASE_URL}/match/solo/statistics`);
        return response.data;

};

const getPlayerStatistics = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/player/statistics/${id}`);
        return response.data;

};

const getAllPlayerStatistics = async () => {

        const response = await axios.get(`${BASE_URL}/player/statistics/all`);
        return response.data;

};
const getAllMonthlyStatistics = async () => {

        const response = await axios.get(`${BASE_URL}/player/statistics/monthly/all`);
        return response.data;

};

const getMonthlyStatistics = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/player/statistics/monthly/${id}`);
        return response.data;

};

const getPlayerSoloStatistics = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/player/statistics/solo/${id}`);
        return response.data;

};

const getAllPlayerSoloStatistics = async () => {

        const response = await axios.get(`${BASE_URL}/player/statistics/solo/all`);
        return response.data;

};

const getAllTeams = async () => {

        const response = await axios.get(`${BASE_URL}/team/all`);
        return response.data;

};

const getAllPairTeams = async () => {

        const response = await axios.get(`${BASE_URL}/team/pair/all`);
        return response.data;

};

const getAllTeamStatistics = async () => {

        const response = await axios.get(`${BASE_URL}/stat/team/all`);
        return response.data;

};

const getTeamStatisticsById = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/stat/team/${id}`);
        return response.data;

};

const getTeamPairById = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/team/pair/${id}`);
        return response.data;

};

const getRecentMatches = async () => {

        const response = await axios.get(`${BASE_URL}/match`);
        return response.data;

};
const getMatches = async () => {

        const response = await axios.get(`${BASE_URL}/match/all`);
        return response.data;

};
const getRecentSoloMatches = async () => {

        const response = await axios.get(`${BASE_URL}/match/solo`);
        return response.data;

};
const getMatchRatings = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/rating/match/${id}`);
        return response.data;

};
const getSoloMatchRatings = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/rating/solo/match/${id}`);
        return response.data;

};

const createMatch = async (matchData: {
    redAtkId: number,
    redDefId: number,
    blueAtkId: number,
    blueDefId: number,
    redScore: number,
    blueScore: number
}) => {
    const token = await UserService.getFreshToken();

        const response = await axios.post(
            `${BASE_URL}/match`,
            matchData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return response.data;

};

const createSoloMatch = async (matchData: {
    redPlayerId: number,
    bluePlayerId: number,
    redScore: number,
    blueScore: number
}) => {

        const token = await UserService.getFreshToken();
        const response = await axios.post(`${BASE_URL}/match/solo/new`, matchData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        return response.data;

};

const createPlayer = async (playerData: {
    nameTag: string
}) => {

        const response = await axios.post(`${BASE_URL}/player`, playerData);
        return response.data;

};

const getChartData = async () => {

        const response = await axios.get(`${BASE_URL}/rating/chart`);
        return response.data;

};

const getSoloChartData = async () => {

        const response = await axios.get(`${BASE_URL}/rating/solo/chart`);
        return response.data;

};
const getMonthlyChartData = async () => {

        const response = await axios.get(`${BASE_URL}/rating/monthly/chart`);
        return response.data;

};



const getAdminTest = async () => {
    const token = await UserService.getFreshToken();
        const response = await axios.get(`${BASE_URL}/admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
};

const updateMatchById = async (id: number, matchData: {
    redAtkId: number,
    redDefId: number,
    blueAtkId: number,
    blueDefId: number,
    redScore: number,
    blueScore: number
}) => {
    const token = await UserService.getFreshToken();


        const response = await axios.put(`${BASE_URL}/match/update/${id}`, matchData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

};

const deleteMatchById = async (id: number) => {
    const token = await UserService.getFreshToken();


        const response = await axios.delete(`${BASE_URL}/match/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

};

const updateSoloMatchById = async (id: number, matchData: {
    redId: number,
    blueId: number,
    redScore: number,
    blueScore: number
}) => {
    const token = await UserService.getFreshToken();


        const response = await axios.put(`${BASE_URL}/match/solo/update/${id}`, matchData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

};

const deleteSoloMatchById = async (id: number) => {
    const token = await UserService.getFreshToken();


        const response = await axios.delete(`${BASE_URL}/match/solo/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

};

const getAllAchievements = async () => {

        const response = await axios.get(`${BASE_URL}/achievement/all`);
        return response.data;

};

const getPlayerAchievements = async (id: number) => {

        const response = await axios.get(`${BASE_URL}/achievement/${id}`);
        return response.data;

};

const regeneratePlayerStats = async () => {
    const token = await UserService.getFreshToken();


        const response = await axios.post(`${BASE_URL}/admin/player/statgen`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

};

const regenerateTeamStats = async () => {
    const token = await UserService.getFreshToken();


        const response = await axios.post(`${BASE_URL}/admin/team/statgen`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

};

const regenerateSoloPlayerStats = async () => {
    const token = await UserService.getFreshToken();


        const response = await axios.post(`${BASE_URL}/admin/solo/player/statgen`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

};

const regenerateMonthlyPlayerStats = async () => {
    const token = await UserService.getFreshToken();


        const response = await axios.post(`${BASE_URL}/admin/monthly/player/statgen`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

};

export {
    getAllPlayers,
    getPlayer,
    deactivatePlayer,
    getMonthlyWinner,
    getMonthlyWinners,
    getMatchDays,
    getSoloMatchDays,
    getRecords,
    getMatchStatistics,
    getSoloMatchStatistics,
    getPlayerStatistics,
    getAllPlayerStatistics,
    getAllMonthlyStatistics,
    getMonthlyStatistics,
    getPlayerSoloStatistics,
    getAllPlayerSoloStatistics,
    getAllTeamStatistics,
    getTeamStatisticsById,
    getAllTeams,
    getAllPairTeams,
    getTeamPairById,
    getRecentMatches,
    getMatches,
    getRecentSoloMatches,
    getMatchRatings,
    getSoloMatchRatings,
    createMatch,
    createSoloMatch,
    createPlayer,
    getChartData,
    getSoloChartData,
    getMonthlyChartData,
    getAdminTest,
    updateMatchById,
    updateSoloMatchById,
    deleteMatchById,
    deleteSoloMatchById,
    getAllAchievements,
    getPlayerAchievements,
    regenerateMonthlyPlayerStats,
    regeneratePlayerStats,
    regenerateTeamStats,
    regenerateSoloPlayerStats
};
