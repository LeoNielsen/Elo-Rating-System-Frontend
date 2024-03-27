import { Modal } from "antd";
import { useQuery } from "react-query";
import { getPlayerStatistics } from "../API/Api";

function PlayerStatisticsModal({ modalVisible, setModalVisible, playerId }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, playerId: number }) {

    const { data, isLoading } = useQuery("PlayerStatistics", () => getPlayerStatistics(playerId));

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    return data ? (<Modal
        title="Player Statistics"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        <div>
            <p><strong>Name Tag:</strong> {data.nameTag}</p>
            <p><strong>Rating:</strong> {data.rating}</p>
            <p><strong>Total Games:</strong> {data.totalWins + data.totalLost}</p>
            <p><strong>Total Wins:</strong> {data.totalWins}</p>
            <p><strong>Total Lost:</strong> {data.totalLost}</p>
            <p><strong>winning percentage:</strong> {((data.totalWins / (data.totalWins + data.totalLost)) * 100).toFixed(0)} %</p>
            <p><strong>Total Goals:</strong> {data.totalGoals}</p>
            <p><strong>Goals Per Game:</strong> {(data.totalGoals / (data.totalWins + data.totalLost)).toFixed(2)}</p>
        </div>
    </Modal>) : (<></>);

}

export default PlayerStatisticsModal;