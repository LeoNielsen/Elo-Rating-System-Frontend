import { useState } from 'react'
import { SoloMatch } from '../../Types/Types';
import Table, { ColumnType } from 'antd/es/table';
import MatchRatingModal from '../../modals/MatchRatingModal';

function SoloMatchTable({ isLoading, data }: { isLoading: boolean, data: SoloMatch[] | undefined }) {


    const [modalRatingsVisible, setModalRatingsVisible] = useState(false);
    const [rowId, setRowId] = useState(NaN);

    const handleRowClick = (record: SoloMatch) => {
        setModalRatingsVisible(true);
        setRowId(record.id)
    };

    const columns: ColumnType<SoloMatch>[] = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Red Score',
            dataIndex: 'redScore',
            key: 'redScore',
            sorter: (a: SoloMatch, b: SoloMatch) => a.redScore - b.redScore,
        },
        {
            title: 'Blue Score',
            dataIndex: 'blueScore',
            key: 'blueScore',
            sorter: (a: SoloMatch, b: SoloMatch) => a.blueScore - b.blueScore,
        }
        ,
        {
            title: 'Red Player',
            dataIndex: 'redPlayer',
            key: 'redPlayerId',
            sorter: (a: SoloMatch, b: SoloMatch) => a.redPlayer.localeCompare(b.redPlayer),
        },
        {
            title: 'Blue Player',
            dataIndex: 'bluePlayer',
            key: 'bluePlayerId',
            sorter: (a: SoloMatch, b: SoloMatch) => a.bluePlayer.localeCompare(b.bluePlayer),
        }
    ];

    const sortedData = data ? [...data].sort((a, b) => b.id - a.id) : [];

    return (
        <>
            <Table
                scroll={{ x: 350 }}
                dataSource={sortedData}
                columns={columns}
                rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                bordered={true}
                loading={isLoading}
            />
            {modalRatingsVisible && <MatchRatingModal modalVisible={modalRatingsVisible} setModalVisible={setModalRatingsVisible} matchId={rowId} soloMatch={true} />}
        </>
    )
}

export default SoloMatchTable