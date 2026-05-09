package com.blogapp.controller;

import com.blogapp.dto.UserProfileRequest;
import com.blogapp.dto.UserProfileResponse;
import com.blogapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserProfileRequest request) {

        boolean credentialsChanged = userService.updateProfile(
                userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of("requiresLogout", credentialsChanged));
    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteOwnAccount(
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteByEmail(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}