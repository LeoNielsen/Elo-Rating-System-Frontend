import { useQuery } from 'react-query';
import { Button, Col, Row, Table, Tabs } from 'antd';
import '../Style.css'
import { useState } from 'react';
import { getAllMatches } from '../API/Api';
import NewMatchModal from '../modals/NewMatchModal';
import MatchRatingModal from '../modals/MatchRatingModal';
import { ColumnType } from 'antd/es/table';
import { Match } from '../Types/Types';

function MatchTable() {

  const { isLoading, data, refetch } = useQuery<Match[]>("matches", getAllMatches);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalRatingsVisible, setModalRatingsVisible] = useState(false);
  const [rowId, setRowId] = useState(NaN);

  const handleNewMatchClick = () => {
    setModalVisible(true);
  };

  const handleRowClick = (record: Match) => {
    setModalRatingsVisible(true);
    setRowId(record.id)
  };

  const columns: ColumnType<Match>[] = [
    {
      title: 'Red Attacker',
      dataIndex: ['redTeam', "attacker", "nameTag"],
      key: 'redTeamId',
      sorter: (a: Match, b: Match) => a.redTeam.attacker.nameTag.localeCompare(b.redTeam.attacker.nameTag),
    },
    {
      title: 'Red Defender',
      dataIndex: ['redTeam', "defender", "nameTag"],
      key: 'redTeamId',
      sorter: (a: Match, b: Match) => a.redTeam.defender.nameTag.localeCompare(b.redTeam.defender.nameTag),
    },
    {
      title: 'Blue Attacker',
      dataIndex: ['blueTeam', "attacker", "nameTag"],
      key: 'blueTeamId',
      sorter: (a: Match, b: Match) => a.blueTeam.attacker.nameTag.localeCompare(b.blueTeam.attacker.nameTag),
    },
    {
      title: 'Blue Defender',
      dataIndex: ['blueTeam', "defender", "nameTag"],
      key: 'blueTeamId',
      sorter: (a: Match, b: Match) => a.blueTeam.defender.nameTag.localeCompare(b.blueTeam.defender.nameTag),
    },
    {
      title: 'Red Score',
      dataIndex: 'redTeamScore',
      key: 'redTeamScore',
      sorter: (a: Match, b: Match) => a.redTeamScore - b.redTeamScore,
    },
    {
      title: 'Blue Score',
      dataIndex: 'blueTeamScore',
      key: 'blueTeamScore',
      sorter: (a: Match, b: Match) => a.blueTeamScore - b.blueTeamScore,
    }
  ];


  return (
    <div className="App" style={{ position: 'relative' }}>
      <Tabs defaultActiveKey='1' >
        <Tabs.TabPane tab="2v2" key="1">
          <Table style={{ marginTop: '-15px' }}
            dataSource={data}
            columns={columns}
            rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            bordered={true}
            loading={isLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="1v1" key="2">
          <Table style={{ marginTop: '-15px' }}
            dataSource={data}
            columns={columns}
            rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            bordered={true}
            loading={isLoading}
          />
        </Tabs.TabPane>
      </Tabs>
      <Button
        type="primary"
        onClick={handleNewMatchClick}
        style={{ position: 'absolute', top: '0', right: '0', zIndex: '1' }}>
        New Match
      </Button>
      <NewMatchModal modalVisible={modalVisible} setModalVisible={setModalVisible} refetch={refetch} />
      {modalRatingsVisible && <MatchRatingModal modalVisible={modalRatingsVisible} setModalVisible={setModalRatingsVisible} matchId={rowId} />}
    </div>
  );
}


export default MatchTable;
