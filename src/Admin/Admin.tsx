import React, { useState } from 'react';
import { Button, Card, Space, Modal, message, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import {
  deactivatePlayer,
  getAdminTest,
  regenerateMonthlyPlayerStats,
  regeneratePlayerStats,
  regenerateSoloPlayerStats,
  regenerateTeamStats,
} from '../API/Api';

const { confirm } = Modal;

const Admin = () => {
  const [playerName, setPlayerName] = useState('');

  const deactivatePlayerMutation = useMutation(deactivatePlayer, {
    onSuccess: () => {
      message.success('Player status updated successfully!');
      setPlayerName('');
    },
    onError: () => {
      message.error('Failed to update player status.');
    },
  });

  const regeneratePlayerStatsMutation = useMutation(regeneratePlayerStats);
  const regenerateTeamStatsMutation = useMutation(regenerateTeamStats);
  const regenerateSoloPlayerStatsMutation = useMutation(regenerateSoloPlayerStats);
  const regenerateMonthlyPlayerStatsMutation = useMutation(regenerateMonthlyPlayerStats);

  const { data } = useQuery<string>('test', getAdminTest);

  const isAnyLoading =
    regeneratePlayerStatsMutation.isLoading ||
    regenerateTeamStatsMutation.isLoading ||
    regenerateSoloPlayerStatsMutation.isLoading ||
    regenerateMonthlyPlayerStatsMutation.isLoading ||
    deactivatePlayerMutation.isLoading;

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

  const handleDeactivate = () => {
    if (!playerName.trim()) {
      message.warning('Please enter a player name before continuing.');
      return;
    }

    showConfirm(`Deactivate or activate player "${playerName}"?`, () => {
      deactivatePlayerMutation.mutate(playerName);
    });
  };

  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <Card title="Admin Controls" style={{ width: 400, textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 🔹 Test Admin */}
          <Button
            variant="solid"
            color="green"
            block
            onClick={() => {
              data
                ? message.success('Admin Connection!')
                : message.error('No Admin Connection');
            }}
          >
            Test Admin
          </Button>

          {/* 🔹 Regeneration Controls */}
          <Button
            variant="solid"
            color="orange"
            block
            disabled={isAnyLoading}
            loading={regeneratePlayerStatsMutation.isLoading}
            onClick={() =>
              showConfirm('Regenerate player stats?', () =>
                regeneratePlayerStatsMutation.mutate()
              )
            }
          >
            Regenerate 2v2 Stats
          </Button>



          <Button
            variant="solid"
            color="orange"
            block
            disabled={isAnyLoading}
            loading={regenerateSoloPlayerStatsMutation.isLoading}
            onClick={() =>
              showConfirm('Regenerate solo player stats?', () =>
                regenerateSoloPlayerStatsMutation.mutate()
              )
            }
          >
            Regenerate 1v1 Stats
          </Button>

          <Button
            variant="solid"
            color="orange"
            block
            disabled={isAnyLoading}
            loading={regenerateTeamStatsMutation.isLoading}
            onClick={() =>
              showConfirm('Regenerate team stats?', () =>
                regenerateTeamStatsMutation.mutate()
              )
            }
          >
            Regenerate Team Stats
          </Button>

          <Button
            variant="solid"
            color="orange"
            block
            disabled={isAnyLoading}
            loading={regenerateMonthlyPlayerStatsMutation.isLoading}
            onClick={() =>
              showConfirm('Regenerate monthly player stats?', () =>
                regenerateMonthlyPlayerStatsMutation.mutate()
              )
            }
          >
            Regenerate Monthly Stats
          </Button>

          <Card
            size="small"
            title="Activate / Deactivate Player"
            style={{ width: '100%', borderColor: '#ff4d4f' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="Enter player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                disabled={isAnyLoading}
              />
              <Button
                type="primary"
                danger
                block
                disabled={isAnyLoading}
                loading={deactivatePlayerMutation.isLoading}
                onClick={handleDeactivate}
              >
                Deactivate / Activate Player
              </Button>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default Admin;
