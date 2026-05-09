package com.blogapp.service;

import com.blogapp.dto.UserProfileRequest;
import com.blogapp.dto.UserProfileResponse;
import com.blogapp.entity.User;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(String email) {
        return mapToResponse(getByEmail(email));
    }

    public boolean updateProfile(String currentEmail, UserProfileRequest request) {
        User user = getByEmail(currentEmail);
        boolean credentialsChanged = false;

        user.setName(request.getName());

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use.");
            }
            user.setEmail(request.getEmail());
            credentialsChanged = true;
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            credentialsChanged = true;
        }

        userRepository.save(user);
        return credentialsChanged;
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteUser(Long userId) {
        userRepository.delete(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found.")));
    }

    public void deleteByEmail(String email) {
        userRepository.delete(getByEmail(email));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    private UserProfileResponse mapToResponse(User user) {
        UserProfileResponse res = new UserProfileResponse();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole().name());
        return res;
    }
}