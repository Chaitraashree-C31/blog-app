package com.blogapp.repository;

import com.blogapp.entity.BlogImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogImageRepository extends JpaRepository<BlogImage, Long> {
    List<BlogImage> findByBlogId(Long blogId);
}