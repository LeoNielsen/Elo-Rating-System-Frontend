
import { Line } from '@ant-design/plots';
import { Match, MatchRating } from '../Types/Types';
import { useQuery } from 'react-query';
import { getAllMatches, getAllRatings } from '../API/Api';


function Chart() {

    const { isLoading, data, refetch } = useQuery<MatchRating[]>("ratings", getAllRatings);

    // Transform data
    const matchData = data?.map((rating: MatchRating) => ({
        matchId: rating.matchId,
        rating: rating.newRating,
        player: rating.player.nameTag
    })) || [];

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



  return (
    <div className="App">
        <Line  {...config} />
    </div>

  );
}

export default Chart;