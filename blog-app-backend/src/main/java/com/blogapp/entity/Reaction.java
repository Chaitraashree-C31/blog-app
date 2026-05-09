package com.blogapp.entity;

import com.blogapp.enums.ReactionType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "reactions",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "blog_id"})
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReactionType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog;
}