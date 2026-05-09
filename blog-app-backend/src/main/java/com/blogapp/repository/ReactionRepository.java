package com.blogapp.repository;

import com.blogapp.entity.Reaction;
import com.blogapp.entity.User;
import com.blogapp.enums.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndBlogId(User user, Long blogId);
    long countByBlogIdAndType(Long blogId, ReactionType type);
    Page<Reaction> findByUser(User user, Pageable pageable);
}