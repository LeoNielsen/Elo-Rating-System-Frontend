import { Descriptions, Modal } from "antd";
import { useQuery } from "react-query";
import { getTeamPairById, getTeamStatisticsById } from "../API/Api";
import { Dispatch, SetStateAction } from "react";
import { TeamPair, TeamStatistics } from "../Types/Types";
import PlayerStatsTable from "./PlayerBlock";

function TeamStatisticsModal({ modalVisible, setModalVisible, teamId }:
    { modalVisible: boolean, setModalVisible: Dispatch<SetStateAction<boolean>>, teamId: number }) {

    const { data } = useQuery<TeamPair>("TeamPairs", () => getTeamPairById(teamId));
    const teamStatistics = useQuery<TeamStatistics>("TeamStatistics", () => getTeamStatisticsById(teamId));

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    return data && teamStatistics.data ? (<Modal
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
            <Descriptions.Item label="Rating">{data.rating}</Descriptions.Item>
            <Descriptions.Item label="Highest Rating">{teamStatistics.data.highestELO}</Descriptions.Item>
            <Descriptions.Item label="Lowest Rating">{teamStatistics.data.lowestELO}</Descriptions.Item>
            <Descriptions.Item label="Rating">{data.rating}</Descriptions.Item>
            <Descriptions.Item label="Won">{data.won}</Descriptions.Item>
            <Descriptions.Item label="Lost">{data.lost}</Descriptions.Item>
            <Descriptions.Item label="Winning Percentage">{(data.won / (data.won + data.lost) * 100).toFixed(0)}%</Descriptions.Item>
            <Descriptions.Item label="Longest Win Streak">{teamStatistics.data.longestWinStreak}</Descriptions.Item>
            <Descriptions.Item label="Current Win Streak">{teamStatistics.data.currentWinStreak}</Descriptions.Item>
            <Descriptions.Item label="Shutouts">{data.shutouts}</Descriptions.Item>
            <Descriptions.Item label="Goals">{data.goals}</Descriptions.Item>
            <Descriptions.Item label="Goals Per Game">{(data.goals / (data.won + data.lost)).toFixed(2)}</Descriptions.Item>
        </Descriptions>
        <PlayerStatsTable playerName={data.playerA} stats={data.teams} />
        <PlayerStatsTable playerName={data.playerB} stats={data.teams} />
    </Modal>) : (<></>);

}

export default TeamStatisticsModal;