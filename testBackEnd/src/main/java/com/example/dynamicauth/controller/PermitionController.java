package com.example.dynamicauth.controller;

import com.example.dynamicauth.dto.UserPermissionDTO;
import com.example.dynamicauth.entity.Permition;
import com.example.dynamicauth.entity.User;
import com.example.dynamicauth.repository.PermitionRepository;
import com.example.dynamicauth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/permition")
@CrossOrigin(origins = "http://localhost:3000")
public class PermitionController {

    @Autowired
    PermitionRepository permitionRepository;

    @Autowired
    UserRepository userRepository;


    // Tạo mới một quyền
    @PreAuthorize("hasAuthority('CREATE_PERMITION')")
    @PostMapping("/")
    public ResponseEntity<Permition> createPermition(@RequestBody Permition permition) {
        Permition savedPermition = permitionRepository.save(permition);
        return ResponseEntity.ok(savedPermition);
    }

    // Lấy tất cả quyền
    @PreAuthorize("hasAuthority('READ_PERMITION')")
    @GetMapping("/all")
    public ResponseEntity<List<Permition>> getAllPermitions() {
        List<Permition> permitionList = permitionRepository.findAll();
        return ResponseEntity.ok(permitionList);
    }

    // Lấy quyền theo ID
    @PreAuthorize("hasAuthority('READ_PERMITION')")
    @GetMapping("/{id}")
    public ResponseEntity<Permition> getPermitionById(@PathVariable Integer id) {
        return permitionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cập nhật quyền
    @PreAuthorize("hasAuthority('UPDATE_PERMITION')")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updatePermition(@PathVariable("userId") Integer userId, @RequestBody UserPermissionDTO permition) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        List<Permition> currentPermitons = user.getPermitions();

        if (permition.getPermissionToAdd() != null) {
            List<Permition> permissionsToAdd = permitionRepository.findAllById(permition.getPermissionToAdd());
            for (Permition permission : permissionsToAdd) {
                if (!currentPermitons.contains(permission)) {
                    currentPermitons.add(permission); // Add if it doesn't already exist
                }
            }
        }

        if (permition.getPermissionToRemove() != null) {
            List<Permition> permissionsToRemove = permitionRepository.findAllById(permition.getPermissionToRemove());
            for (Permition permission : permissionsToRemove) {
                currentPermitons.remove(permission); // Remove if it exists
            }
        }

        user.setPermitions(currentPermitons);
        User updateUser = userRepository.save(user);
        return ResponseEntity.ok(updateUser);
    }

    // Xóa quyền
    @PreAuthorize("hasAuthority('DELETE_PERMITION')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermition(@PathVariable Integer id) {
        if (!permitionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        permitionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
