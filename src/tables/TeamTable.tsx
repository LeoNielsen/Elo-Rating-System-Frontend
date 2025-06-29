import { useQuery } from 'react-query';
import { Table } from 'antd';
import '../Style.css'
import { getAllTeams } from '../API/Api';
import { Team } from '../Types/Types';

function TeamTable() {

  const { isLoading, data } = useQuery<Team[]>("teams", getAllTeams);

  const columns = [
    {
      title: 'Attacker',
      dataIndex: 'attacker',
      key: 'attacker',
      sorter: (a: Team, b: Team) => a.attacker.localeCompare(b.attacker),
    },
    {
      title: 'Defender',
      dataIndex: 'defender',
      key: 'defender',
      sorter: (a: Team, b: Team) => a.defender.localeCompare(b.defender),
    },
    {
      title: 'Won',
      dataIndex: 'won',
      key: 'won',
      sorter: (a: Team, b: Team) => a.won - b.won,
    },
    {
      title: 'Lost',
      dataIndex: 'lost',
      key: 'lost',
      sorter: (a: Team, b: Team) => a.lost - b.lost,
    }
  ];


  return (
    <div className="App">
      <Table dataSource={data} columns={columns} scroll={{ x: 350 }} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
    </div>
  );
}


export default TeamTable;
