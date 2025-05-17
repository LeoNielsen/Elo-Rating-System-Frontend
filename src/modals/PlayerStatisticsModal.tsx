import { Button, Col, Descriptions, Form, Modal, Row, Select, Typography } from "antd";
import { useQuery } from "react-query";
import { getAllPlayers, getMonthlyStatistics, getPlayerSoloStatistics, getPlayerStatistics } from "../API/Api";
import { Player, PlayerSoloStatistics, PlayerStatistics } from "../Types/Types";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useState } from "react";

function PlayerStatisticsModal({ modalVisible, setModalVisible, playerId, solo, monthly }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, playerId: number, solo: boolean, monthly: boolean }) {

    const [comparedPlayerId, setComparedPlayerId] = useState<number | null>(null);
    const [showCompareSelect, setShowCompareSelect] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<{ [key: string]: Player[] }>({});


    const players = useQuery("Players", getAllPlayers);
    const fetchPlayerStatistics = monthly ? getMonthlyStatistics : solo ? getPlayerSoloStatistics : getPlayerStatistics;

    const [form] = Form.useForm();

    const { data, isLoading } = useQuery<PlayerStatistics | PlayerSoloStatistics>(
        "PlayerStatistics",
        () => fetchPlayerStatistics(playerId)
    );

    const options = players.data.map((player: Player) => ({
        value: player.id,
        label: player.nameTag
    }));
    const handleSearch = (value: string, field: string) => {
        setFilteredOptions((prev) => ({
            ...prev,
            [field]: players.data.filter((player: Player) => player.nameTag.toLowerCase().includes(value.toLowerCase()))
        }));
    };
    // Automatically select the top result on blur
    const handleBlur = (field: string) => {
        const options = filteredOptions[field];
        if (options && options.length > 0) {
            setComparedPlayerId(options[0].id);
            form.setFieldValue(field, filteredOptions[field][0].id);
        }
    };

    const {
        data: comparedData,
        isLoading: isLoadingCompared
    } = useQuery<PlayerStatistics | PlayerSoloStatistics>(
        ['ComparedPlayerStatistics', comparedPlayerId],
        () => comparedPlayerId ? fetchPlayerStatistics(comparedPlayerId) : Promise.resolve(null),
        {
            enabled: !!comparedPlayerId,
        }
    );


    const handleModalCancel = () => {
        setModalVisible(false);
        setComparedPlayerId(null);
        setShowCompareSelect(false);
    };

    if (isLoading) {
        return <></>
    }

    const { Text } = Typography
    const content = (
        player: PlayerStatistics | PlayerSoloStatistics,
        comparedPlayer?: PlayerStatistics | PlayerSoloStatistics
    ) => {
        const isSolo = 'wins' in player;
        const isComparedSolo = comparedPlayer ? 'wins' in comparedPlayer : isSolo;

        const getStats = (p: PlayerStatistics | PlayerSoloStatistics) => {
            const solo = 'wins' in p;
            const totalGames = solo
                ? p.wins + p.lost
                : p.attackerWins + p.attackerLost + p.defenderWins + p.defenderLost;

            const wins = solo ? p.wins : p.attackerWins + p.defenderWins;
            const losses = solo ? p.lost : p.attackerLost + p.defenderLost;

            return {
                nameTag: p.nameTag,
                rating: (
                    <div style={{ display: 'flex', justifyContent: comparedPlayer ? 'flex-start' : 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>{p.rating}</span>
                        {p.todayRatingChance !== 0 && (
                            <Text type={p.todayRatingChance > 0 ? 'success' : 'danger'}>
                                {p.todayRatingChance > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                {Math.abs(p.todayRatingChance)}
                            </Text>
                        )}
                    </div>
                ),
                highestELO: p.highestELO,
                lowestELO: p.lowestELO,
                totalGames,
                wins,
                losses,
                winDetails: solo ? null : `Attacker: ${(p as PlayerStatistics).attackerWins} | Defender: ${(p as PlayerStatistics).defenderWins}`,
                lossDetails: solo ? null : `Attacker: ${(p as PlayerStatistics).attackerLost} | Defender: ${(p as PlayerStatistics).defenderLost}`,
                longestWinStreak: p.longestWinStreak,
                currentWinStreak: p.currentWinStreak,
                winPercentage: totalGames > 0 ? ((wins / totalGames) * 100).toFixed(0) + '%' : '0%',
                goals: p.totalGoals,
                goalsPerGame: totalGames > 0 ? (p.totalGoals / totalGames).toFixed(2) : '0.00',
            };
        };

        const p1 = getStats(player);
        const p2 = comparedPlayer ? getStats(comparedPlayer) : null;

        const compare = (key: keyof typeof p1, subKey?: keyof typeof p1) => {
            const val1 = p1[key];
            const val2 = p2 ? p2[key] : null;

            const diff =
                val2 !== null && typeof val1 === 'number' && typeof val2 === 'number'
                    ? val2 - val1
                    : null;

            return (
                <div
                    style={{
                        display: 'flex',
                        gap: 16,
                        alignItems: 'center',
                    }}
                >
                    {/* Player 1 */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {val1}
                        {subKey && p1[subKey] && (
                            <div
                                style={{
                                    color: '#999',
                                    fontSize: 12,
                                    marginTop: 4,
                                    whiteSpace: comparedPlayer ? 'normal' : 'nowrap',
                                    overflowWrap: comparedPlayer ? 'break-word' : 'normal',
                                    maxWidth: comparedPlayer ? 100 : 'none',
                                }}>{p1[subKey]}</div>
                        )}
                    </div>

                    {/* Vertical divider */}
                    {p2 && (
                        <div
                            style={{
                                borderLeft: '2px solid #d9d9d9',
                                margin: '0 8px',
                                alignSelf: 'stretch',
                                height: 'auto',
                                marginLeft: '-40px'
                            }}
                        />
                    )}

                    {/* Player 2 and diff container */}
                    {p2 && (
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',  // space between player value and diff
                                gap: 8,
                                paddingLeft: 0,  // reduce padding to move left more
                            }}
                        >
                            {/* Compared player value + sub */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {val2}
                                {subKey && p2[subKey] && (
                                    <div
                                        style={{
                                            color: '#999',
                                            fontSize: 12,
                                            marginTop: 4,
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            maxWidth: comparedPlayer ? 100 : 'none',
                                        }}>{p2[subKey]}</div>
                                )}
                            </div>

                            {/* Difference aligned right */}
                            {diff !== null && diff !== 0 && (
                                <div
                                    style={{
                                        color: diff > 0 ? 'green' : 'red',
                                        fontSize: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        whiteSpace: 'nowrap',
                                        minWidth: 50,
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    {diff > 0 ? '+' : ''}
                                    {diff}
                                    {diff > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        };



        return (
            <Descriptions
                column={1}
                size="small"
                bordered
                labelStyle={{ fontWeight: 'bold', width: 180 }}
            >
                <Descriptions.Item label="Name Tag">{compare('nameTag')}</Descriptions.Item>
                <Descriptions.Item label="Rating">{compare('rating')}</Descriptions.Item>
                <Descriptions.Item label="Highest Rating">{compare('highestELO')}</Descriptions.Item>
                <Descriptions.Item label="Lowest Rating">{compare('lowestELO')}</Descriptions.Item>
                <Descriptions.Item label="Games">{compare('totalGames')}</Descriptions.Item>
                <Descriptions.Item label="Wins">{compare('wins', 'winDetails')}</Descriptions.Item>
                <Descriptions.Item label="Lost">{compare('losses', 'lossDetails')}</Descriptions.Item>
                <Descriptions.Item label="Longest Win Streak">{compare('longestWinStreak')}</Descriptions.Item>
                <Descriptions.Item label="Current Win Streak">{compare('currentWinStreak')}</Descriptions.Item>
                <Descriptions.Item label="Winning Percentage">{compare('winPercentage')}</Descriptions.Item>
                <Descriptions.Item label="Goals">{compare('goals')}</Descriptions.Item>
                <Descriptions.Item label="Goals Per Game">{compare('goalsPerGame')}</Descriptions.Item>
            </Descriptions>
        );
    };


    return data ? (<Modal
        title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Player Statistics</span>
                <div style={{ marginRight: 36 }}>
                    {!showCompareSelect ? (
                        <Button type="primary" onClick={() => setShowCompareSelect(true)}>
                            H2H
                        </Button>
                    ) : (
                        <Form form={form}>
                            <Form.Item name="compare">
                                <Select
                                    placeholder="Select player to compare"
                                    style={{ width: 200 }}
                                    options={options}
                                    onChange={(value) => {
                                        setComparedPlayerId(value);
                                    }}
                                    onClear={() => {
                                        setComparedPlayerId(null);
                                        setShowCompareSelect(false);
                                    }}
                                    optionFilterProp="label"
                                    showSearch
                                    onSearch={(value) => handleSearch(value, "compare")}
                                    onBlur={() => handleBlur('compare')}
                                    autoFocus
                                    allowClear
                                />
                            </Form.Item>
                        </Form>
                    )}
                </div>
            </div>
        }
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
    >
        {content(data, comparedData ?? undefined)}

    </Modal>) : (<></>);

}

export default PlayerStatisticsModal;