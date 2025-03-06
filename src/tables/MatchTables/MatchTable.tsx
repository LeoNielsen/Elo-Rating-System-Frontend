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
            dataIndex: ['redTeam', "attacker", "nameTag"],
            key: 'redTeamId',
            sorter: (a: Match, b: Match) => a.redTeam.attacker.nameTag.localeCompare(b.redTeam.attacker.nameTag),
        },
        {
            title: 'Red Defender',
            dataIndex: ['redTeam', "defender", "nameTag"],
            key: 'redTeamId',
            sorter: (a: Match, b: Match) => a.redTeam.defender.nameTag.localeCompare(b.redTeam.defender.nameTag),
        },
        {
            title: 'Blue Attacker',
            dataIndex: ['blueTeam', "attacker", "nameTag"],
            key: 'blueTeamId',
            sorter: (a: Match, b: Match) => a.blueTeam.attacker.nameTag.localeCompare(b.blueTeam.attacker.nameTag),
        },
        {
            title: 'Blue Defender',
            dataIndex: ['blueTeam', "defender", "nameTag"],
            key: 'blueTeamId',
            sorter: (a: Match, b: Match) => a.blueTeam.defender.nameTag.localeCompare(b.blueTeam.defender.nameTag),
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