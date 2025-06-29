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
            dataIndex: 'redScore',
            key: 'redScore',
            sorter: (a: Match, b: Match) => a.redScore - b.redScore,
        },
        {
            title: 'Blue Score',
            dataIndex: 'blueScore',
            key: 'blueScore',
            sorter: (a: Match, b: Match) => a.blueScore - b.blueScore,
        }
        ,
        {
            title: 'Red Attacker',
            dataIndex: "redAtk",
            key: 'redAtk',
            sorter: (a: Match, b: Match) => a.redAtk.localeCompare(b.redAtk),
        },
        {
            title: 'Red Defender',
            dataIndex: "redDef",
            key: 'redDef',
            sorter: (a: Match, b: Match) => a.redDef.localeCompare(b.redDef),
        },
        {
            title: 'Blue Attacker',
            dataIndex: "blueAtk",
            key: 'blueAtk',
            sorter: (a: Match, b: Match) => a.blueAtk.localeCompare(b.blueAtk),
        },
        {
            title: 'Blue Defender',
            dataIndex: "blueDef",
            key: 'blueDef',
            sorter: (a: Match, b: Match) => a.blueDef.localeCompare(b.blueDef),
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