import React, { useState, useEffect, useRef } from 'react';
import { Modal, Table, Checkbox } from 'antd';
import { getAllPermission, getUserPermissions, updatePermissions } from '../../service/api.service';

const PermissionModal = React.memo(({ id, open, onClose }) => {
    const [permissions, setPermissions] = useState([]); 
    const [userPermissions, setUserPermissions] = useState([]); 
    const [initialized, setInitialized] = useState(false); 
    const allPermissionsRef = useRef([]); // Lưu tất cả quyền để không cần gọi lại API

    useEffect(() => {
        if (open && !initialized) {
            loadAllPermissions();
        }

        if (id && open) {
            loadUserPermissions(id);
        }
    }, [id, open]);

    const loadAllPermissions = async () => {
        try {
            const allPermissionsRes = await getAllPermission();
            const allPermissions = allPermissionsRes.data.map(item => ({
                id: item.id,
                action: item.name,
                staff: false, 
            }));
            setPermissions(allPermissions);  
            allPermissionsRef.current = allPermissions;
            setInitialized(true); 
        } catch (error) {
            console.error("Failed to load all permissions:", error);
        }
    };

    const loadUserPermissions = async (id) => {
        try {
            const userPermissionsRes = await getUserPermissions(id);
            const userPermissions = userPermissionsRes.data.map(item => item.name);
            
            // Update trạng thái checked cho các quyền dựa trên userPermissions
            const updatedPermissions = allPermissionsRef.current.map(permission => ({
                ...permission,
                staff: userPermissions.includes(permission.action), 
            }));

            setPermissions(updatedPermissions);  
            setUserPermissions(userPermissions); 
        } catch (error) {
            console.error("Failed to load user permissions:", error);
        }
    };

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
            .filter(userPermission => 
                !permissions.find(p => p.action === userPermission && p.staff)
            )
            .map(userPermission => {
                const foundPermission = permissions.find(p => p.action === userPermission);
                return foundPermission ? foundPermission.id : null;
            })
            .filter(id => id !== null && id !== undefined);

        const payload = {};
        if (permissionsToAdd.length > 0) {
            payload.permissionToAdd = permissionsToAdd;
        }
        if (permissionsToRemove.length > 0) {
            payload.permissionToRemove = permissionsToRemove;
        }

        if (Object.keys(payload).length > 0) {
            try {
                await updatePermissions(id, payload);
                onClose();
            } catch (error) {
                console.error("Failed to update permissions:", error);
            }
        } else {
            console.log("No permissions to update");
            onClose();
        }
    };

    // Grouping dữ liệu để hiển thị lên table
    const groupData = [
        {
            key: 'permitionGroup',
            action: 'Permissions',
            staff: null,
        },
        ...permissions.filter(item => item.action.includes('PERMITION')),
        {
            key: 'userGroup',
            action: 'Users',
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
                    title="Status"
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
