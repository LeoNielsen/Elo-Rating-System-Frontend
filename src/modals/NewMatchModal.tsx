import { Modal, Form, Input, Select, Typography, Button, Row, Col, Tabs } from 'antd';
import { createMatch, createTeam, getAllPlayers } from '../API/Api';
import { useMutation, useQuery } from 'react-query'
import { Player } from '../Types/Types';

function NewMatchModal({ modalVisible, setModalVisible, refetch }:
  { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, refetch: any }) {

  const { data, isLoading } = useQuery("Players", getAllPlayers);

  const { mutateAsync: createTeamMutation } = useMutation(createTeam);
  const { mutateAsync: createMatchMutation } = useMutation(createMatch);

  const [form] = Form.useForm();

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const scoreHandler = (values: any) => {
    if (values.target.id === "RedGoalScore") {

      if (values.target.value >= 10) {
        form.setFieldValue("RedGoalScore", 10)
        form.setFieldValue("BlueGoalScore", 9)
      } else {
        form.setFieldValue("BlueGoalScore", 10)
      }
    } else {
      if (values.target.value >= 10) {
        form.setFieldValue("RedGoalScore", 9)
        form.setFieldValue("BlueGoalScore", 10)
      } else {
        form.setFieldValue("RedGoalScore", 10)
      }
    }
  };

  const onFinish = async () => {
    const redTeam = await createTeamMutation({
      attackerId: form.getFieldValue("RedAttacker"),
      defenderId: form.getFieldValue("RedDefender")
    });
    const blueTeam = await createTeamMutation({
      attackerId: form.getFieldValue("BlueAttacker"),
      defenderId: form.getFieldValue("BlueDefender")
    });
    const match = await createMatchMutation({
      redTeamId: redTeam.id,
      blueTeamId: blueTeam.id,
      redTeamScore: form.getFieldValue("RedGoalScore"),
      blueTeamScore: form.getFieldValue("BlueGoalScore")
    })

    refetch()
    form.resetFields()
    setModalVisible(false)
  }

  if (isLoading) {
    return <></>
  }

  const options = data.map((player: Player) => ({
    value: player.id,
    label: player.nameTag
  }));

  return (
    <Modal
      title="New Match"
      open={modalVisible}
      onCancel={handleModalCancel}
      footer={null}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="2v2" key="1">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Typography.Title level={5}>Red Team</Typography.Title>
                <Form.Item label="Attacker" name="RedAttacker" rules={[{ required: true, message: 'Please input!' }]}>
                  <Select showSearch optionFilterProp="label" options={options} placeholder="Red Attacker" />
                </Form.Item>
                <Form.Item label="Defender" name="RedDefender" rules={[{ required: true, message: 'Please input!' }]}>
                  <Select showSearch optionFilterProp="label" options={options} placeholder="Red Defender" />
                </Form.Item>
                <Form.Item label="Goal Score" name="RedGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input type="number" min={0} max={10} onChange={scoreHandler} placeholder='Red Score' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Typography.Title level={5}>Blue Team</Typography.Title>
                <Form.Item label="Attacker" name="BlueAttacker" rules={[{ required: true, message: 'Please input!' }]}>
                  <Select showSearch optionFilterProp="label" options={options} placeholder="Blue Attacker" />
                </Form.Item>
                <Form.Item label="Defender" name="BlueDefender" rules={[{ required: true, message: 'Please input!' }]}>
                  <Select showSearch optionFilterProp="label" options={options} placeholder="Blue Defender" />
                </Form.Item>
                <Form.Item id='BlueGoalScore' label="Goal Score" name="BlueGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input type="number" min={0} max={10} onChange={scoreHandler} placeholder='Blue Score' />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="1v1" key="2">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Typography.Title level={5}>Red Team</Typography.Title>
                <Form.Item label="Red" name="Red" rules={[{ required: true, message: 'Please input!' }]}>
                  <Select showSearch optionFilterProp="label" options={options} placeholder="Red Player" />
                </Form.Item>
                <Form.Item label="Goal Score" name="RedGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input type="number" min={0} max={10} onChange={scoreHandler} placeholder='Red Score' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Typography.Title level={5}>Blue Team</Typography.Title>
                <Form.Item label="Blue" name="Blue" rules={[{ required: true, message: 'Please input!' }]}>
                  <Select showSearch optionFilterProp="label" options={options} placeholder="Blue Player" />
                </Form.Item>
                <Form.Item id='BlueGoalScore' label="Goal Score" name="BlueGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input type="number" min={0} max={10} onChange={scoreHandler} placeholder='Blue Score' />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default NewMatchModal;