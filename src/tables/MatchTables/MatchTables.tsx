import { useQuery } from 'react-query';
import { Button, Tabs, TabsProps } from 'antd';
import { useState } from 'react';
import { getMatches, getRecentMatches, getRecentSoloMatches } from '../../API/Api';
import NewMatchModal from '../../modals/NewMatchModal';
import { Match, SoloMatch } from '../../Types/Types';
import SoloMatchTable from './SoloMatchTable';
import MatchTable from './MatchTable';

function MatchTables() {

  const match = useQuery<Match[]>("matches", getMatches);
  const soloMatch = useQuery<SoloMatch[]>("soloMatches", getRecentSoloMatches);


  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');


  const handleNewMatchClick = () => {
    setModalVisible(true);
  };
  const handleActiveTab = (key: string) => {
    setActiveTab(key);
  };

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: '2v2',
      children: <MatchTable isLoading={match.isLoading} data={match.data} />
    }, {
      key: '2',
      label: '1v1',
      children: <SoloMatchTable isLoading={soloMatch.isLoading} data={soloMatch.data} />
    }
  ]


  return (
    <div className="App">
      <Tabs
        items={tabs}
        defaultActiveKey="1"
        onChange={handleActiveTab}
        tabBarExtraContent={
          <Button type="primary" onClick={handleNewMatchClick}>
            New Match
          </Button>
        }
      />
      {modalVisible && (
        <NewMatchModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          refetch={match.refetch}
          soloRefetch={soloMatch.refetch}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}


export default MatchTables;
