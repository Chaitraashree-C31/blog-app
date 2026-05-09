package com.blogapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blog_images")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class BlogImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imagePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog;
}