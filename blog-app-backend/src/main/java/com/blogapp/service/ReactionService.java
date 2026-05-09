package com.blogapp.service;

import com.blogapp.dto.BlogResponse;
import com.blogapp.entity.*;
import com.blogapp.enums.ReactionType;
import com.blogapp.repository.ReactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final UserService userService;
    private final BlogService blogService;

    public BlogResponse react(Long blogId, String reactionType, String email) {
        User user = userService.getByEmail(email);
        ReactionType type = ReactionType.valueOf(reactionType.toUpperCase());
        Optional<Reaction> existing = reactionRepository.findByUserAndBlogId(user, blogId);

        if (existing.isPresent()) {
            Reaction reaction = existing.get();
            if (reaction.getType() == type) {
                reactionRepository.delete(reaction);
            } else {
                reaction.setType(type);
                reactionRepository.save(reaction);
            }
        } else {
            reactionRepository.save(Reaction.builder()
                    .user(user)
                    .blog(blogService.getEntityById(blogId))
                    .type(type)
                    .build());
        }

        return blogService.getBlogByIdForUser(blogId, user);
    }

    public Page<BlogResponse> getReactedBlogs(String email, int page) {
        User user = userService.getByEmail(email);
        Pageable pageable = PageRequest.of(page, 5, Sort.by("id").descending());
        return reactionRepository.findByUser(user, pageable)
                .map(r -> blogService.getBlogByIdForUser(r.getBlog().getId(), user));
    }
}