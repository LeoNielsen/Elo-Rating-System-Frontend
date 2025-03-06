
import { Line } from '@ant-design/plots';
import { chartData } from '../Types/Types';
import { useQuery } from 'react-query';
import { getChartData, getSoloChartData } from '../API/Api';
import { Card } from 'antd';

const calculateLastRatingPerDay = (data: chartData[]) => {
  if (!data) return [];

  const groupedData: Record<string, { matchId: number; date: string; player: string; rating: number }> = {};

  data.forEach((rating) => {
    const key = `${rating.date}-${rating.player.nameTag}`;

    // If this is the first match for the day, or if the new match has a higher matchId, update the record
    if (!groupedData[key] || rating.matchId > groupedData[key].matchId) {
      groupedData[key] = {
        matchId: rating.matchId,
        date: rating.date,
        player: rating.player.nameTag,
        rating: rating.newRating,
      };
    }
  });

  // Convert the object values to an array
  return Object.values(groupedData);
};

function Chart() {

  const ratings = useQuery<chartData[]>("ratings", getChartData);
  const ratingsSolo = useQuery<chartData[]>("ratingsSolo", getSoloChartData);

  const matchData = calculateLastRatingPerDay(ratings.data || []);
  const matchDataSolo = calculateLastRatingPerDay(ratingsSolo.data || []);

  // Chart configuration
  const config = {
    data: matchData,
    xField: 'date',
    yField: 'rating',
    seriesField: 'player',
    lineStyle: {
      lineWidth: 2,
    },
    yAxis: {
      min: 800,
      max: 1500,
    },
  };
  const configSolo = {
    data: matchDataSolo,
    xField: 'date',
    yField: 'rating',
    seriesField: 'player',
    lineStyle: {
      lineWidth: 2,
    },

    yAxis: {
      min: 800,
      max: 1500,
    },
  };



  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      <Card title="2v2 Performance" bordered={false} style={{ borderRadius: 10, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <Line {...config} />
      </Card>
      <Card title="1v1 Performance" bordered={false} style={{ borderRadius: 10, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <Line {...configSolo} />
      </Card>
    </div>
  );
}

export default Chart;