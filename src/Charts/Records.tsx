import { useQuery } from 'react-query';
import { Table, List, Card, Row, Col, Spin, Typography, Tabs } from 'antd';
import { MatchStatistics, MonthlyWinner, PlayerRecords } from '../Types/Types';
import { getMatchDays, getSoloMatchDays, getMatchStatistics, getMonthlyWinners, getRecords, getSoloMatchStatistics } from '../API/Api';
import { Column, Pie } from '@ant-design/plots';

const { Title } = Typography;
const { TabPane } = Tabs;

function Records() {
    const { data: MatchStatistics, isLoading: loadingMatchStatistics, error: errorMatchStatistics } = useQuery<MatchStatistics>('MatchStatistics', getMatchStatistics);
    const { data: MatchSoloStatistics, isLoading: loadingMatchSoloStatistics, error: errorMatchSoloStatistics } = useQuery<MatchStatistics>('MatchSoloStatistics', getSoloMatchStatistics);

    const { data: records, isLoading: loadingRecords, error: errorRecords } = useQuery<PlayerRecords>('records', getRecords);
    const { data: monthlyWinnersRaw, isLoading: loadingWinners, error: errorWinners } = useQuery<MonthlyWinner[]>('monthlyWinners', getMonthlyWinners);
    const { data: MatchDays, isLoading: loadingMatchDays, error: errorMatchDays } = useQuery<Map<string, number>[]>('matchDays', getMatchDays);
    const { data: SoloMatchDays, isLoading: loadingSoloMatchDays, error: errorSoloMatchDays } = useQuery<Map<string, number>[]>('soloMatchDays', getSoloMatchDays);



    const monthlyWinners = monthlyWinnersRaw ? [...monthlyWinnersRaw].reverse() : [];

    if (loadingRecords || loadingWinners || loadingMatchStatistics || loadingMatchSoloStatistics || loadingMatchDays || loadingSoloMatchDays) {
        return <Spin size="large" style={{ display: 'block', margin: '2rem auto' }} />;
    }
    if (errorRecords || errorWinners || errorMatchStatistics || errorMatchSoloStatistics || errorMatchDays || errorSoloMatchDays) {
        return <div>Error loading data</div>;
    }

    // --- Records Config ---
    const records2v2Keys = [
        { key: 'highestRating2v2', label: 'Highest Player Rating 📈' },
        { key: 'lowestRating2v2', label: 'Lowest Player Rating 📉' },
        { key: 'mostGames2v2', label: 'Most Games Played 📅' },
        { key: 'mostWins2v2', label: 'Most Games Won 🏆' },
        { key: 'mostAttackerWins', label: 'Most Games Won As Attacker 🎯' },
        { key: 'mostDefenderWins', label: 'Most Games Won As Defender 🥅' },
        { key: 'mostLost2v2', label: 'Most Games Lost 😢' },
        { key: 'mostAttackerLost', label: 'Most Games Lost As Attacker 😡' },
        { key: 'mostDefenderLost', label: 'Most Games Lost As Defender 🥹' },
        { key: 'mostGoals2v2', label: 'Most Goals ⚽' },
        { key: 'longestWinStreak2v2', label: 'Longest Win Streak 🔥' },
        { key: 'highestDailyEloChange2v2', label: 'Most Rating Gain In One Day 🔼' },
        { key: 'lowestDailyEloChange2v2', label: 'Most Rating Lost In One Day 🔽' }
    ];

    const records1v1Keys = [
        { key: 'highestRating1v1', label: 'Highest Player Rating 📈' },
        { key: 'lowestRating1v1', label: 'Lowest Player Rating 📉' },
        { key: 'mostGames1v1', label: 'Most Games Played 📅' },
        { key: 'mostWins1v1', label: 'Most Games Won 🏆' },
        { key: 'mostLost1v1', label: 'Most Games Lost 😢' },
        { key: 'mostGoals1v1', label: 'Most Goals ⚽' },
        { key: 'longestWinStreak1v1', label: 'Longest Win Streak 🔥' },
        { key: 'highestDailyEloChange1v1', label: 'Most Rating Gain In One Day 🔼' },
        { key: 'lowestDailyEloChange1v1', label: 'Most Rating Lost In One Day 🔽' }
    ];

    const prepareTableData = (recordsWithLabels: { key: string; label: string }[], dataSource?: PlayerRecords) => {
        return recordsWithLabels
            .map(({ key, label }, index) => {
                const record = dataSource?.[key as keyof PlayerRecords];
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
        { title: 'Record', dataIndex: 'recordName', key: 'recordName' },
        { title: 'Player', dataIndex: 'nameTag', key: 'nameTag' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' }
    ];

    const monthNames = [
        '⛄ January', '💌 February', '🌱 March', '🌦️ April', '🌷 May', '☀️ June',
        '🏖️ July', '😎 August', '🍁 September', '🎃 October', '🕯️ November', '🎄 December'
    ];

    // --- Match stats tables ---
    const matchStatsColumns = [
        { title: 'Statistic', dataIndex: 'stat', key: 'stat' },
        { title: 'Value', dataIndex: 'value', key: 'value' }
    ];

    const prepareMatchStatsData = (stats: MatchStatistics) => [
        { key: 0, stat: 'Total Games 🎲', value: stats.games },
        { key: 1, stat: 'Red Wins 🔴🏅', value: stats.redWins },
        { key: 2, stat: 'Blue Wins 🔵🏅', value: stats.blueWins },
        { key: 3, stat: 'Total Goals ⚽', value: stats.goals },
        { key: 4, stat: 'Red Goals 🔴🥅', value: stats.redGoals },
        { key: 5, stat: 'Blue Goals 🔵🥅', value: stats.blueGoals },
    ];

    // --- Pie data for wins ---
    const winsPieData = MatchStatistics
        ? [
            { type: 'Red Wins 🔴', value: MatchStatistics.redWins },
            { type: 'Blue Wins 🔵', value: MatchStatistics.blueWins },
        ]
        : [];

    // --- Pie data for goals ---
    const goalsPieData = MatchStatistics
        ? [
            { type: 'Red Goals 🔴', value: MatchStatistics.redGoals },
            { type: 'Blue Goals 🔵', value: MatchStatistics.blueGoals },
        ]
        : [];

    // --- Pie data for wins ---
    const winsSoloPieData = MatchSoloStatistics
        ? [
            { type: 'Red Wins 🔴', value: MatchSoloStatistics.redWins },
            { type: 'Blue Wins 🔵', value: MatchSoloStatistics.blueWins },
        ]
        : [];

    // --- Pie data for goals ---
    const goalsSoloPieData = MatchSoloStatistics
        ? [
            { type: 'Red Goals 🔴', value: MatchSoloStatistics.redGoals },
            { type: 'Blue Goals 🔵', value: MatchSoloStatistics.blueGoals },
        ]
        : [];

    const pieConfig = (data: typeof winsPieData) => ({
        data,
        angleField: 'value',
        colorField: 'type',
        color: ['#FF4D4F', '#1890FF'],
        radius: 1,
        label: {
            type: 'inner',           // Put label inside the pie
            content: '{value}',      // Show only the value (or '{name}: {value}' if you want both)
            style: {
                fontSize: 14,
                fontWeight: 'bold',
                fill: '#fff',        // White text for contrast
            },
        },
        legend: {
            visible: false, // This hides the legend
        },
        interactions: [{ type: 'element-active' }], // Optional: hover effect
    });

    const weekdayOrder = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ];

    const sortedDays = Object.entries(MatchDays!)
        .sort(([dayA], [dayB]) => weekdayOrder.indexOf(dayA) - weekdayOrder.indexOf(dayB))
        .map(([day, count]) => ({
            day,
            count: Number(count)
        }));

    const sortedSoloDays = Object.entries(SoloMatchDays!)
        .sort(([dayA], [dayB]) => weekdayOrder.indexOf(dayA) - weekdayOrder.indexOf(dayB))
        .map(([day, count]) => ({
            day,
            count: Number(count)
        }));

    const columnConfig = (data: typeof sortedDays) => ({
        data,
        xField: "day",
        yField: "count",
        columnWidthRatio: 0.6,

        color: "#1677ff"
    });





    return (
        <Row gutter={24}>
            {/* Left side: Tabs */}
            <Col xs={24} lg={12}>
                <Tabs defaultActiveKey="records">
                    <TabPane tab="Records" key="records">
                        <Table
                            dataSource={prepareTableData(records2v2Keys, records)}
                            columns={columns}
                            pagination={false}
                            bordered
                            size="middle"
                            title={() => <Title level={4}>2v2 Records</Title>}
                            showHeader={false}
                            style={{ marginBottom: '2rem' }}
                        />
                        <Table
                            dataSource={prepareTableData(records1v1Keys, records)}
                            columns={columns}
                            pagination={false}
                            bordered
                            size="middle"
                            title={() => <Title level={4}>1v1 Records</Title>}
                            showHeader={false}
                        />
                    </TabPane>
                    <TabPane tab="2v2 All Time Stats" key="matchStats">
                        <Table
                            dataSource={prepareMatchStatsData(MatchStatistics!)}
                            columns={matchStatsColumns}
                            pagination={false}
                            title={() => <Title level={4}>All Time Statistics</Title>}
                            size="small"
                            bordered
                            showHeader={false}
                        />
                        <Card title={<Title level={4}>Most Played Days</Title>}>
                            <Column {...columnConfig(sortedDays)} />
                        </Card>
                        <Card title={<Title level={4}>Win Ratio</Title>} >
                            <Pie {...pieConfig(winsPieData)} />
                        </Card>
                        <Card title={<Title level={4}>Goal Ratio</Title>} >
                            <Pie {...pieConfig(goalsPieData)} />
                        </Card>
                    </TabPane>
                    <TabPane tab="1v1 All Time Stats" key="matchSoloStats">
                        <Table
                            dataSource={prepareMatchStatsData(MatchSoloStatistics!)}
                            columns={matchStatsColumns}
                            pagination={false}
                            title={() => <Title level={4}>All Time Statistics</Title>}
                            size="small"
                            bordered
                            showHeader={false}
                        />
                        <Card title={<Title level={4}>Most Played Days</Title>}>
                            <Column {...columnConfig(sortedSoloDays)} />
                        </Card>
                        <Card title={<Title level={4}>Win Ratio</Title>} >
                            <Pie {...pieConfig(winsSoloPieData)} />
                        </Card>
                        <Card title={<Title level={4}>Goal Ratio</Title>} >
                            <Pie {...pieConfig(goalsSoloPieData)} />
                        </Card>
                    </TabPane>
                </Tabs>
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
        </Row >
    );
}

export default Records;