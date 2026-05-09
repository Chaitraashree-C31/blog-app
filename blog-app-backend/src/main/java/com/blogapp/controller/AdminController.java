package com.blogapp.controller;

import com.blogapp.dto.BlogResponse;
import com.blogapp.dto.UserProfileResponse;
import com.blogapp.entity.Category;
import com.blogapp.service.BlogService;
import com.blogapp.service.CategoryService;
import com.blogapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final BlogService blogService;
    private final CategoryService categoryService;

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/blogs")
    public ResponseEntity<Page<BlogResponse>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(blogService.adminGetAllBlogs(page));
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.adminDeleteBlog(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> addCategory(@RequestParam String name) {
        return ResponseEntity.ok(categoryService.addCategory(name));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}