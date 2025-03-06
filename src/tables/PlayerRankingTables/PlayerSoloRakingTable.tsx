import { useQuery } from "react-query";
import { getAllPlayerSoloStatistics } from "../../API/Api";
import { PlayerSoloStatistics } from "../../Types/Types";
import { useState } from "react";
import Table, { ColumnType } from "antd/es/table";
import PlayerStatisticsModal from "../../modals/PlayerStatisticsModal";

function PlayerSoloRakingTable() {

    const { isLoading, data } = useQuery<PlayerSoloStatistics[]>("allSoloPlayerStatistics", getAllPlayerSoloStatistics);

    const [modalStatisticsVisible, setModalStatisticsVisible] = useState(false);
    const [rowId, setRowId] = useState(NaN);

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
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Total Wins',
            dataIndex: 'wins',
            key: 'totalWins',
        },
        {
            title: 'Total Lost',
            dataIndex: 'lost',
            key: 'totalLost',
        },
    ];

    const sortedData = data?.slice().sort((a, b) => b.rating - a.rating);


    return (
        <>
            <Table dataSource={sortedData} columns={columns} scroll={{ x: 350 }} onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
            {modalStatisticsVisible && <PlayerStatisticsModal modalVisible={modalStatisticsVisible} setModalVisible={setModalStatisticsVisible} playerId={rowId} solo={true} />}
        </>
    )
}

export default PlayerSoloRakingTable