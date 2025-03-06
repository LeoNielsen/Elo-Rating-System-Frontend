import { Card, Modal } from "antd";
import { useQuery } from "react-query";
import { getPlayerSoloStatistics, getPlayerStatistics } from "../API/Api";
import { PlayerSoloStatistics, PlayerStatistics } from "../Types/Types";

function PlayerCombinedStatisticsModal({ modalVisible, setModalVisible, playerId }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, playerId: number }) {

    const playerStats = useQuery<PlayerStatistics>("PlayersStats", () => getPlayerStatistics(playerId));
    const soloStats = useQuery<PlayerSoloStatistics>("PlayersSoloStats", () => getPlayerSoloStatistics(playerId));

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    if (playerStats.isLoading || soloStats.isLoading) {
        return <></>
    }

    const content = (player: PlayerStatistics, solo: PlayerSoloStatistics) => {

        const wins2v2 = player.attackerWins + player.defenderWins
        const lost2v2 = player.attackerLost + player.defenderLost
        const totalWins = wins2v2 + solo.wins
        const totalLost = lost2v2 + solo.lost
        const totalGames = totalLost + totalWins
        const totalGoals = player.totalGoals + solo.totalGoals

        return (
            <Card title="Player Stats" style={{ width: 400, margin: '10px' }}>
                <p><strong>Name Tag:</strong> {player.nameTag}</p>
                <p><strong>Rating:</strong> {player.rating}</p>
                <p><strong>Total Games:</strong> {totalGames}</p>
                <p><strong>Total Wins:</strong> {totalWins}</p>
                <div style={{ marginLeft: '20px' }}>
                    <p><strong>Wins 2v2:</strong> {wins2v2}</p>
                    <p><strong>Wins 1v1:</strong> {solo.wins}</p>
                </div>
                <p><strong>Total Lost:</strong> {totalLost}</p>
                <div style={{ marginLeft: '20px' }}>
                    <p><strong>Lost 2v2:</strong> {lost2v2}</p>
                    <p><strong>Lost 1v1:</strong> {solo.lost}</p>
                </div>
                <p><strong>Winning Percentage:</strong> {((totalWins / totalGames) * 100).toFixed(0)}%</p>
                <p><strong>Total Goals:</strong> {totalGoals}</p>
                <div style={{ marginLeft: '20px' }}>
                    <p><strong>Goals 2v2:</strong> {player.totalGoals}</p>
                    <p><strong>Goals 1v1:</strong> {solo.totalGoals}</p>
                </div>
                <p><strong>Goals Per Game:</strong> {(totalGoals / totalGames).toFixed(2)}</p>
            </Card>
        )
    }

    return playerStats.data && soloStats.data ? (<Modal
        title="Player Statistics"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        {content(playerStats.data, soloStats.data)}
    </Modal>) : (<></>);

}

export default PlayerCombinedStatisticsModal;