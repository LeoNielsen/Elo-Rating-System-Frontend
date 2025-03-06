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
            dataIndex: 'redTeamScore',
            key: 'redTeamScore',
            sorter: (a: SoloMatch, b: SoloMatch) => a.redTeamScore - b.redTeamScore,
        },
        {
            title: 'Blue Score',
            dataIndex: 'blueTeamScore',
            key: 'blueTeamScore',
            sorter: (a: SoloMatch, b: SoloMatch) => a.blueTeamScore - b.blueTeamScore,
        }
        ,
        {
            title: 'Red Player',
            dataIndex: ['redPlayer', "nameTag"],
            key: 'redPlayerId',
            sorter: (a: SoloMatch, b: SoloMatch) => a.redPlayer.nameTag.localeCompare(b.redPlayer.nameTag),
        },
        {
            title: 'Blue Player',
            dataIndex: ['bluePlayer', "nameTag"],
            key: 'bluePlayerId',
            sorter: (a: SoloMatch, b: SoloMatch) => a.bluePlayer.nameTag.localeCompare(b.bluePlayer.nameTag),
        }
    ];

    const sortedData = data ? [...data].sort((a, b) => b.id - a.id) : [];



    return (
        <>
            <Table style={{ marginTop: '-15px' }}
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