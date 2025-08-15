import { useQuery } from 'react-query';
import { Button, Table, Tabs, TabsProps } from 'antd';
import '../Style.css'
import { getAllPlayers } from '../API/Api';
import { useState } from 'react';
import NewPlayerModal from '../modals/NewPlayerModal';
import { Player } from '../Types/Types';
import PlayerCombinedStatisticsModal from '../modals/PlayerCombinedStatisticsModal';

function PlayerTable() {

  const { isLoading, data } = useQuery<Player[]>("Players", getAllPlayers);


  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatisticsVisible, setModalStatisticsVisible] = useState(false);
  const [rowId, setRowId] = useState(NaN);

  const handleNewPlayerClick = () => {
    setModalVisible(true);
  };

  const handleRowClick = (record: Player) => {
    setModalStatisticsVisible(true);
    setRowId(record.id)
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'nameTag',
      key: 'name',
      sorter: (a: Player, b: Player) => a.nameTag.localeCompare(b.nameTag),
    },
    {
      title: 'Rating 2v2',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: Player, b: Player) => a.rating - b.rating,
    },
    {
      title: 'Rating 1v1',
      dataIndex: 'soloRating',
      key: 'soloRating',
      sorter: (a: Player, b: Player) => a.soloRating - b.soloRating,
    }
  ];

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: 'Players',
      children: <Table dataSource={data}
        columns={columns}
        scroll={{ x: 350 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''}
        bordered={true}
        loading={isLoading} />
    },
  ]

  return (
    <div className="App">
      <Tabs
        items={tabs}
        defaultActiveKey="1"
        tabBarExtraContent={
          <Button type="primary" onClick={handleNewPlayerClick}>
            New Player
          </Button>
        }
      />
      <NewPlayerModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      {modalStatisticsVisible && <PlayerCombinedStatisticsModal modalVisible={modalStatisticsVisible} setModalVisible={setModalStatisticsVisible} playerId={rowId} />}
    </div>

  );
}

export default PlayerTable;