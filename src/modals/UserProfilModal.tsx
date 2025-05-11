import { Button, Modal, Tabs, TabsProps } from 'antd'
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
                    <p><strong>Name:</strong> {userName}</p>
                    <Button variant='solid' color='danger' onClick={UserService.changePassword}>Change Password</Button>
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