import { Button, Descriptions, Divider, Modal, Tabs, TabsProps } from 'antd'
import React, { useState } from 'react'
import UserService from '../Keycloak/UserService';

function UserProfilModal({ modalVisible, setModalVisible, userName }:
    { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, userName: string }) {

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Generel',
            children:
                <>
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Name">{userName}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Button type="primary" danger onClick={UserService.changePassword}>
                        Change Password
                    </Button>
                </>
        }, {
            key: '2',
            label: 'Bagde'

        }
    ]

    return (
        <Modal
            title={`Hello ${userName}`}
            open={modalVisible}
            onCancel={handleModalCancel}
            footer={null}
        >

            <Tabs items={tabs} />
        </Modal>
    )
}

export default UserProfilModal