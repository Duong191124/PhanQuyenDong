package com.example.dynamicauth.service;

import com.example.dynamicauth.entity.Permition;
import com.example.dynamicauth.entity.User;
import com.example.dynamicauth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<Permition> getPermissionsByUserId(Integer userId) {
        return userRepository.findById(userId)
                .map(User::getPermitions)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
