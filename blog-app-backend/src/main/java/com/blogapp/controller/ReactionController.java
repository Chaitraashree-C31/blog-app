package com.blogapp.controller;

import com.blogapp.dto.BlogResponse;
import com.blogapp.service.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping("/{blogId}")
    public ResponseEntity<BlogResponse> react(
            @PathVariable Long blogId,
            @RequestParam String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                reactionService.react(blogId, type, userDetails.getUsername()));
    }

    @GetMapping("/my-reacted")
    public ResponseEntity<Page<BlogResponse>> getReactedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                reactionService.getReactedBlogs(userDetails.getUsername(), page));
    }
}