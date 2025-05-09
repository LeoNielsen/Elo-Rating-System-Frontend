import React from 'react';
import { Button, Card, Space, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { deleteLatestMatch, deleteLatestSoloMatch, getAdminTest } from '../API/Api'

const { confirm } = Modal;

const Admin = () => {
  const deleteMatchMutation = useMutation(deleteLatestMatch);

  const deleteSoloMatchMutation = useMutation(deleteLatestSoloMatch);

  const { data } = useQuery<String>("test", getAdminTest);

  const showConfirm = (title: string, onConfirm: () => void) => {
    confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to do this? This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: onConfirm,
    });
  };

  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <Card title="Admin Controls" style={{ width: 400, textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            variant="solid"
            color='green'
            block
            onClick={() => {
              data ? message.success("Admin Connection!") : message.error("No Admin Connection");
            }}
          >
            Test Admin
          </Button>
          <Button
            type="primary"
            danger
            block
            loading={deleteMatchMutation.isLoading}
            onClick={() => showConfirm('Delete latest match?', () => deleteMatchMutation.mutate())}
          >
            Delete Latest Match
          </Button>
          <Button
            type="primary"
            danger
            block
            loading={deleteSoloMatchMutation.isLoading}
            onClick={() =>
              showConfirm('Delete latest solo match?', () => deleteSoloMatchMutation.mutate())
            }
          >
            Delete Latest Solo Match
          </Button>
        </Space>
      </Card>
    </div >
  );
};

export default Admin;
