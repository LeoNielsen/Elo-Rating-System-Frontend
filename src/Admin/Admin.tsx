import React from 'react';
import { Button, Card, Space, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { deleteLatestMatch, deleteLatestSoloMatch, getAdminTest, regenerateMonthlyPlayerStats, regeneratePlayerStats, regenerateSoloPlayerStats } from '../API/Api'

const { confirm } = Modal;

const Admin = () => {
  const deleteMatchMutation = useMutation(deleteLatestMatch);
  const deleteSoloMatchMutation = useMutation(deleteLatestSoloMatch);
  const regeneratePlayerStatsMutation = useMutation(regeneratePlayerStats);
  const regenerateSoloPlayerStatsMutation = useMutation(regenerateSoloPlayerStats);
  const regenerateMonthlyPlayerStatsMutation = useMutation(regenerateMonthlyPlayerStats);


  const { data } = useQuery<String>("test", getAdminTest);

  const isAnyLoading =
    regeneratePlayerStatsMutation.isLoading ||
    regenerateSoloPlayerStatsMutation.isLoading ||
    regenerateMonthlyPlayerStatsMutation.isLoading ||
    deleteMatchMutation.isLoading ||
    deleteMatchMutation.isLoading

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
            variant='solid'
            color='orange'
            block
            disabled={isAnyLoading}

            loading={regeneratePlayerStatsMutation.isLoading}
            onClick={() => showConfirm('Regenerate player stats??', () => regeneratePlayerStatsMutation.mutate())}
          >
            Regenerate 2v2 Stats
          </Button>
          <Button
            variant='solid'
            color='orange'
            block
            disabled={isAnyLoading}
            loading={regenerateSoloPlayerStatsMutation.isLoading}
            onClick={() => showConfirm('Regenerate solo player stats?', () => regenerateSoloPlayerStatsMutation.mutate())}
          >
            Regenerate 1v1 Stats
          </Button>
          <Button
            variant='solid'
            color='orange'
            block
            disabled={isAnyLoading}
            loading={regenerateMonthlyPlayerStatsMutation.isLoading}
            onClick={() => showConfirm('Regenerate monthly player stats?', () => regenerateMonthlyPlayerStatsMutation.mutate())}
          >
            Regenerate Monthly Stats
          </Button>
          <Button
            type="primary"
            danger
            block
            disabled={isAnyLoading}
            loading={deleteMatchMutation.isLoading}
            onClick={() => showConfirm('Delete latest match?', () => deleteMatchMutation.mutate())}
          >
            Delete Latest 2v2 Match
          </Button>
          <Button
            type="primary"
            danger
            block
            disabled={isAnyLoading}
            loading={deleteSoloMatchMutation.isLoading}
            onClick={() =>
              showConfirm('Delete latest solo match?', () => deleteSoloMatchMutation.mutate())
            }
          >
            Delete Latest 1v1 Match
          </Button>
        </Space>
      </Card>
    </div >
  );
};

export default Admin;
