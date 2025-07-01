package com.vaikrochat.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.vaikrochat.backend.service.S3Service;

@RestController
public class FileController {
    
    private final S3Service s3Service;
    public FileController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Void> redirectToPresignedUrl(@PathVariable String fileName) {
        try {
            String key = "images/" + fileName;
            String presignedUrl = s3Service.createPresignedGetUrl(key);
            return ResponseEntity.status(302).header("Location", presignedUrl).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
