import { Card, Modal } from "antd";
import { useQuery } from "react-query";
import { getPlayerStatistics } from "../API/Api";
import { PlayerStatistics } from "../Types/Types";
import '../Style.css'

function PlayerStatisticsModal({ modalVisible, setModalVisible, playerId }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, playerId: number }) {

    const { data, isLoading } = useQuery<PlayerStatistics>("PlayerStatistics", () => getPlayerStatistics(playerId));

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    if (isLoading) {
        return <></>
    }

    const Content = (player: PlayerStatistics) => {

        const totalWins = player.attackerWins + player.defenderWins
        const totalLost = player.attackerLost + player.defenderLost
        const totalGames = totalLost + totalWins

        return (
            <Card title="Player Stats" style={{ width: 400, margin: '10px' }}>
                <p><strong>Name Tag:</strong> {player.nameTag}</p>
                <p><strong>Rating:</strong> {player.rating}</p>
                <p><strong>Total Games:</strong> {totalGames}</p>
                <p><strong>Total Wins:</strong> {totalWins}</p>
                <div style={{ marginLeft: '20px' }}>
                    <p><strong>Attacker Wins:</strong> {player.attackerWins}</p>
                    <p><strong>Defender Wins:</strong> {player.defenderWins}</p>
                </div>
                <p><strong>Total Lost:</strong> {totalLost}</p>
                <div style={{ marginLeft: '20px' }}>
                    <p><strong>Attacker Lost:</strong> {player.attackerLost}</p>
                    <p><strong>Defender Lost:</strong> {player.defenderLost}</p>
                </div>
                <p><strong>Winning Percentage:</strong> {((totalWins / totalGames) * 100).toFixed(0)}%</p>
                <p><strong>Total Goals:</strong> {player.totalGoals}</p>
                <p><strong>Goals Per Game:</strong> {(player.totalGoals / totalGames).toFixed(2)}</p>
            </Card>
        )
    }

    return data ? (<Modal
        title="Player Statistics"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        {Content(data)}
    </Modal>) : (<></>);

}

export default PlayerStatisticsModal;