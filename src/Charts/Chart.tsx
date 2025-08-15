import React, { useState } from 'react';
import { Line } from '@ant-design/plots';
import { chartData } from '../Types/Types';
import { useQuery } from 'react-query';
import { getChartData, getSoloChartData } from '../API/Api';
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
  const ratings = useQuery<chartData[]>('ratings', getChartData);
  const ratingsSolo = useQuery<chartData[]>('ratingsSolo', getSoloChartData);

  const matchData = calculateLastRatingPerDay(ratings.data || []);
  const matchDataSolo = calculateLastRatingPerDay(ratingsSolo.data || []);

  // Get unique player tags for each dataset
  const allPlayers2v2 = Array.from(new Set(matchData.map((item) => item.playerTag)));
  const allPlayers1v1 = Array.from(new Set(matchDataSolo.map((item) => item.playerTag)));

  // Separate states for each chart’s player selection
  const [selectedPlayers2v2, setSelectedPlayers2v2] = useState<string[]>([]);
  const [selectedPlayers1v1, setSelectedPlayers1v1] = useState<string[]>([]);

  // Apply filtering
  const filteredMatchData =
    selectedPlayers2v2.length > 0
      ? matchData.filter((item) => selectedPlayers2v2.includes(item.playerTag))
      : matchData;

  const filteredMatchDataSolo =
    selectedPlayers1v1.length > 0
      ? matchDataSolo.filter((item) => selectedPlayers1v1.includes(item.playerTag))
      : matchDataSolo;

  const config2v2 = {
    data: filteredMatchData,
    xField: 'date',
    yField: 'rating',
    seriesField: 'playerTag',
    lineStyle: { lineWidth: 2 },
    yAxis: { min: 800, max: 1500 },
  };

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
      {/* 2v2 Performance */}
      <Card
        title="2v2 Performance"
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
          value={selectedPlayers2v2}
          onChange={(values) => setSelectedPlayers2v2(values)}
          options={allPlayers2v2.map((tag) => ({ value: tag, label: tag }))}
        />
        {ratings.isLoading ? <Spin /> : <Line {...config2v2} />}
      </Card>

      {/* 1v1 Performance */}
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
          options={allPlayers1v1.map((tag) => ({ value: tag, label: tag }))}
        />
        {ratingsSolo.isLoading ? <Spin /> : <Line {...config1v1} />}
      </Card>
    </div>
  );
}

export default Chart;
