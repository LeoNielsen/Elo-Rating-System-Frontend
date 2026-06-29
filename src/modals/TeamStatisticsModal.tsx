import { Descriptions, Modal } from "antd";
import { useQuery } from "react-query";
import { getTeamPairById } from "../API/Api";
import { Dispatch, SetStateAction } from "react";
import { TeamPair } from "../Types/Types";
import PlayerStatsTable from "./PlayerBlock";

function TeamStatisticsModal({ modalVisible, setModalVisible, teamId }:
    { modalVisible: boolean, setModalVisible: Dispatch<SetStateAction<boolean>>, teamId: number }) {

    const { data } = useQuery<TeamPair>("TeamPairs", () => getTeamPairById(teamId));

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    return data ? (<Modal
        title="Team Statistics"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        <Descriptions
            column={1}
            size="small"
            bordered
            labelStyle={{ fontWeight: 'bold', width: 180 }}
        >
            <Descriptions.Item label="Player">{data.playerA}</Descriptions.Item>
            <Descriptions.Item label="Player">{data.playerB}</Descriptions.Item>
            <Descriptions.Item label="Won">{data.won}</Descriptions.Item>
            <Descriptions.Item label="Lost">{data.lost}</Descriptions.Item>
            <Descriptions.Item label="Goals">{data.goals}</Descriptions.Item>
        </Descriptions>
        <PlayerStatsTable playerName={data.playerA} stats={data.teams} />
        <PlayerStatsTable playerName={data.playerB} stats={data.teams} />
    </Modal>) : (<></>);

}

export default TeamStatisticsModal;