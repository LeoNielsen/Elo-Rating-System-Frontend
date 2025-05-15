import { Descriptions, Modal, Typography } from "antd";
import { useQuery } from "react-query";
import { getMonthlyStatistics, getPlayerSoloStatistics, getPlayerStatistics } from "../API/Api";
import { PlayerSoloStatistics, PlayerStatistics } from "../Types/Types";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

function PlayerStatisticsModal({ modalVisible, setModalVisible, playerId, solo, monthly }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, playerId: number, solo: boolean, monthly: boolean }) {

    const fetchPlayerStatistics = monthly? getMonthlyStatistics : solo ? getPlayerSoloStatistics : getPlayerStatistics;

    const { data, isLoading } = useQuery<PlayerStatistics | PlayerSoloStatistics >(
        "PlayerStatistics",
        () => fetchPlayerStatistics(playerId)
    );


    const handleModalCancel = () => {
        setModalVisible(false);
    };

    if (isLoading) {
        return <></>
    }

    const { Text } = Typography
    const soloContent = (player: PlayerSoloStatistics) => {

        const totalGames = player.wins + player.lost


        return (<Descriptions
            column={1}
            size="small"
            bordered
            labelStyle={{ fontWeight: 'bold', width: 180 }}
        >
            <Descriptions.Item label="Name Tag">{player.nameTag}</Descriptions.Item>

            <Descriptions.Item label="Rating">
                {player.rating}{' '}
                {player.todayRatingChance !== 0 && (
                    <Text type={player.todayRatingChance > 0 ? 'success' : 'danger'}>
                        {player.todayRatingChance > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                        {Math.abs(player.todayRatingChance)}
                    </Text>
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Higest Rating">{player.highestELO}</Descriptions.Item>
            <Descriptions.Item label="Lowest Rating">{player.lowestELO}</Descriptions.Item>
            <Descriptions.Item label="Games">{totalGames}</Descriptions.Item>
            <Descriptions.Item label="Wins">{player.wins}</Descriptions.Item>
            <Descriptions.Item label="Lost">{player.lost}</Descriptions.Item>
            <Descriptions.Item label="Longest Win Streak">{player.longestWinStreak}</Descriptions.Item>
            <Descriptions.Item label="Current Win Streak">{player.currentWinStreak}</Descriptions.Item>
            <Descriptions.Item label="Winning Percentage">
                {totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(0) : '0'}%
            </Descriptions.Item>
            <Descriptions.Item label="Goals">{player.totalGoals}</Descriptions.Item>
            <Descriptions.Item label="Goals Per Game">
                {totalGames > 0 ? (player.totalGoals / totalGames).toFixed(2) : '0.00'}
            </Descriptions.Item>
        </Descriptions>
        )
    }

    const content = (player: PlayerStatistics) => {

        const totalWins = player.attackerWins + player.defenderWins
        const totalLost = player.attackerLost + player.defenderLost
        const totalGames = totalLost + totalWins

        return (
            <Descriptions
                column={1}
                size="small"
                bordered
                labelStyle={{ fontWeight: 'bold', width: 180 }}
            >
                <Descriptions.Item label="Name Tag">{player.nameTag}</Descriptions.Item>

                <Descriptions.Item label="Rating">
                    {player.rating}{' '}
                    {player.todayRatingChance !== 0 && (
                        <Text type={player.todayRatingChance > 0 ? 'success' : 'danger'}>
                            {player.todayRatingChance > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                            {Math.abs(player.todayRatingChance)}
                        </Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Higest Rating">{player.highestELO}</Descriptions.Item>
                <Descriptions.Item label="Lowest Rating">{player.lowestELO}</Descriptions.Item>
                <Descriptions.Item label="Games">{totalGames}</Descriptions.Item>

                <Descriptions.Item label="Wins">
                    <div> {totalWins}</div>
                    <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                        Attacker: {player.attackerWins} | Defender: {player.defenderWins}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Lost">
                    <div>{totalLost}</div>
                    <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                        Attacker: {player.attackerLost} | Defender: {player.defenderLost}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Longest Win Streak">{player.longestWinStreak}</Descriptions.Item>
                <Descriptions.Item label="Current Win Streak">{player.currentWinStreak}</Descriptions.Item>
                <Descriptions.Item label="Winning Percentage">
                    {totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(0) : '0'}%
                </Descriptions.Item>

                <Descriptions.Item label="Goals">{player.totalGoals}</Descriptions.Item>

                <Descriptions.Item label="Goals Per Game">
                    {totalGames > 0 ? (player.totalGoals / totalGames).toFixed(2) : '0.00'}
                </Descriptions.Item>
            </Descriptions>
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