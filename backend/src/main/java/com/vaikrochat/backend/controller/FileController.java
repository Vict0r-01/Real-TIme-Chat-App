package com.vaikrochat.backend.controller;

import org.springframework.http.MediaType;
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

    @GetMapping(value = "/images/{fileName:.+}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity<String> getFileUrl(@PathVariable String fileName) {
        System.out.println("Fetching file: " + fileName);
        try {
            String key = "images/" + fileName;
            String presignedUrl = s3Service.createPresignedGetUrl(key);
            String contentType = MediaType.IMAGE_JPEG_VALUE;
            if (fileName.toLowerCase().endsWith(".png")) {
                contentType = MediaType.IMAGE_PNG_VALUE;
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(presignedUrl);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
