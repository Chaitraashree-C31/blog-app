package com.blogapp.service;

import com.blogapp.dto.AuthRequest;
import com.blogapp.dto.AuthResponse;
import com.blogapp.dto.RegisterRequest;
import com.blogapp.entity.User;
import com.blogapp.enums.Role;
import com.blogapp.repository.UserRepository;
import com.blogapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }
        userRepository.save(User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPassword()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        return new AuthResponse(
                jwtUtil.generateToken(user.getEmail()),
                user.getRole().name(),
                user.getName(),
                user.getId()
        );
    }
}