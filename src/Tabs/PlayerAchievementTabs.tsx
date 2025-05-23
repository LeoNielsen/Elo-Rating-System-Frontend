import { Col, Row, Tabs, TabsProps, Tooltip, Typography, Image } from 'antd'
import { useQuery } from 'react-query';
import { achievement, playerAchievement } from '../Types/Types';
import { getAllAchievements, getPlayerAchievements } from '../API/Api';

function PlayerAchievementTabs({ playerId }: { playerId: number }) {

    const { data: achievements } = useQuery<achievement[]>("Achievement", () => getAllAchievements());
    const { data: playerAchievement } = useQuery<playerAchievement[]>("PlayerAchievement",
        () => getPlayerAchievements(playerId),
        { enabled: !!playerId }
    );

    const { Text } = Typography;
    const getBadgeTabs = (achievements: achievement[] | undefined): TabsProps['items'] => {
        if (!achievements) return [];

        const renderBadges = (filteredAchievements: achievement[]) => {
            // Group by type
            const grouped = filteredAchievements.reduce<Record<string, achievement[]>>((acc, curr) => {
                if (!acc[curr.type]) acc[curr.type] = [];
                acc[curr.type].push(curr);
                return acc;
            }, {});

            const multiBadgeGroups = Object.entries(grouped).filter(([, achievements]) => achievements.length > 1);
            const singleBadgeGroups = Object.entries(grouped).filter(([, achievements]) => achievements.length === 1);

            const playerAchievementIds = new Set(
                playerAchievement
                    ?.filter(p => p.unlocked)
                    .map(p => p.achievement.id)
            );

            const isUnlocked = (achievementId: number) => playerAchievementIds.has(achievementId);

            const renderBadgeItem = (achv: achievement) => {
                const unlocked = isUnlocked(achv.id);
                return (
                    <Col
                        key={achv.id}
                        flex="0 0 auto"
                        style={{ textAlign: 'center'}}
                    >
                        <Tooltip title={achv.description} >
                            <div
                                style={{
                                    cursor: unlocked ? 'pointer' : 'not-allowed',
                                    filter: unlocked ? 'none' : 'grayscale(100%)',
                                    opacity: unlocked ? 1 : 0.5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: 65
                                }}
                            >
                                <Image
                                    src={`/badgesWebp/${achv.code}_128.webp`}
                                    alt={achv.name}
                                    width={64}
                                    height={64}
                                    preview={unlocked ? { src: `/badgesWebp/${achv.code}.webp` } : false}
                                />
                                <Text style={{
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    textAlign: 'center', 
                                }} strong>{achv.name}</Text>
                            </div>
                        </Tooltip>
                    </Col>
                );
            };

            return (
                <>
                    {multiBadgeGroups.map(([type, achievements]) => (
                        <div key={type} >
                            <Row gutter={[16, 24]}>
                                {achievements.map(renderBadgeItem)}
                            </Row>
                        </div>
                    ))}

                    {singleBadgeGroups.length > 0 && (
                        <div >
                            <Row gutter={[16, 24]}>
                                {singleBadgeGroups.flatMap(([, achievements]) => achievements.map(renderBadgeItem))}
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


    return (achievements ?
        <Tabs items={getBadgeTabs(achievements)} /> : (<></>)
    )
}

export default PlayerAchievementTabs
