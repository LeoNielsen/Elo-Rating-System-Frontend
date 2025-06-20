import { useQuery } from "react-query";
import { getAllPlayerSoloStatistics } from "../../API/Api";
import { PlayerSoloStatistics } from "../../Types/Types";
import { useState } from "react";
import Table, { ColumnType } from "antd/es/table";
import PlayerStatisticsModal from "../../modals/PlayerStatisticsModal";
import { Grid, Typography } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

function PlayerSoloRakingTable() {

    const { isLoading, data } = useQuery<PlayerSoloStatistics[]>("allSoloPlayerStatistics", getAllPlayerSoloStatistics);

    const [modalStatisticsVisible, setModalStatisticsVisible] = useState(false);
    const [rowId, setRowId] = useState(NaN);

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isSmallScreen = !screens.md;

    const handleRowClick = (record: PlayerSoloStatistics) => {
        setModalStatisticsVisible(true);
        setRowId(record.id)
    };

    const columns: ColumnType<PlayerSoloStatistics>[] = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            fixed: 'left',
            width: 65,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'nameTag',
            key: 'name',
        },
        {
            title: (
                <div style={{ whiteSpace: 'nowrap' }}>
                    Rating
                </div>
            ),
            dataIndex: 'rating',
            key: 'rating',
            render: (_, player: PlayerSoloStatistics) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{player.rating}</span>

                    {player.todayRatingChance !== 0 && (
                        <Typography.Text type={player.todayRatingChance > 0 ? 'success' : 'danger'}>
                            {player.todayRatingChance > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                            {!isSmallScreen && ` ${Math.abs(player.todayRatingChance)}`}
                        </Typography.Text>
                    )}
                </div>
            )
        },
        {
            title: 'Total Wins',
            dataIndex: 'wins',
            key: 'totalWins',
            render: (_, player: PlayerSoloStatistics) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{player.wins}</span>

                    {player.currentWinStreak >= 3 && (
                        <Typography.Text strong>
                            
                            {!isSmallScreen && ` ${Math.abs(player.currentWinStreak)}`}
                            {"🔥"}
                        </Typography.Text>
                    )}
                </div>
            )
        },
        {
            title: 'Total Lost',
            dataIndex: 'lost',
            key: 'totalLost',
        },
    ];

    const sortedData = data?.filter((player) => player.lost + player.wins > 0).slice().sort((a, b) => b.rating - a.rating);


    return (
        <>
            <Table dataSource={sortedData} columns={columns} scroll={{ x: 350 }} onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
            {modalStatisticsVisible && <PlayerStatisticsModal modalVisible={modalStatisticsVisible} setModalVisible={setModalStatisticsVisible} playerId={rowId} monthly={false} solo={true} />}
        </>
    )
}

export default PlayerSoloRakingTable