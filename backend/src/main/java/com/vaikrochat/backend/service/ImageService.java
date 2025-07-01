package com.vaikrochat.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.vaikrochat.backend.model.Image;
import com.vaikrochat.backend.repository.ImageRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ImageService {
    private final ImageRepository imageRepository;
    private final S3Service s3Service;


    public ImageService(ImageRepository imageRepository, S3Service s3Service) {
        this.s3Service = s3Service;
        this.imageRepository = imageRepository;
    }
    public Image storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(UUID.randomUUID() + "-" + file.getOriginalFilename());
        String fileKey = "/images/"+fileName;
        try {
            // Save file to S3 bucket
            s3Service.uploadFile(file, fileKey);

            log.debug("Starting file upload: {}", file.getOriginalFilename());
            log.info("File size: {} bytes", file.getSize());

            // Save metadata to database
            Image image = new Image();
            image.setFileName(fileName);
            image.setUrl(fileKey);
            image.setContentType(file.getContentType());
            image.setSize(file.getSize());
            image.setUploadDate(LocalDateTime.now());
            imageRepository.save(image);

            return image;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    public Image getImageByUrl(String url) {
        return imageRepository.findByUrl(url)
            .orElseThrow(() -> new RuntimeException("Image not found with URL: " + url));
    }

    public Image getDefaultImage() {
        // Return a default image if no image is provided
        return imageRepository.findByUrl("/images/default.png")
            .orElseThrow(() -> new RuntimeException("Default image not found"));
    }
}
