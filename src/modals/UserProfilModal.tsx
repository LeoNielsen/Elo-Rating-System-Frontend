import { Dispatch, SetStateAction } from 'react'
import { Avatar, Button, Descriptions, Divider, Modal, Tabs, TabsProps, } from 'antd'
import UserService from '../Keycloak/UserService';
import { useQuery } from 'react-query';
import { Player } from '../Types/Types';
import { getPlayer } from '../API/Api';
import PlayerAchievementTabs from '../Tabs/PlayerAchievementTabs';
import { UserOutlined } from '@ant-design/icons';

function UserProfilModal({ modalVisible, setModalVisible }:
    { modalVisible: boolean, setModalVisible: Dispatch<SetStateAction<boolean>> }) {

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
                <div
                    style={{ maxWidth: 400, margin: 'auto', textAlign: 'center', padding: '20px' }}
                >
                    <Avatar
                        size={100}
                        style={{ backgroundColor: '#1890ff', cursor: 'not-allowed', marginBottom: 20 }}
                        icon={<UserOutlined />}
                    />
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Name">{data?.nameTag?.toUpperCase()}</Descriptions.Item>
                        <Descriptions.Item label="Rating">{data?.rating}</Descriptions.Item>
                        <Descriptions.Item label="Solo Rating">{data?.soloRating}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Button type="primary" danger onClick={UserService.changePassword}>
                        Change Password
                    </Button>
                </div>
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

export default UserProfilModal;