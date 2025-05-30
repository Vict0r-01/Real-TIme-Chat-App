package com.vaikrochat.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String url;

    @Column
    private String contentType;

    private Long size;

    @Column
    private LocalDateTime uploadDate;

    @OneToMany(mappedBy = "profilePicture")
    private Set<Account> accounts = new HashSet<>();

    @OneToMany(mappedBy = "chatImage")
    private Set<Chat> chats = new HashSet<>();

    public Image() {
    }

    public Image(String fileName, String url, String contentType, Long size) {
        this.fileName = fileName;
        this.url = url;
        this.contentType = contentType;
        this.size = size;
        this.uploadDate = LocalDateTime.now();
    }
}
