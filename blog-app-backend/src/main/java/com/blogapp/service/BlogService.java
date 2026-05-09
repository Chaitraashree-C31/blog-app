package com.blogapp.service;

import com.blogapp.dto.BlogRequest;
import com.blogapp.dto.BlogResponse;
import com.blogapp.entity.*;
import com.blogapp.enums.ReactionType;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final BlogImageRepository blogImageRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final ReactionRepository reactionRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Page<BlogResponse> getAllBlogs(int page, List<Long> categoryIds, String currentUserEmail) {
        Pageable pageable = PageRequest.of(page, 5, Sort.by("createdAt").descending());
        Page<Blog> blogs = (categoryIds != null && !categoryIds.isEmpty())
                ? blogRepository.findByCategoryIds(categoryIds, pageable)
                : blogRepository.findAllWithCategoriesPaged(pageable);
        User currentUser = resolveUser(currentUserEmail);
        return blogs.map(b -> mapToResponse(b, currentUser));
    }

    public BlogResponse getBlogById(Long id, String currentUserEmail) {
        return mapToResponse(getEntityById(id), resolveUser(currentUserEmail));
    }

    BlogResponse getBlogByIdForUser(Long id, User user) {
        return mapToResponse(getEntityById(id), user);
    }

    @Transactional
    public BlogResponse createBlog(BlogRequest request,
                                   List<MultipartFile> images,
                                   String email) throws IOException {
        User user = userService.getByEmail(email);
        Blog blog = Blog.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .categories(categoryService.getByIds(request.getCategoryIds()))
                .build();
        blogRepository.save(blog);
        saveImages(blog, images);
        return mapToResponse(blog, user);
    }

    @Transactional
    public BlogResponse updateBlog(Long blogId,
                                   BlogRequest request,
                                   List<MultipartFile> newImages,
                                   String email) throws IOException {
        Blog blog = getEntityById(blogId);
        User user = userService.getByEmail(email);
        if (!blog.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only edit your own blogs.");
        }

        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setCategories(categoryService.getByIds(request.getCategoryIds()));

        List<String> keepUrls = request.getKeepImageUrls() != null
                ? request.getKeepImageUrls() : List.of();

        for (BlogImage img : blogImageRepository.findByBlogId(blogId)) {
            if (!keepUrls.contains("/uploads/" + img.getImagePath())) {
                try { Files.deleteIfExists(Paths.get(uploadDir, img.getImagePath())); }
                catch (IOException ignored) {}
                blogImageRepository.delete(img);
            }
        }

        if (newImages != null) {
            saveImages(blog, newImages);
        }

        blogRepository.save(blog);
        return mapToResponse(blog, user);
    }

    @Transactional
    public void deleteBlog(Long blogId, String email) {
        Blog blog = getEntityById(blogId);
        User user = userService.getByEmail(email);
        if (!blog.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only delete your own blogs.");
        }
        blogRepository.delete(blog);
    }

    public Page<BlogResponse> getMyBlogs(String email, int page) {
        User user = userService.getByEmail(email);
        Pageable pageable = PageRequest.of(page, 5, Sort.by("createdAt").descending());
        return blogRepository.findByUserWithCategories(user, pageable)
                .map(b -> mapToResponse(b, user));
    }

    @Transactional
    public void adminDeleteBlog(Long blogId) {
        blogRepository.delete(getEntityById(blogId));
    }

    public Page<BlogResponse> adminGetAllBlogs(int page) {
        Pageable pageable = PageRequest.of(page, 5, Sort.by("createdAt").descending());
        return blogRepository.findAllWithCategoriesPaged(pageable)
                .map(b -> mapToResponse(b, null));
    }

    Blog getEntityById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found."));
    }

    private User resolveUser(String email) {
        if (email == null) return null;
        try { return userService.getByEmail(email); }
        catch (ResourceNotFoundException e) { return null; }
    }

    private void saveImages(Blog blog, List<MultipartFile> images) throws IOException {
        if (images == null || images.isEmpty()) return;
        String folder = uploadDir + "/blogs";
        Files.createDirectories(Paths.get(folder));
        for (MultipartFile file : images) {
            if (file == null || file.isEmpty()) continue;
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Paths.get(folder, filename),
                    StandardCopyOption.REPLACE_EXISTING);
            blogImageRepository.save(BlogImage.builder()
                    .imagePath("blogs/" + filename)
                    .blog(blog)
                    .build());
        }
    }

    private BlogResponse mapToResponse(Blog blog, User currentUser) {
        BlogResponse res = new BlogResponse();
        res.setId(blog.getId());
        res.setTitle(blog.getTitle());
        res.setContent(blog.getContent());
        res.setCreatedAt(blog.getCreatedAt());
        res.setAuthorName(blog.getUser().getName());

        List<Category> cats = blog.getCategories() != null
                ? blog.getCategories().stream()
                      .sorted(Comparator.comparing(Category::getId))
                      .collect(java.util.stream.Collectors.toList())
                : new ArrayList<>();
        res.setCategoryIds(cats.stream().map(Category::getId).toList());
        res.setCategoryNames(cats.stream().map(Category::getName).toList());

        res.setImageUrls(blogImageRepository.findByBlogId(blog.getId()).stream()
                .map(img -> "/uploads/" + img.getImagePath())
                .toList());

        res.setLikeCount(reactionRepository.countByBlogIdAndType(blog.getId(), ReactionType.LIKE));
        res.setDislikeCount(reactionRepository.countByBlogIdAndType(blog.getId(), ReactionType.DISLIKE));

        if (currentUser != null) {
            reactionRepository.findByUserAndBlogId(currentUser, blog.getId())
                    .ifPresent(r -> res.setUserReaction(r.getType().name()));
        }

        return res;
    }
}