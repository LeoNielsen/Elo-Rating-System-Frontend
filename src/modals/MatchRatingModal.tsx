import { Modal, Typography } from "antd";
import { useQuery } from "react-query";
import { getMatchRatings, getSoloMatchRatings } from "../API/Api";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { MatchRating } from "../Types/Types";

function MatchRatingModal({ modalVisible, setModalVisible, matchId, soloMatch }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, matchId: number, soloMatch: boolean, }) {

    const fetchMatchRatings = soloMatch ? getSoloMatchRatings : getMatchRatings;

    const { data, isLoading } = useQuery<MatchRating[]>(
        "matchRatings",
        () => fetchMatchRatings(matchId)
    );

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    if (isLoading) {
        return <></>
    }
    const { Text } = Typography
    return data ? (<Modal
        title="Match Ratings"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            {data.map((rating: MatchRating) => (
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        Name Tag: {rating.player.nameTag}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ flex: '1', marginRight: '10px' }}>
                            <p style={{ margin: '5px 0' }}>
                                Old Rating: {rating.oldRating}
                            </p>
                            <p style={{ margin: '5px 0' }}>
                                New Rating: {rating.newRating}
                            </p>
                        </div>
                        <div style={{ flex: '1', textAlign: 'right' }}>
                            <Text strong type={rating.newRating - rating.oldRating >= 0 ? 'success' : 'danger'} style={{ margin: '5px 0' }}>
                                {rating.newRating - rating.oldRating} {' '}
                                {rating.newRating - rating.oldRating >= 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                            </Text>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Modal>) : (<></>);

}

export default MatchRatingModal;