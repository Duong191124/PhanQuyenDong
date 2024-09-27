package com.example.dynamicauth.controller;

import com.example.dynamicauth.dto.LoginDTO;
import com.example.dynamicauth.entity.Permition;
import com.example.dynamicauth.entity.User;
import com.example.dynamicauth.repository.UserRepository;
import com.example.dynamicauth.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    SecurityUtil securityUtil;

    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;
    @Autowired
    UserRepository userRepository;

    @PreAuthorize("hasAuthority('READ_USER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id")int id){
        List<Permition> permissions = userRepository.findById(id).map(User::getPermitions).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok().body(permissions);
    }

    @PreAuthorize("hasAuthority('READ_USER')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllUser(){
        return ResponseEntity.ok().body(userRepository.findAll());
    }

    @PostMapping("/register")
    public ResponseEntity<?> resgister(@RequestBody User user){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok().body(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginDTO loginDTO){
        //create token by username and password
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getUserName(), loginDTO.getPassword());

        try {
            //authenticate  token throught userdetails service
            Authentication authentication =
                    authenticationManagerBuilder.getObject().authenticate(usernamePasswordAuthenticationToken);

            //generate token
            String token = securityUtil.createToken(authentication);
            return ResponseEntity.status(HttpStatus.OK).body(
                    token
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    e.getMessage()
            );
        }
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PutMapping("/")
    public ResponseEntity<?> updateById(@RequestBody User user){
        try{
            userRepository.save(user);
            return ResponseEntity.ok().body("update success");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('DELETE_USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id")int id){
        try{
            userRepository.deleteById(id);
            return ResponseEntity.ok().body("delete success");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
