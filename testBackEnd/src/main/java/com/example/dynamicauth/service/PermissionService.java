package com.example.dynamicauth.service;

import com.example.dynamicauth.entity.UserPermission;
import com.example.dynamicauth.repository.UserPermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    @Autowired
    private UserPermissionRepository userPermissionRepository;

    public void assignPermissionsToUser(Integer userId, List<Integer> permissionIds) {
        // Lấy tất cả các quyền đã tồn tại của người dùng
        List<UserPermission> existingPermissions = userPermissionRepository.findByUserId(userId);
        Set<Integer> existingPermissionIds = existingPermissions.stream()
                .map(UserPermission::getPermissionId) // Lấy danh sách permissionId hiện tại
                .collect(Collectors.toSet());

        // Duyệt qua danh sách quyền mới và chỉ thêm quyền chưa có
        for (Integer permissionId : permissionIds) {
            if (!existingPermissionIds.contains(permissionId)) {
                UserPermission newPermission = new UserPermission();
                newPermission.setUserId(userId);
                newPermission.setPermissionId(permissionId);
                userPermissionRepository.save(newPermission);
            }
        }
    }

    @Transactional
    public void removePermissionsFromUser(Integer userId, List<Integer> permissionIds){
        for (Integer permissionId : permissionIds) {
            userPermissionRepository.deleteByUserIdAndPermissionId(userId, permissionId);
        }
    }
}
