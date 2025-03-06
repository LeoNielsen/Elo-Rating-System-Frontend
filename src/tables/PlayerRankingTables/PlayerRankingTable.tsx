import { useQuery } from "react-query";
import { PlayerStatistics } from "../../Types/Types";
import { getAllPlayerStatistics } from "../../API/Api";
import { useState } from "react";
import Table, { ColumnType } from "antd/es/table";
import PlayerStatisticsModal from "../../modals/PlayerStatisticsModal";

function PlayerRankingTable() {

    const { isLoading, data } = useQuery<PlayerStatistics[]>("allPlayerStatistics", getAllPlayerStatistics);

    const [modalStatisticsVisible, setModalStatisticsVisible] = useState(false);
    const [rowId, setRowId] = useState(NaN);

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
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'nameTag',
            key: 'name',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Total Wins',
            dataIndex: 'totalWins',
            key: 'totalWins',
            render: (_, a: PlayerStatistics) => a.attackerWins + a.defenderWins
        },
        {
            title: 'Total Lost',
            dataIndex: 'totalLost',
            key: 'totalLost',
            render: (_, a: PlayerStatistics) => a.attackerLost + a.defenderLost
        },
    ];

    const sortedData = data?.slice().sort((a, b) => b.rating - a.rating);

    return (
        <>
            <Table dataSource={sortedData} columns={columns} scroll={{ x: 350 }} onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
            {modalStatisticsVisible && <PlayerStatisticsModal modalVisible={modalStatisticsVisible} setModalVisible={setModalStatisticsVisible} playerId={rowId} solo={false} />}
        </>
    )
}

export default PlayerRankingTable