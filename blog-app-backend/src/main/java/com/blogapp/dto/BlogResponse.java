package com.blogapp.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BlogResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String authorName;
    private List<Long> categoryIds;
    private List<String> categoryNames;
    private List<String> imageUrls;
    private long likeCount;
    private long dislikeCount;
    private String userReaction;
}