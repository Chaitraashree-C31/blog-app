package com.blogapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BlogRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotEmpty(message = "Select at least one category.")
    private List<Long> categoryIds;

    private List<String> keepImageUrls;
}