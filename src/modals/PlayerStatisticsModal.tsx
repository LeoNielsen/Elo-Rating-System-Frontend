import { Modal } from "antd";
import { useQuery } from "react-query";
import { getPlayerSoloStatistics, getPlayerStatistics } from "../API/Api";
import { PlayerSoloStatistics, PlayerStatistics } from "../Types/Types";

function PlayerStatisticsModal({ modalVisible, setModalVisible, playerId, solo }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, playerId: number, solo: boolean }) {

    const fetchPlayerStatistics = solo ? getPlayerSoloStatistics : getPlayerStatistics;

    const { data, isLoading } = useQuery<PlayerStatistics | PlayerSoloStatistics>(
        "PlayerStatistics",
        () => fetchPlayerStatistics(playerId)
    );


    const handleModalCancel = () => {
        setModalVisible(false);
    };

    if (isLoading) {
        return <></>
    }
    const soloContent = (player: PlayerSoloStatistics) => {

        const totalGames = player.wins + player.lost

        return (<>
            <p><strong>Name Tag:</strong> {player.nameTag}</p>
            <p><strong>Rating:</strong> {player.rating}</p>
            <p><strong>Total Games:</strong> {totalGames}</p>
            <p><strong>Total Wins:</strong> {player.wins}</p>
            <p><strong>Total Lost:</strong> {player.lost}</p>
            <p><strong>Winning Percentage:</strong> {((player.wins / totalGames) * 100).toFixed(0)}%</p>
            <p><strong>Total Goals:</strong> {player.totalGoals}</p>
            <p><strong>Goals Per Game:</strong> {(player.totalGoals / totalGames).toFixed(2)}</p>
        </>
        )
    }

    const content = (player: PlayerStatistics) => {

        const totalWins = player.attackerWins + player.defenderWins
        const totalLost = player.attackerLost + player.defenderLost
        const totalGames = totalLost + totalWins

        return (
            <>
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
            </>
        )
    }

    return data ? (<Modal
        title="Player Statistics"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        {solo ? soloContent(data as PlayerSoloStatistics) : content(data as PlayerStatistics)}
    </Modal>) : (<></>);

}

export default PlayerStatisticsModal;