import { useQuery } from 'react-query';
import { Button, Table } from 'antd';
import '../Style.css'
import { useState } from 'react';
import {  getAllMatches } from '../API/Api';
import NewMatchModal from '../modals/NewMatchModal';

function MatchTable() {
  const { isLoading, data, refetch } = useQuery("matches", getAllMatches);

  const [modalVisible, setModalVisible] = useState(false);

  const handleNewMatchClick = () => {
    setModalVisible(true);
  };


  const columns = [
    {
      title: 'Red Attacker',
      dataIndex: ['redTeam', "attacker", "nameTag"],
      key: 'redTeamId',
      sorter: (a: any, b: any) => a.redTeam.attacker.nameTag.localeCompare(b.redTeam.attacker.nameTag),
    },
    {
      title: 'Red Defender',
      dataIndex: ['redTeam', "defender", "nameTag"],
      key: 'redTeamId',
      sorter: (a: any, b: any) => a.redTeam.defender.nameTag.localeCompare(b.redTeam.defender.nameTag),
    },
    {
      title: 'Blue Attacker',
      dataIndex: ['blueTeam', "attacker", "nameTag"],
      key: 'blueTeamId',
      sorter: (a: any, b: any) => a.blueTeam.attacker.nameTag.localeCompare(b.blueTeam.attacker.nameTag),
    },
    {
      title: 'Blue Defender',
      dataIndex: ['blueTeam', "defender", "nameTag"],
      key: 'blueTeamId',
      sorter: (a: any, b: any) => a.blueTeam.defender.nameTag.localeCompare(b.blueTeam.defender.nameTag),
    },
    {
      title: 'Red Score',
      dataIndex: 'redTeamScore',
      key: 'redTeamScore',
      sorter: (a: any, b: any) => a.redTeamScore - b.redTeamScore,
    },
    {
      title: 'Blue Score',
      dataIndex: 'blueTeamScore',
      key: 'blueTeamScore',
      sorter: (a: any, b: any) => a.blueTeamScore - b.blueTeamScore,
    }
  ];


  return (
    <div className="App">
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={handleNewMatchClick}>
          New Match
        </Button>
      </div>
      <Table dataSource={data} columns={columns} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
      <NewMatchModal modalVisible={modalVisible} setModalVisible={setModalVisible} refetch={refetch} />
    </div>
  );
}


export default MatchTable;
