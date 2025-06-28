
import { Line } from '@ant-design/plots';
import { chartData } from '../Types/Types';
import { useQuery } from 'react-query';
import { getChartData, getSoloChartData } from '../API/Api';
import { Card } from 'antd';

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

  // Convert the object values to an array and sort by date
  return Object.values(groupedData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
    seriesField: 'playerTag',
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
    seriesField: 'playerTag',
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