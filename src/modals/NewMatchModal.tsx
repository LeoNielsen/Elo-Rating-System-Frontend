import { Modal, Form, Input, Select, Typography, Button, Row, Col, Tabs, TabsProps, message } from 'antd';
import { createMatch, createSoloMatch, getAllPlayers, updateMatchById, updateSoloMatchById } from '../API/Api';
import { useMutation, useQuery } from 'react-query'
import { Match, Player, SoloMatch } from '../Types/Types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function NewMatchModal({ modalVisible, setModalVisible, refetch, soloRefetch, activeTab, mode, matchToEdit }:
  { modalVisible: boolean, setModalVisible: Dispatch<SetStateAction<boolean>>, refetch: any, soloRefetch: any, activeTab: string, mode: "create" | "update", matchToEdit?: Match | SoloMatch }) {

  const { data, isLoading } = useQuery("Players", getAllPlayers);

  const { mutateAsync: createMatchMutation } = useMutation({
    mutationFn: createMatch,
    onMutate: () => {
      message.loading({
        content: "Creating match...",
        key: "create",
        duration: 0
      });
    },

    onSuccess: () => {
      message.success({
        content: "Match created",
        key: "create"
      });
      refetch();
    },

    onError: () => {
      message.error({
        content: "Could not create match",
        key: "create"
      });
    }
  });

  const { mutateAsync: createSoloMatchMutation } = useMutation({
    mutationFn: createSoloMatch,
    onMutate: () => {
      message.loading({
        content: "Creating solo match...",
        key: "create",
        duration: 0
      });
    },

    onSuccess: () => {
      message.success({
        content: "Solo match created",
        key: "create"
      });
      soloRefetch();
    },

    onError: () => {
      message.error({
        content: "Could not create solo match",
        key: "create"
      });
    }
  });
  const { mutateAsync: updateMatchMutation } = useMutation({
    mutationFn: ({ id, matchData }: { id: number, matchData: any }) => updateMatchById(id, matchData),

    onMutate: () => {
      message.loading({
        content: "Updating match...",
        key: "update",
        duration: 0
      });
    },

    onSuccess: () => {
      message.success({
        content: "Match updated",
        key: "update"
      });
      refetch();
    },

    onError: () => {
      message.error({
        content: "Could not update match",
        key: "update"
      });
    }
  });


  const { mutateAsync: updateSoloMatchMutation } = useMutation({
    mutationFn: ({ id, matchData }: { id: number, matchData: any }) => updateSoloMatchById(id, matchData),
    onMutate: () => {
      message.loading({
        content: "Updating match...",
        key: "update",
        duration: 0
      });
    },
    onSuccess: () => {
      message.success({
        content: "Match updated",
        key: "update"
      });
      soloRefetch();
    },

    onError: () => {
      message.error({
        content: "Could not update match",
        key: "update"
      });
    }
  });



  const [form] = Form.useForm();
  const [soloForm] = Form.useForm();
  const [filteredOptions, setFilteredOptions] = useState<{ [key: string]: Player[] }>({});

  useEffect(() => {
    if (!data || mode !== "update" || !matchToEdit) return;

    // 2v2 MATCH
    if ("redAtk" in matchToEdit) {
      const redAtkId = data.find((p: Player) => p.nameTag === matchToEdit.redAtk)?.id;
      const redDefId = data.find((p: Player) => p.nameTag === matchToEdit.redDef)?.id;
      const blueAtkId = data.find((p: Player) => p.nameTag === matchToEdit.blueAtk)?.id;
      const blueDefId = data.find((p: Player) => p.nameTag === matchToEdit.blueDef)?.id;

      form.setFieldsValue({
        RedAttacker: redAtkId,
        RedDefender: redDefId,
        BlueAttacker: blueAtkId,
        BlueDefender: blueDefId,
        RedGoalScore: matchToEdit.redScore,
        BlueGoalScore: matchToEdit.blueScore
      });
    }

    // SOLO MATCH
    if ("redPlayer" in matchToEdit) {
      const redId = data.find((p: Player) => p.nameTag === matchToEdit.redPlayer)?.id;
      const blueId = data.find((p: Player) => p.nameTag === matchToEdit.bluePlayer)?.id;

      soloForm.setFieldsValue({
        Red: redId,
        Blue: blueId,
        RedGoalScore: matchToEdit.redScore,
        BlueGoalScore: matchToEdit.blueScore
      });
    }
  }, [mode, matchToEdit, data]);

  const getAvailableOptions = (field: string, solo: boolean) => {
  const checkForm = solo ? soloForm : form;
  const values = checkForm.getFieldsValue();

  const usedIds = Object.keys(values)
    .filter(key => key !== field) 
    .map(key => values[key])   
    .filter(Boolean);            

  return options.filter((opt : any ) => !usedIds.includes(opt.value));
};


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

    if (mode === "create") {
      await createMatchMutation({
        redAtkId: form.getFieldValue("RedAttacker"),
        redDefId: form.getFieldValue("RedDefender"),
        blueAtkId: form.getFieldValue("BlueAttacker"),
        blueDefId: form.getFieldValue("BlueDefender"),
        redScore: form.getFieldValue("RedGoalScore"),
        blueScore: form.getFieldValue("BlueGoalScore")
      })
    } else if (mode === "update" && matchToEdit) {
      await updateMatchMutation({
        id: matchToEdit!.id,
        matchData: {
          redAtkId: form.getFieldValue("RedAttacker"),
          redDefId: form.getFieldValue("RedDefender"),
          blueAtkId: form.getFieldValue("BlueAttacker"),
          blueDefId: form.getFieldValue("BlueDefender"),
          redScore: form.getFieldValue("RedGoalScore"),
          blueScore: form.getFieldValue("BlueGoalScore")
        }
      });
    }

    refetch()
    form.resetFields()
    soloForm.resetFields()
    setModalVisible(false)
  }

  const onFinishSolo = async () => {
    if (mode === "create") {
      await createSoloMatchMutation({
        redPlayerId: soloForm.getFieldValue("Red"),
        bluePlayerId: soloForm.getFieldValue("Blue"),
        redScore: soloForm.getFieldValue("RedGoalScore"),
        blueScore: soloForm.getFieldValue("BlueGoalScore")
      })
    } else if (mode === "update" && matchToEdit) {
      await updateSoloMatchMutation({
        id: matchToEdit!.id,
        matchData: {
          redPlayerId: soloForm.getFieldValue("Red"),
          bluePlayerId: soloForm.getFieldValue("Blue"),
          redScore: soloForm.getFieldValue("RedGoalScore"),
          blueScore: soloForm.getFieldValue("BlueGoalScore")
        }
      });
    }
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
              <Select showSearch optionFilterProp="label" options={getAvailableOptions("RedAttacker", false)}
                onSearch={(value) => handleSearch(value, "RedAttacker")}
                onBlur={() => handleBlur("RedAttacker", false)}
                onSelect={(value => handleSelect(value, "RedAttacker"))}
                placeholder="Red Attacker" />
            </Form.Item>
            <Form.Item label="Defender" name="RedDefender" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={getAvailableOptions("RedDefender", false)}
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
              <Select showSearch optionFilterProp="label" options={getAvailableOptions("BlueAttacker", false)}
                onSearch={(value) => handleSearch(value, "BlueAttacker")}
                onBlur={() => handleBlur("BlueAttacker", false)}
                onSelect={(value => handleSelect(value, "BlueAttacker"))}
                placeholder="Blue Attacker" />
            </Form.Item>
            <Form.Item label="Defender" name="BlueDefender" rules={[{ required: true, message: 'Please input!' }]}>
              <Select showSearch optionFilterProp="label" options={getAvailableOptions("BlueDefender", false)}
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
          <Button type="primary" htmlType="submit">
            {mode === "create" ? "Submit" : "Update Match"}
          </Button>
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
              <Select showSearch optionFilterProp="label" options={getAvailableOptions("Red", true)}
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
              <Select showSearch optionFilterProp="label" options={getAvailableOptions("Blue", true)}
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
          <Button type="primary" htmlType="submit">
            {mode === "create" ? "Submit" : "Update Match"}
          </Button>
        </Form.Item>
      </Form>
    }
  ]

  return (
    <Modal
      title={mode === "create" ? "New Match" : "Update Match"}
      open={modalVisible}
      onCancel={handleModalCancel}
      footer={null}
    >
      <Tabs items={tabs} defaultActiveKey={activeTab} onChange={handleTabChange} />
    </Modal>
  );
}

export default NewMatchModal;