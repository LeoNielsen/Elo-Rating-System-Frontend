import { useQuery } from "react-query";
import { getAllPlayers } from "../API/Api";
import { Player } from "../Types/Types";
import { Button, Col, Form, Row, Select, Typography } from "antd";
import { useState } from "react";

function MatchRandomizer() {

    const { isLoading, data } = useQuery<Player[]>("Players", getAllPlayers);

    const [form] = Form.useForm();
    const [teams, setTeams] = useState<{ red: Player[]; blue: Player[] } | null>(null);
    const [filteredOptions, setFilteredOptions] = useState<{ [key: string]: Player[] }>({});


    const handleSearch = (value: string, field: string) => {
        if (!data) return;
        setFilteredOptions((prev) => ({
            ...prev,
            [field]: data.filter((player: Player) => player.nameTag.toLowerCase().includes(value.toLowerCase()))
        }));
    };

    // Handle selection of a player
    const handleSelect = (value: string, field: string) => {
        if (!data) return;
        setFilteredOptions((prev) => ({
            ...prev,
            [field]: data.filter((player: Player) => player.nameTag === value)
        }));
    };

    // Automatically select the top result on blur
    const handleBlur = (field: string, solo: boolean) => {
        const checkForm = form;
        if (filteredOptions[field]?.length > 0) {
            checkForm.setFieldValue(field, filteredOptions[field][0].nameTag);
        }
    };

    if (isLoading) {
        return <></>
    }

    const options = data?.map((player: Player) => ({
        value: player.nameTag,
        label: player.nameTag
    }));

    const onFinish = async () => {
        const playerNames = [
            form.getFieldValue("player1"),
            form.getFieldValue("player2"),
            form.getFieldValue("player3"),
            form.getFieldValue("player4"),
        ];
        if (!data) return;
        const selectedPlayers = data.filter((player) => playerNames.includes(player.nameTag));
        const shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);
        setTeams({
            red: [shuffled[0], shuffled[1]],
            blue: [shuffled[2], shuffled[3]],
        });
    };


    return (
        <>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <Form.Item name="player1" rules={[{ required: true, message: "Please select!" }]}>
                                    <Select showSearch optionFilterProp="label" options={options}
                                        onSearch={(value) => handleSearch(value, "player1")}
                                        onBlur={() => handleBlur("player1", true)}
                                        onSelect={(value => handleSelect(value, "player1"))}
                                        placeholder="player 1" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="player2" rules={[{ required: true, message: "Please select!" }]}>
                                    <Select showSearch optionFilterProp="label" options={options}
                                        onSearch={(value) => handleSearch(value, "player2")}
                                        onBlur={() => handleBlur("player2", true)}
                                        onSelect={(value => handleSelect(value, "player2"))}
                                        placeholder="player 2" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="player3" rules={[{ required: true, message: "Please select!" }]}>
                                    <Select showSearch optionFilterProp="label" options={options}
                                        onSearch={(value) => handleSearch(value, "player3")}
                                        onBlur={() => handleBlur("player3", true)}
                                        onSelect={(value => handleSelect(value, "player3"))}
                                        placeholder="player 3" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="player4" rules={[{ required: true, message: "Please select!" }]}>
                                    <Select showSearch optionFilterProp="label" options={options}
                                        onSearch={(value) => handleSearch(value, "player4")}
                                        onBlur={() => handleBlur("player4", true)}
                                        onSelect={(value => handleSelect(value, "player4"))}
                                        placeholder="player 4" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Randomize</Button>
                </Form.Item>
            </Form>
            {teams && teams.red && teams.blue && (
                <>
                    <Typography.Title level={2} style={{ textAlign: "center" }}>Red Team & Blue Team</Typography.Title>
                    <Row gutter={[16, 16]} align="middle" justify="center">
                        <Col span={10} style={{ textAlign: "right" }}>
                            {teams.red.map((player) => (
                                player && <Typography.Title key={player.nameTag} level={4} style={{ display: "block" }}>{player.nameTag}</Typography.Title>
                            ))}
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                            <Typography.Title level={3}>VS</Typography.Title>
                        </Col>
                        <Col span={10} style={{ textAlign: "left" }}>
                            {teams.blue.map((player) => (
                                player && <Typography.Title key={player.nameTag} level={4} style={{ display: "block" }}>{player.nameTag}</Typography.Title>
                            ))}
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default MatchRandomizer