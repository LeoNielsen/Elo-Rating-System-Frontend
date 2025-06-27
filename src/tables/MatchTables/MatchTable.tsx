import { useState } from "react";
import { Match } from "../../Types/Types";
import { Table } from "antd";
import { ColumnType } from "antd/es/table";
import MatchRatingModal from "../../modals/MatchRatingModal";


function MatchTable({ isLoading, data }: { isLoading: boolean, data: Match[] | undefined }) {

    const [modalRatingsVisible, setModalRatingsVisible] = useState(false);
    const [rowId, setRowId] = useState(NaN);

    const handleRowClick = (record: Match) => {
        setModalRatingsVisible(true);
        setRowId(record.id)
    };

    const columns: ColumnType<Match>[] = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Red Score',
            dataIndex: 'redTeamScore',
            key: 'redTeamScore',
            sorter: (a: Match, b: Match) => a.redTeamScore - b.redTeamScore,
        },
        {
            title: 'Blue Score',
            dataIndex: 'blueTeamScore',
            key: 'blueTeamScore',
            sorter: (a: Match, b: Match) => a.blueTeamScore - b.blueTeamScore,
        }
        ,
        {
            title: 'Red Attacker',
            dataIndex: "redAttacker",
            key: 'redAttacker',
            sorter: (a: Match, b: Match) => a.redAttacker.localeCompare(b.redAttacker),
        },
        {
            title: 'Red Defender',
            dataIndex: "redDefender",
            key: 'redDefenderId',
            sorter: (a: Match, b: Match) => a.redDefender.localeCompare(b.redDefender),
        },
        {
            title: 'Blue Attacker',
            dataIndex: "blueAttacker",
            key: 'blueAttackerId',
            sorter: (a: Match, b: Match) => a.blueAttacker.localeCompare(b.blueAttacker),
        },
        {
            title: 'Blue Defender',
            dataIndex: "blueDefender",
            key: 'blueDefenderId',
            sorter: (a: Match, b: Match) => a.blueDefender.localeCompare(b.blueDefender),
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
            {modalRatingsVisible && <MatchRatingModal modalVisible={modalRatingsVisible} setModalVisible={setModalRatingsVisible} matchId={rowId} soloMatch={false} />}
        </>
    )
}

export default MatchTable