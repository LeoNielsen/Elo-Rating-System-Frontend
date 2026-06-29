import { useQuery } from 'react-query';
import { Table, Tabs, TabsProps } from 'antd';
import { getAllPairTeams } from '../API/Api';
import { TeamPair } from '../Types/Types';
import TeamStatisticsModal from '../modals/TeamStatisticsModal';
import { useState } from 'react';

function TeamTable() {

  const [modalVisible, setModalVisible] = useState(false);
  const [rowId, setRowId] = useState(NaN);
  const { isLoading, data } = useQuery<TeamPair[]>("teams", getAllPairTeams);

  const handleRowClick = (record: TeamPair) => {
    setModalVisible(true);
    setRowId(record.id)
  };

  const columns = [
    {
      title: 'Player',
      dataIndex: 'playerA',
      key: 'playerA',
      sorter: (a: TeamPair, b: TeamPair) => a.playerA.localeCompare(b.playerA),
    },
    {
      title: 'Player',
      dataIndex: 'playerB',
      key: 'playerB',
      sorter: (a: TeamPair, b: TeamPair) => a.playerB.localeCompare(b.playerB),
    },
    {
      title: 'Total Games',
      dataIndex: 'totalGames',
      key: 'totalGames',
      sorter: (a: TeamPair, b: TeamPair) => (a.won + a.lost) - (b.won + b.lost),
      render: (_: any, record: TeamPair) => record.won + record.lost,
    },
    {
      title: 'Won',
      dataIndex: 'won',
      key: 'won',
      sorter: (a: TeamPair, b: TeamPair) => a.won - b.won,
    },
    {
      title: 'Lost',
      dataIndex: 'lost',
      key: 'lost',
      sorter: (a: TeamPair, b: TeamPair) => a.lost - b.lost,
    },
    {
      title: 'Goals',
      dataIndex: 'goals',
      key: 'goals',
      sorter: (a: TeamPair, b: TeamPair) => a.goals - b.goals,
    }
  ];

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: 'Teams',
      children: <Table
        dataSource={data}
        columns={columns}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 20,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        scroll={{ x: 350 }}
        rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''}
        bordered={true}
        loading={isLoading} />

    },
  ]

  return (
    <div className="App">
      <Tabs items={tabs} defaultActiveKey='1' />
      {modalVisible && (<TeamStatisticsModal modalVisible={modalVisible} setModalVisible={setModalVisible} teamId={rowId} />)}
    </div>
  );
}


export default TeamTable;
