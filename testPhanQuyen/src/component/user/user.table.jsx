import { Table } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import React, { Suspense } from 'react';
import { useState } from 'react';

const PermissionModal = React.lazy(() => import('../permission/permission.modal'));

const UserTable = React.memo((props) => {
    const { dataUsers, loadUser } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'userName',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px" }}>
                    <KeyOutlined
                        onClick={() => {
                            setSelectedUserId(record.id);
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            ),
        }
    ];


    return (
        <>
            <Table
                columns={columns}
                dataSource={dataUsers}
                rowKey="id"
            />
            <Suspense fallback={<div>Loading...</div>}>
                <PermissionModal
                    id={selectedUserId}
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </Suspense>
        </>
    )
})

export default UserTable;