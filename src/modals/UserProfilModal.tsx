import { Button, Col, Descriptions, Divider, Modal, Row, Tabs, TabsProps, Tooltip, Typography, Image } from 'antd'
import UserService from '../Keycloak/UserService';
import { useQuery } from 'react-query';
import { achievement, Player, playerAchievement } from '../Types/Types';
import { getAllAchievements, getPlayer, getPlayerAchievements } from '../API/Api';
import Title from 'antd/es/typography/Title';

function UserProfilModal({ modalVisible, setModalVisible }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { data } = useQuery<Player>("User",
        () => getPlayer(UserService.getUsername()),
        { enabled: !!UserService.getUsername() }
    );

    const { data: achievements } = useQuery<achievement[]>("Achiecement", () => getAllAchievements());
    const { data: playerAchievement } = useQuery<playerAchievement[]>("PlayerAchiecement",
        () => getPlayerAchievements(data!.id),
        { enabled: !!data?.id }
    );

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const { Text, Title } = Typography;
    const getBadgeTabs = (achievements: achievement[] | undefined): TabsProps['items'] => {
        if (!achievements) return [];

        const renderBadges = (filteredAchievements: achievement[]) => {
            // Group by type
            const grouped = filteredAchievements.reduce<Record<string, achievement[]>>((acc, curr) => {
              if (!acc[curr.type]) acc[curr.type] = [];
              acc[curr.type].push(curr);
              return acc;
            }, {});
          
            // Separate groups into multiple-badge and single-badge
            const multiBadgeGroups = Object.entries(grouped).filter(([, achievements]) => achievements.length > 1);
            const singleBadgeGroups = Object.entries(grouped).filter(([, achievements]) => achievements.length === 1);
          
            return (
              <>
                {multiBadgeGroups.map(([type, achievements]) => (
                  <div key={type} style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 24]}>
                      {achievements.map((achv) => (
                        <Col key={achv.id} xs={8} sm={6} md={4} lg={4} style={{ textAlign: 'center' }}>
                          <Tooltip title={achv.description}>
                            <div style={{ cursor: 'pointer' }}>
                              <Image
                                src={`/badges/${achv.code}.png`}
                                alt={achv.name}
                                width={64}
                                height={64}
                                preview={false}
                              />
                              <Text strong>
                                {achv.name}
                              </Text>
                            </div>
                          </Tooltip>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
          
                {singleBadgeGroups.length > 0 && (
                  <div>
                    <Row gutter={[16, 24]}>
                      {singleBadgeGroups.flatMap(([, achievements]) =>
                        achievements.map((achv) => (
                          <Col key={achv.id} xs={8} sm={6} md={4} lg={4} style={{ textAlign: 'center' }}>
                            <Tooltip title={achv.description}>
                              <div style={{ cursor: 'pointer' }}>
                                <Image
                                  src={`/badges/${achv.code}.png`}
                                  alt={achv.name}
                                  width={64}
                                  height={64}
                                  preview={false}
                                />
                                <Text strong>
                                  {achv.name}
                                </Text>
                              </div>
                            </Tooltip>
                          </Col>
                        ))
                      )}
                    </Row>
                  </div>
                )}
              </>
            );
          };

        return [
            {
                key: '1',
                label: '2v2',
                children: renderBadges(achievements.filter(a => a.gameType === 'TEAMS'))
            },
            {
                key: '2',
                label: '1v1',
                children: renderBadges(achievements.filter(a => a.gameType === 'SOLO'))
            },
            {
                key: '3',
                label: 'Generel',
                children: renderBadges(achievements.filter(a => a.gameType !== 'SOLO' && a.gameType !== 'TEAMS'))
            }
        ];
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
            children: <Tabs items={getBadgeTabs(achievements)} />
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