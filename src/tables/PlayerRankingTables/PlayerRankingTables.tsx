import { Tabs, TabsProps } from 'antd';
import PlayerSoloRakingTable from './PlayerSoloRankingTable';
import PlayerRankingTable from './PlayerRankingTable';
import PlayerMonthlyRankingTable from './PlayerMonthlyRankingTable';

function PlayerRankingTables() {



  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: '2v2',
      children: <PlayerRankingTable />
    }, {
      key: '2',
      label: '1v1',
      children: <PlayerSoloRakingTable />
    }, {
      key: '3',
      label: 'Monthly 2v2',
      children: <PlayerMonthlyRankingTable />
    }
  ]

  return (
    <div className="App">
      <Tabs items={tabs} defaultActiveKey='1' />
    </div>

  );
}

export default PlayerRankingTables;