import React, { useState, useEffect } from 'react';
import { Modal, Table, Checkbox } from 'antd';
import { deletePermissions, getAllPermission, getUserPermissions, updatePermissions } from '../../service/api.service';

const PermissionModal = React.memo(({ id, open, onClose }) => {
    const [permissions, setPermissions] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);

    
    useEffect(() => {
        if (id && open) {
            loadPermissionsWithUser(id); 
        }
    }, [id, open]);
    
    const loadPermissionsWithUser = async(id) => {
        try {
            const [allPermissionsRes, userPermissionsRes] = await Promise.all([
                getAllPermission(),
                getUserPermissions(id)
            ]);
    
            const allPermissions = allPermissionsRes.data.map(item => ({
                id: item.id,
                action: item.name,
                staff: false,
            }));
    
            const userPermissions = userPermissionsRes.data.map(item => item.name);
    
            const formattedPermissions = allPermissions.map(permission => ({
                ...permission,
                staff: userPermissions.includes(permission.action),
            }));
            setPermissions(formattedPermissions);
            setUserPermissions(userPermissions);
        } catch (error) {
            console.error("Failed to load permissions:", error);
        }
    }

    const handleCheckboxChange = (action, checked) => {
        setPermissions(prevState =>
            prevState.map(item =>
                item.action === action ? { ...item, staff: checked } : item
            )
        );
    };

    const handleOk = async () => {
        const permissionsToAdd = permissions
            .filter(permission => permission.staff && !userPermissions.includes(permission.action))
            .map(permission => permission.id);

        const permissionsToRemove = userPermissions
            .filter(userPermission => {
                return !permissions.find(p => p.action === userPermission && p.staff);
            })
            .map(userPermission => {
                const foundPermission = permissions.find(p => p.action === userPermission);
                return foundPermission ? foundPermission.id : null;
            })
            .filter(id => id !== null);


        try {
            const promises = [];

            if (permissionsToAdd.length > 0) {
                promises.push(updatePermissions(id, { permissionIds: permissionsToAdd }));
            }
            if (permissionsToRemove.length > 0) {
                promises.push(deletePermissions(id, { permissionIds: permissionsToRemove }));
            }

            await Promise.all(promises);
        } catch (error) {
            console.error("Failed to update permissions:", error);
        }

        onClose();
    }

    // Tạo nhóm dữ liệu với tiêu đề
    const groupData = [
        {
            key: 'permitionGroup',
            action: 'Permission',
            staff: null,
        },
        ...permissions.filter(item => item.action.includes('PERMITION')),
        {
            key: 'userGroup',
            action: 'User',
            staff: null,
        },
        ...permissions.filter(item => item.action.includes('USER')),
    ];

    return (
        <Modal
            title="Manage Permissions"
            open={open}
            maskClosable={false}
            onCancel={onClose}
            onOk={handleOk}
        >
            <Table
                dataSource={groupData}
                pagination={false}
                rowKey="key"
            >
                <Table.Column
                    title="Action"
                    dataIndex="action"
                    render={(text, record) => (
                        record.key && (record.key === 'permitionGroup' || record.key === 'userGroup') ? (
                            <strong>{text}</strong>
                        ) : (
                            text
                        )
                    )}
                />
                <Table.Column
                    title="Staff"
                    render={(text, record) => (
                        record.key && (record.key === 'permitionGroup' || record.key === 'userGroup') ? null : (
                            <Checkbox
                                checked={record.staff}
                                onChange={e => handleCheckboxChange(record.action, e.target.checked)}
                            />
                        )
                    )}
                />
            </Table>
        </Modal>
    );
});

export default PermissionModal;
