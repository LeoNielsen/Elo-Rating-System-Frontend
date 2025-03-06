
import { Line } from '@ant-design/plots';
import { MatchRating } from '../Types/Types';
import { useQuery } from 'react-query';
import { getAllRatings, getAllSoloRatings } from '../API/Api';
import { Card } from 'antd';


function Chart() {

  const ratings = useQuery<MatchRating[]>("ratings", getAllRatings);
  const ratingsSolo = useQuery<MatchRating[]>("ratingsSolo", getAllSoloRatings);



  // Transform data
  const matchData = ratings.data?.map((rating: MatchRating) => ({
    matchId: rating.matchId,
    rating: rating.newRating,
    player: rating.player.nameTag
  })).sort((a, b) => a.matchId - b.matchId) || [];

  const matchDataSolo = ratingsSolo.data?.map((rating: MatchRating) => ({
    matchId: rating.matchId,
    rating: rating.newRating,
    player: rating.player.nameTag
  })).sort((a, b) => a.matchId - b.matchId) || [];

  // Chart configuration
  const config = {
    data: matchData,
    xField: 'matchId',
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
    xField: 'matchId',
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