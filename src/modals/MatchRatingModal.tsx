import { Modal } from "antd";
import { useQuery } from "react-query";
import { getMatchRatings } from "../API/Api";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

function MatchRatingModal({ modalVisible, setModalVisible, matchId }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, matchId: number }) {

    const { data, isLoading } = useQuery("matchRatings", () => getMatchRatings(matchId));

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    return data ? (<Modal
        title="Match Ratings"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            {data.map((rating: any) => (
                <div key={rating.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
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
                            <strong><p style={{ margin: '5px 0', color: rating.newRating - rating.oldRating >= 0 ? 'green' : 'red' }}>
                                {rating.newRating - rating.oldRating} {' '}
                                {rating.newRating - rating.oldRating >= 0 ? <ArrowUpOutlined style={{ color: 'green' }} /> : <ArrowDownOutlined style={{ color: 'red' }} />}
                            </p></strong>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Modal>) : (<></>);

}

export default MatchRatingModal;