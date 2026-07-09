import { useQuery } from "react-query";
import { TeamStatistics } from "../../Types/Types";
import { getAllTeamStatistics } from "../../API/Api";
import { useState } from "react";
import Table, { ColumnType } from "antd/es/table";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Grid, Typography } from "antd";
import TeamStatisticsModal from "../../modals/TeamStatisticsModal";


function TeamRankingTable() {

    const { isLoading, data } = useQuery<TeamStatistics[]>("teams", getAllTeamStatistics);

    const [modalStatisticsVisible, setModalStatisticsVisible] = useState(false);
    const [rowId, setRowId] = useState(NaN);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isSmallScreen = !screens.md;

    const handleRowClick = (record: TeamStatistics) => {
        setModalStatisticsVisible(true);
        setRowId(record.id)
    };

    const columns: ColumnType<TeamStatistics>[] = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            fixed: 'left',
            width: 66,
            align: 'center',
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'teamName',
            key: 'name',
            render: (teamName: string) => (
                <>
                    {teamName}
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
            render: (_, team: TeamStatistics) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{team.rating}</span>

                    {team.todayRatingChance !== 0 && (
                        <Typography.Text type={team.todayRatingChance > 0 ? 'success' : 'danger'}>
                            {team.todayRatingChance > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                            {!isSmallScreen && ` ${Math.abs(team.todayRatingChance)}`}
                        </Typography.Text>
                    )}
                </div>
            )
        },
        {
            title: 'Total Wins',
            dataIndex: 'totalWins',
            key: 'totalWins',
            render: (_, team: TeamStatistics) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{team.wins}</span>

                    {team.currentWinStreak >= 3 && (
                        <Typography.Text strong>
                            {!isSmallScreen && ` ${Math.abs(team.currentWinStreak)}`}
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
            render: (_, a: TeamStatistics) => a.lost
        },
    ];

    const sortedData = data?.filter((team) => team.wins + team.lost > 0).slice().sort((a, b) => b.rating - a.rating);

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
            {modalStatisticsVisible && <TeamStatisticsModal modalVisible={modalStatisticsVisible} setModalVisible={setModalStatisticsVisible} teamId={rowId} />}
        </>
    )
}

export default TeamRankingTable