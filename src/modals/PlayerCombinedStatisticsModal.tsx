import { Descriptions, Modal } from "antd";
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
            <Descriptions
                column={1}
                size="small"
                bordered
                labelStyle={{ fontWeight: 'bold', width: 180 }}
            >
                <Descriptions.Item label="Name Tag">{player.nameTag}</Descriptions.Item>

                <Descriptions.Item label="Rating">{player.rating}</Descriptions.Item>

                <Descriptions.Item label="Total Games">{totalGames}</Descriptions.Item>

                <Descriptions.Item label="Total Wins">
                    <div>{totalWins}</div>
                    <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                        2v2: {wins2v2} | 1v1: {solo.wins}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Total Lost">
                    <div>{totalLost}</div>
                    <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                        2v2: {lost2v2} | 1v1: {solo.lost}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Winning Percentage">
                    {((totalWins / totalGames) * 100).toFixed(0)}%
                </Descriptions.Item>

                <Descriptions.Item label="Total Goals">
                    <div>{totalGoals}</div>
                    <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                        2v2: {player.totalGoals} | 1v1: {solo.totalGoals}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Goals Per Game">
                    {(totalGoals / totalGames).toFixed(2)}
                </Descriptions.Item>
            </Descriptions>
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