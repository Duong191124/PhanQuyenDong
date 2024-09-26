import { Table } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PermissionModal from '../permission/permission.modal';
import { useState } from 'react';


const UserTable = (props) => {
    const { dataUsers, loadUser } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();

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
            <PermissionModal
                userId={selectedUserId}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

export default UserTable;