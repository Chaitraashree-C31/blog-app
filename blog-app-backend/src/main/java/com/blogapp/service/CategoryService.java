package com.blogapp.service;

import com.blogapp.entity.Blog;
import com.blogapp.entity.Category;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repository.BlogRepository;
import com.blogapp.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BlogRepository blogRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(String name) {
        if (categoryRepository.existsByName(name)) {
            throw new IllegalArgumentException("Category already exists.");
        }
        return categoryRepository.save(Category.builder().name(name).build());
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found."));

        for (Blog blog : blogRepository.findAllWithCategories()) {
            if (blog.getCategories().removeIf(c -> c.getId().equals(id))) {
                if (blog.getCategories().isEmpty()) {
                    blogRepository.delete(blog);
                } else {
                    blogRepository.save(blog);
                }
            }
        }

        categoryRepository.delete(category);
    }

    public Set<Category> getByIds(List<Long> ids) {
        return new HashSet<>(categoryRepository.findAllById(ids));
    }
}