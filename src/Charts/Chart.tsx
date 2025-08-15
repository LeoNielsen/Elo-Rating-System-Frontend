import { useState } from 'react';
import { Line } from '@ant-design/plots';
import { chartData } from '../Types/Types';
import { Card, Select, Spin } from 'antd';

const calculateLastRatingPerDay = (data: chartData[]) => {
  if (!data) return [];

  const groupedData: Record<string, { date: string; playerTag: string; rating: number }> = {};

  data.forEach((rating) => {
    const key = `${rating.date}-${rating.playerTag}`;
    groupedData[key] = {
      date: rating.date,
      playerTag: rating.playerTag,
      rating: rating.rating,
    };
  });

  return Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

function Chart({ name, data, isLoading }: { name: string, data: chartData[] | undefined, isLoading: Boolean }) {
  const matchData = calculateLastRatingPerDay(data || []);

  const allPlayers = Array.from(new Set(matchData.map((item) => item.playerTag)));

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);


  const filteredMatchData =
    selectedPlayers.length > 0
      ? matchData.filter((item) => selectedPlayers.includes(item.playerTag))
      : matchData;

  const config = {
    data: filteredMatchData,
    xField: 'date',
    yField: 'rating',
    seriesField: 'playerTag',
    lineStyle: { lineWidth: 2 },
    yAxis: { min: 800, max: 1500 },
  };

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
      }}
    >
      <Card
        title={`${name} Performance`}
        style={{
          borderRadius: 10,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Select
          mode="multiple"
          allowClear
          placeholder="Select players"
          style={{ marginBottom: 20, width: 300 }}
          value={selectedPlayers}
          onChange={(values) => setSelectedPlayers(values)}
          options={allPlayers.map((tag) => ({ value: tag, label: tag }))}
        />
        {isLoading ? <Spin /> : <Line {...config} />}
      </Card>
    </div>
  );
}

export default Chart;
