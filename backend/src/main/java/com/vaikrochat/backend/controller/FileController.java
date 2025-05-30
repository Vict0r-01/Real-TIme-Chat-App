package com.vaikrochat.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.vaikrochat.backend.service.ImageService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {
    
    private final ImageService imageService;
    public FileController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping(value = "/uploads/{fileName:.+}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) {
        System.out.println("Fetching file: " + fileName);
        try {
            // Get image data from service
            byte[] imageData = imageService.getImageData(fileName);
            
            // Determine content type (you might want to store this in the Image entity)
            String contentType = MediaType.IMAGE_JPEG_VALUE;
            if (fileName.toLowerCase().endsWith(".png")) {
                contentType = MediaType.IMAGE_PNG_VALUE;
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(imageData);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
