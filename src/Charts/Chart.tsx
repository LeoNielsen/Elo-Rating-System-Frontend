import { useState } from 'react';
import { Line } from '@ant-design/plots';
import { chartData } from '../Types/Types';
import { Card, Select, Spin, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

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
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const filteredMatchData = matchData.filter((item) => {
    const inPlayerSelection =
      selectedPlayers.length === 0 || selectedPlayers.includes(item.playerTag);

    const date = dayjs(item.date);
    const inDateRange =
      (!dateRange[0] || date.isAfter(dateRange[0].startOf('day'))) &&
      (!dateRange[1] || date.isBefore(dateRange[1].endOf('day')));

    return inPlayerSelection && inDateRange;
  });

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
          style={{
            marginBottom: 20,
            marginRight: 50,
            width: "100%",
            maxWidth: 250
          }}
          value={selectedPlayers}
          onChange={(values) => setSelectedPlayers(values)}
          options={allPlayers.map((tag) => ({ value: tag, label: tag }))}
        />
        <RangePicker
          style={{ marginBottom: 20, width: "100%", maxWidth: 250 }}
          onChange={(dates) => {
            if (!dates || dates.length !== 2 || !dates[0] || !dates[1]) {
              setDateRange([null, null]); // reset to show all data
            } else {
              setDateRange([dates[0], dates[1]]);
            }
          }}
          allowClear
        />
        {isLoading ? <Spin /> : <Line {...config} />}
      </Card>
    </div>
  );
}

export default Chart;
