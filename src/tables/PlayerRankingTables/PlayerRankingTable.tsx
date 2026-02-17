import { useQuery } from "react-query";
import { MonthlyWinner, PlayerStatistics } from "../../Types/Types";
import { getAllPlayerStatistics, getMonthlyWinner } from "../../API/Api";
import { useState } from "react";
import Table, { ColumnType } from "antd/es/table";
import PlayerStatisticsModal from "../../modals/PlayerStatisticsModal";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Grid, Tooltip, Typography } from "antd";


function PlayerRankingTable() {

    const { isLoading, data } = useQuery<PlayerStatistics[]>("allPlayerStatistics", getAllPlayerStatistics);
    const monthlyWinner = useQuery<MonthlyWinner>("monthlyWinner", getMonthlyWinner);

    const [modalStatisticsVisible, setModalStatisticsVisible] = useState(false);
    const [rowId, setRowId] = useState(NaN);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isSmallScreen = !screens.md;

    const handleRowClick = (record: PlayerStatistics) => {
        setModalStatisticsVisible(true);
        setRowId(record.id)
    };

    const columns: ColumnType<PlayerStatistics>[] = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            fixed: 'left',
            width: 65,
            align: 'center',
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'nameTag',
            key: 'name',
            render: (nameTag: string) => (
                <>
                    {nameTag}
                    {nameTag === monthlyWinner.data?.nameTag ? <Tooltip title={`Winner of Monthly ${new Date(0, monthlyWinner.data.month - 1).toLocaleString('default', { month: 'long' })} ${monthlyWinner.data.year}`}>🏆</Tooltip> : ''}
                </>
            ),
        },
        {
            title: (
                <div style={{ whiteSpace: 'nowrap' }}>
                    Rating
                </div>
            ),
            dataIndex: 'rating',
            key: 'rating',
            render: (_, player: PlayerStatistics) => (
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
            dataIndex: 'totalWins',
            key: 'totalWins',
            render: (_, player: PlayerStatistics) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{player.attackerWins + player.defenderWins}</span>

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
            dataIndex: 'totalLost',
            key: 'totalLost',
            render: (_, a: PlayerStatistics) => a.attackerLost + a.defenderLost
        },
    ];

    const sortedData = data?.filter((player) => player.attackerLost + player.attackerWins + player.defenderLost + player.defenderWins > 0).slice().sort((a, b) => b.rating - a.rating);

    return (
        <>
            <Table dataSource={sortedData} columns={columns} scroll={{ x: 350 }} onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })} pagination={{
                hideOnSinglePage: true,
                current: page,
                pageSize,
                onChange: (p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                },
            }} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
            {modalStatisticsVisible && <PlayerStatisticsModal modalVisible={modalStatisticsVisible} setModalVisible={setModalStatisticsVisible} playerId={rowId} monthly={false} solo={false} />}
        </>
    )
}

export default PlayerRankingTable