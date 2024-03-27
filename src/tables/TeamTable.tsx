import { useQuery } from 'react-query';
import { Table } from 'antd';
import '../Style.css'
import { getAllTeams } from '../API/Api';

function TeamTable() {

  const { isLoading, data } = useQuery("teams", getAllTeams);

  const columns = [
    {
      title: 'Attacker',
      dataIndex: ['attacker', 'nameTag'],
      key: 'attacker',
      sorter: (a: any, b: any) => a.attacker.nameTag.localeCompare(b.attacker.nameTag),
    }, 
    {
      title: 'Defender',
      dataIndex: ['defender', 'nameTag'],
      key: 'defender',
      sorter: (a: any, b: any) => a.defender.nameTag.localeCompare(b.defender.nameTag),
    },
    {
      title: 'Won',
      dataIndex: 'won',
      key: 'won',
      sorter: (a:any, b:any) => a.won - b.won,
    },
    {
      title: 'Lost',
      dataIndex: 'lost',
      key: 'lost',
      sorter: (a:any, b:any) => a.lost - b.lost,
    }
  ];


  return (
    <div className="App">
      <Table dataSource={data} columns={columns} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
    </div>
  );
}


export default TeamTable;
