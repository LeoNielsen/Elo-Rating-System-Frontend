import { Button, Descriptions, Divider, Modal, Tabs, TabsProps, } from 'antd'
import UserService from '../Keycloak/UserService';
import { useQuery } from 'react-query';
import { Player } from '../Types/Types';
import { getPlayer } from '../API/Api';
import PlayerAchievementTabs from '../Tabs/PlayerAchievementTabs';

function UserProfilModal({ modalVisible, setModalVisible }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { data } = useQuery<Player>("User",
        () => getPlayer(UserService.getUsername()),
        { enabled: !!UserService.getUsername() }
    );

    const handleModalCancel = () => {
        setModalVisible(false);
    };


    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Generel',
            children:
                <>
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Name">{data?.nameTag.toUpperCase()}</Descriptions.Item>
                        <Descriptions.Item label="Rating">{data?.rating}</Descriptions.Item>
                        <Descriptions.Item label="SoloRating">{data?.soloRating}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Button type="primary" danger onClick={UserService.changePassword}>
                        Change Password
                    </Button>
                </>
        }, {
            key: '2',
            label: 'Bagde',
            children: data ? <PlayerAchievementTabs playerId={data.id} /> : <></>
        }
    ]

    return (
        <Modal
            title={`Hello ${data?.nameTag.toUpperCase()}`}
            open={modalVisible}
            onCancel={handleModalCancel}
            footer={null}
        >
            <Tabs items={tabs} />
        </Modal>
    )
}

export default UserProfilModal