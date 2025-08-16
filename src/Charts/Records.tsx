import React from 'react';
import { useQuery } from 'react-query';
import { Table, List, Card, Row, Col, Spin, Typography } from 'antd';
import { MonthlyWinner, PlayerRecords } from '../Types/Types';
import { getMonthlyWinners, getRecords } from '../API/Api';

const { Title } = Typography;

function Records() {
    const { data: records, isLoading: loadingRecords, error: errorRecords } = useQuery<PlayerRecords>('records', getRecords);
    const { data: monthlyWinnersRaw, isLoading: loadingWinners, error: errorWinners } = useQuery<MonthlyWinner[]>('monthlyWinners', getMonthlyWinners);

    const monthlyWinners = monthlyWinnersRaw ? [...monthlyWinnersRaw].reverse() : [];

    if (loadingRecords || loadingWinners) return <Spin size="large" style={{ display: 'block', margin: '2rem auto' }} />;
    if (errorRecords || errorWinners) return <div>Error loading data</div>;

    function formatRecordName(key: string) {
        const words = key.match(/([A-Z]?[a-z]+|[0-9]+v[0-9]+)/g);
        if (!words) return key;
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }


    // Define which keys are 2v2 and 1v1
    const records2v2Keys = [
        { key: 'highestRating2v2', label: 'Highest Player Rating 📈' },
        { key: 'lowestRating2v2', label: 'Lowest Player Rating 📉' },
        { key: 'mostGames2v2', label: 'Most Games Played 📅' },
        { key: 'mostWins2v2', label: 'Most Games Won 🏆' },
        { key: 'mostAttackerWins', label: 'Most Games Won as Attacker 🎯' },
        { key: 'mostDefenderWins', label: 'Most Games Won as Defender 🥅' },
        { key: 'mostLost2v2', label: 'Most Games Lost 😢' },
        { key: 'mostAttackerLost', label: 'Most Games Lost as Attacker 😡' },
        { key: 'mostDefenderLost', label: 'Most Games Lost as Defender 🥹' },
        { key: 'mostGoals2v2', label: 'Most Goals ⚽' },
        { key: 'longestWinStreak2v2', label: 'Longest Win Streak 🔥' }
      ];
      
      const records1v1Keys = [
        { key: 'highestRating1v1', label: 'Highest Player Rating 📈' },
        { key: 'lowestRating1v1', label: 'Lowest Player Rating 📉' },
        { key: 'mostGames1v1', label: 'Most Games Played 📅' },
        { key: 'mostWins1v1', label: 'Most Games Won Wins 🏆' },
        { key: 'mostLost1v1', label: 'Most Games Lost Losses 😢' },
        { key: 'mostGoals1v1', label: 'Most Goals ⚽' },
        { key: 'longestWinStreak1v1', label: 'Longest Win Streak 🔥' }
      ];    

      const prepareTableData = (recordsWithLabels: { key: string; label: string }[]) => {
        return recordsWithLabels
          .map(({ key, label }, index) => {
            const record = records?.[key as keyof PlayerRecords];
            if (!record) return null;
            return {
              key: index,
              recordName: label,
              nameTag: record.nameTag,
              amount: record.amount
            };
          })
          .filter(Boolean);
      };

    const columns = [
        {
            title: 'Record',
            dataIndex: 'recordName',
            key: 'recordName',
            render: (text: string) => text
        },
        {
            title: 'Player',
            dataIndex: 'nameTag',
            key: 'nameTag'
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount'
        }
    ];

    const monthNames = [
        '⛄ January', '💌 February', '🌱 March', '🌦️ April', '🌷 May', '☀️ June',
        '🏖️ July', '😎 August', '🍁 September', '🎃 October', '🕯️ November', '🎄 December'
    ];

    return (
        <Row gutter={24}>
            {/* Left side: Records Tables */}
            <Col xs={24} lg={12}>
                <Table
                    dataSource={prepareTableData(records2v2Keys)}
                    columns={columns}
                    pagination={false}
                    bordered
                    size="middle"
                    title={() => <Title level={4}>2v2 Records</Title>}
                    style={{ marginBottom: '2rem' }}
                    showHeader={false}
                />
                <Table
                    dataSource={prepareTableData(records1v1Keys)}
                    columns={columns}
                    pagination={false}
                    bordered
                    size="middle"
                    title={() => <Title level={4}>1v1 Records</Title>}
                    showHeader={false}
                />
            </Col>

            {/* Right side: Monthly Winners */}
            <Col xs={24} lg={12}>
                <Card title={<Title level={4}>Monthly Winners</Title>} style={{ minHeight: '70vh', overflowY: 'auto' }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={monthlyWinners}
                        renderItem={(winner) => {
                            const monthName = monthNames[winner.month - 1];
                            return (
                                <List.Item style={{ padding: '1rem 0' }}>
                                    <List.Item.Meta
                                        title={<b>🥇 {winner.nameTag} ({winner.monthlyRating})</b>}
                                        description={<span style={{ color: '#000' }}>{monthName} {winner.year}</span>}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </Card>
            </Col>
        </Row>
    );
}

export default Records;
