package com.example.dynamicauth.util;

import com.example.dynamicauth.entity.User;
import com.example.dynamicauth.entity.Permition;
import com.example.dynamicauth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailServiceCustom implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // Lấy danh sách các GrantedAuthority từ danh sách permitions
        List<GrantedAuthority> authorities = user.getPermitions().stream()
                .map(permition -> (GrantedAuthority) () -> permition.getName())
                .collect(Collectors.toList());

        // Tạo đối tượng UserDetails cho Spring Security
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                authorities
        );
    }
}
