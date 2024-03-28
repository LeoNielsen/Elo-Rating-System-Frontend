import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { createPlayer, getAllPlayers } from "../API/Api";
import { Player } from "../Types/Types";

function NewPlayerModal({ modalVisible, setModalVisible }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { isLoading, data, refetch } = useQuery("Players", getAllPlayers);

    const { mutateAsync: createPlayerMutation } = useMutation(createPlayer);

    const [isNameValidated, setIsNameValidated] = useState(false)
    const [hasFeedback, setHasFeedback] = useState(false)
    const [isNameTaken, setIsNameTaken] = useState(false)

    const [form] = Form.useForm();

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const nameValidation = (e: any) => {
        setIsNameValidated(false);
        const inputValue = e.target.value.toUpperCase();
        if (inputValue.length > 0) {
            setHasFeedback(true);
        } else {
            setHasFeedback(false)
        }

        const isNameTaken = data && data.some((player: Player) => player.nameTag.toUpperCase() === inputValue);
        setIsNameTaken(isNameTaken);
        setTimeout(() => {
            setIsNameValidated(true);
        }, 1000)
    };

    const onFinish = async () => {
        await createPlayerMutation(
            { nameTag: form.getFieldValue("NameTag") }
        )
        refetch()
        form.resetFields()
        setModalVisible(false)
    }

    return (
        <Modal
            title="New Player"
            open={modalVisible}
            onCancel={handleModalCancel}
            footer={null}
        >
            {isLoading ? (<></>) : (<Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Name Tag" name="NameTag" rules={[{ required: true, message: 'Please input!' }]} validateStatus={hasFeedback ? (isNameValidated ? (isNameTaken ? "error" : "success") : "validating") : ""} hasFeedback >
                    <Input onChange={nameValidation} type="text" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isNameTaken || !isNameValidated}>Submit</Button>
                </Form.Item>
            </Form>)}
        </Modal>
    );

}

export default NewPlayerModal;