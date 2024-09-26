package com.example.dynamicauth.repository;

import com.example.dynamicauth.entity.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Integer> {

    List<UserPermission> findByUserId(Integer userId);

    void deleteByUserIdAndPermissionId(int userId, int permissionId);
}
