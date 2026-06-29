import { Table } from "antd";
import { Team } from "../Types/Types";

;

const PlayerStatsTable = ({ playerName, stats }: { playerName: string, stats: Team[] }) => {

    const AttackerStats = stats.find((team) => team.attacker === playerName);
    const DefenderStats = stats.find((team) => team.defender === playerName);

    const columns = [
        {
            title: "Stat",
            dataIndex: "label",
            key: "label",
            onCell: () => ({
                style: {
                    backgroundColor: "#fafafa", 
                    fontWeight: "bold",
                    width: 160
                }
            })
        },
        { title: "Attacker", dataIndex: "attacker", key: "attacker" },
        { title: "Defender", dataIndex: "defender", key: "defender" },
    ];

    const dataSource = [
        {
            key: "wins",
            label: "Wins",
            attacker: AttackerStats?.won !== undefined ? AttackerStats.won : 0,
            defender: DefenderStats?.won !== undefined ? DefenderStats.won : 0,
        },
        {
            key: "lost",
            label: "Lost",
            attacker: AttackerStats?.lost !== undefined ? AttackerStats.lost : 0,
            defender: DefenderStats?.lost !== undefined ? DefenderStats.lost : 0,
        },
        {
            key: "goals",
            label: "Goals",
            attacker: AttackerStats?.goals !== undefined ? AttackerStats.goals : 0,
            defender: DefenderStats?.goals !== undefined ? DefenderStats.goals : 0,
        },
    ];

    return (
        <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12 }}>{playerName}</h3>
            <Table
                size="small"
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                bordered
            />
        </div>
    );

}
export default PlayerStatsTable;