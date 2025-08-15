import { useState } from 'react';
import { Line } from '@ant-design/plots';
import { chartData } from '../Types/Types';
import { useQuery } from 'react-query';
import { getSoloChartData } from '../API/Api';
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

function Chart() {
  const ratingsSolo = useQuery<chartData[]>('ratingsSolo', getSoloChartData);

  const matchDataSolo = calculateLastRatingPerDay(ratingsSolo.data || []);

  const allPlayers = Array.from(new Set(matchDataSolo.map((item) => item.playerTag)));

  const [selectedPlayers1v1, setSelectedPlayers1v1] = useState<string[]>([]);

  const filteredMatchDataSolo =
    selectedPlayers1v1.length > 0
      ? matchDataSolo.filter((item) => selectedPlayers1v1.includes(item.playerTag))
      : matchDataSolo;

  const config1v1 = {
    data: filteredMatchDataSolo,
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
        title="1v1 Performance"
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
          value={selectedPlayers1v1}
          onChange={(values) => setSelectedPlayers1v1(values)}
          options={allPlayers.map((tag) => ({ value: tag, label: tag }))}
        />
        {ratingsSolo.isLoading ? <Spin /> : <Line {...config1v1} />}
      </Card>
    </div>
  );
}

export default Chart;
