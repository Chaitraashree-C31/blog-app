package com.blogapp.repository;

import com.blogapp.entity.Blog;
import com.blogapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    @Query(value = "SELECT DISTINCT b FROM Blog b LEFT JOIN FETCH b.categories",
           countQuery = "SELECT COUNT(DISTINCT b) FROM Blog b")
    Page<Blog> findAllWithCategoriesPaged(Pageable pageable);

    @Query(value = "SELECT DISTINCT b FROM Blog b LEFT JOIN FETCH b.categories " +
                   "WHERE b.id IN (" +
                   "SELECT DISTINCT b2.id FROM Blog b2 JOIN b2.categories c WHERE c.id IN :categoryIds)",
           countQuery = "SELECT COUNT(DISTINCT b) FROM Blog b JOIN b.categories c WHERE c.id IN :categoryIds")
    Page<Blog> findByCategoryIds(@Param("categoryIds") List<Long> categoryIds,
                                  Pageable pageable);

    @Query(value = "SELECT DISTINCT b FROM Blog b LEFT JOIN FETCH b.categories WHERE b.user = :user",
           countQuery = "SELECT COUNT(DISTINCT b) FROM Blog b WHERE b.user = :user")
    Page<Blog> findByUserWithCategories(@Param("user") User user, Pageable pageable);

    @Query("SELECT DISTINCT b FROM Blog b LEFT JOIN FETCH b.categories")
    List<Blog> findAllWithCategories();
}