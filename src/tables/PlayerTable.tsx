import { useQuery } from 'react-query';
import { Button, Table } from 'antd';
import '../Style.css'
import { getAllPlayers } from '../API/Api';
import { useState } from 'react';
import NewPlayerModal from '../modals/NewPlayerModal';

function PlayerTable() {

  const { isLoading, data } = useQuery("Players", getAllPlayers);

  const [modalVisible, setModalVisible] = useState(false);

  const handleNewPlayerClick = () => {
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'nameTag',
      key: 'name',
      sorter: (a: any, b: any) => a.nameTag.localeCompare(b.nameTag),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: { rating: number; }, b: { rating: number; }) => a.rating - b.rating,
    }
  ];


  return (
    <div className="App">
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={handleNewPlayerClick}>
          New Player
        </Button>
      </div>
      <Table dataSource={data} columns={columns} rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''} bordered={true} loading={isLoading} />
      <NewPlayerModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </div>

  );
}


export default PlayerTable;
