import { Modal, Form, Input, Select, Typography, Button, Row, Col, Tabs, TabsProps } from 'antd';
import { createMatch, createSoloMatch, createTeam, getAllPlayers } from '../API/Api';
import { useMutation, useQuery } from 'react-query'
import { Player } from '../Types/Types';
import { useState } from 'react';

function NewMatchModal({ modalVisible, setModalVisible, refetch, soloRefetch, activeTab }:
  { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, refetch: any, soloRefetch: any, activeTab: string }) {

  const { data, isLoading } = useQuery("Players", getAllPlayers);

  const { mutateAsync: createMatchMutation } = useMutation(createMatch);
  const { mutateAsync: createSoloMatchMutation } = useMutation(createSoloMatch);


  const [form] = Form.useForm();
  const [soloForm] = Form.useForm();
  const [filteredOptions, setFilteredOptions] = useState<{ [key: string]: Player[] }>({});

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleSearch = (value: string, field: string) => {
    setFilteredOptions((prev) => ({
      ...prev,
      [field]: data.filter((player: Player) => player.nameTag.toLowerCase().includes(value.toLowerCase()))
    }));
  };

  // Handle selection of a player
  const handleSelect = (value: number, field: string) => {
    setFilteredOptions((prev) => ({
      ...prev,
      [field]: data.filter((player: Player) => player.id === value)
    }));
  };

  // Automatically select the top result on blur
  const handleBlur = (field: string, solo: boolean) => {
    const checkForm = solo ? soloForm : form;
    if (filteredOptions[field]?.length > 0) {
      checkForm.setFieldValue(field, filteredOptions[field][0].id);
    }
  };

  const handleTabChange = (key: string) => {
    if (key === '1') {
      soloForm.resetFields();
    } else {
      form.resetFields();
    }
  };

  const scoreHandler = (values: any, solo: boolean) => {
    const checkForm = solo ? soloForm : form;

    if (values.target.id === "RedGoalScore") {

      if (values.target.value >= 10) {
        checkForm.setFieldValue("RedGoalScore", 10)
        checkForm.setFieldValue("BlueGoalScore", 9)
      } else {
        checkForm.setFieldValue("BlueGoalScore", 10)
      }
    } else {
      if (values.target.value >= 10) {
        checkForm.setFieldValue("RedGoalScore", 9)
        checkForm.setFieldValue("BlueGoalScore", 10)
      } else {
        checkForm.setFieldValue("RedGoalScore", 10)
      }
    }
  };

  const onFinish = async () => {
    await createMatchMutation({
      redAtkId: form.getFieldValue("RedAttacker"),
      redDefId: form.getFieldValue("RedDefender"),
      blueAtkId: form.getFieldValue("BlueAttacker"),
      blueDefId: form.getFieldValue("BlueDefender"),
      redScore: form.getFieldValue("RedGoalScore"),
      blueScore: form.getFieldValue("BlueGoalScore")
    })

    refetch()
    form.resetFields()
    soloForm.resetFields()
    setModalVisible(false)
  }

  const onFinishSolo = async () => {
    await createSoloMatchMutation({
      redPlayerId: soloForm.getFieldValue("Red"),
      bluePlayerId: soloForm.getFieldValue("Blue"),
      redScore: soloForm.getFieldValue("RedGoalScore"),
      blueScore: soloForm.getFieldValue("BlueGoalScore")
    })

    soloRefetch()
    form.resetFields()
    soloForm.resetFields()
    setModalVisible(false)
  }

  if (isLoading) {
    return <></>
  }

  const options = data.map((player: Player) => ({
    value: player.id,
    label: player.nameTag
  }));

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: '2v2',
      children: <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Typography.Title level={5}>Red Team</Typography.Title>
            <Form.Item label="Attacker" name="RedAttacker" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={options}
                onSearch={(value) => handleSearch(value, "RedAttacker")}
                onBlur={() => handleBlur("RedAttacker", false)}
                onSelect={(value => handleSelect(value, "RedAttacker"))}
                placeholder="Red Attacker" />
            </Form.Item>
            <Form.Item label="Defender" name="RedDefender" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={options}
                onSearch={(value) => handleSearch(value, "RedDefender")}
                onBlur={() => handleBlur("RedDefender", false)}
                onSelect={(value => handleSelect(value, "RedDefender"))}
                placeholder="Red Defender" />
            </Form.Item>
            <Form.Item label="Goal Score" name="RedGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
              <Input type="number" min={0} max={10} onChange={(value) => scoreHandler(value, false)} placeholder='Red Score' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Typography.Title level={5}>Blue Team</Typography.Title>
            <Form.Item label="Attacker" name="BlueAttacker" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={options}
                onSearch={(value) => handleSearch(value, "BlueAttacker")}
                onBlur={() => handleBlur("BlueAttacker", false)}
                onSelect={(value => handleSelect(value, "BlueAttacker"))}
                placeholder="Blue Attacker" />
            </Form.Item>
            <Form.Item label="Defender" name="BlueDefender" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={options}
                onSearch={(value) => handleSearch(value, "BlueDefender")}
                onBlur={() => handleBlur("BlueDefender", false)}
                onSelect={(value => handleSelect(value, "BlueDefender"))}
                placeholder="Blue Defender" />
            </Form.Item>
            <Form.Item id='BlueGoalScore' label="Goal Score" name="BlueGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
              <Input type="number" min={0} max={10} onChange={(value) => scoreHandler(value, false)} placeholder='Blue Score' />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>,
    }, {
      key: '2',
      label: '1v1',
      children: <Form form={soloForm} layout="vertical" onFinish={onFinishSolo}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Typography.Title level={5}>Red</Typography.Title>
            <Form.Item label="Red Player" name="Red" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={options}
                onSearch={(value) => handleSearch(value, "Red")}
                onBlur={() => handleBlur("Red", true)}
                onSelect={(value => handleSelect(value, "Red"))}
                placeholder="Red Player" />
            </Form.Item>
            <Form.Item label="Goal Score" name="RedGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
              <Input type="number" min={0} max={10} onChange={(value) => scoreHandler(value, true)} placeholder='Red Score' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Typography.Title level={5}>Blue</Typography.Title>
            <Form.Item label="Blue Player" name="Blue" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={options}
                onSearch={(value) => handleSearch(value, "Blue")}
                onBlur={() => handleBlur("Blue", true)}
                onSelect={(value => handleSelect(value, "Blue"))}
                placeholder="Blue Player" />
            </Form.Item>
            <Form.Item id='BlueGoalScore' label="Goal Score" name="BlueGoalScore" rules={[{ required: true, message: 'Please input!' }]}>
              <Input type="number" min={0} max={10} onChange={(value) => scoreHandler(value, true)} placeholder='Blue Score' />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    }
  ]

  return (
    <Modal
      title="New Match"
      open={modalVisible}
      onCancel={handleModalCancel}
      footer={null}
    >
      <Tabs items={tabs} defaultActiveKey={activeTab} onChange={handleTabChange} />
    </Modal>
  );
}

export default NewMatchModal;