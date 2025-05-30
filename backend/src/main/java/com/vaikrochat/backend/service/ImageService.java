package com.vaikrochat.backend.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
    private final Path fileStorageLocation;
    private final ImageRepository imageRepository;


    public ImageService(ImageRepository imageRepository) {
        this.fileStorageLocation = Paths.get("uploads")
            .toAbsolutePath()
            .normalize();
        this.imageRepository = imageRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }
    public Image storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(UUID.randomUUID() + "-" + file.getOriginalFilename());

        try {
            // Save file to disk
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.debug("Starting file upload: {}", file.getOriginalFilename());
            log.info("File size: {} bytes", file.getSize());

            // Save metadata to database
            Image image = new Image();
            image.setFileName(fileName);
            image.setUrl("/uploads/" + fileName);
            image.setContentType(file.getContentType());
            image.setSize(file.getSize());
            image.setUploadDate(LocalDateTime.now());
            imageRepository.save(image);

            return image;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    public byte[] getImageData(String fileName) throws IOException {
    Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
    
    // Prevent directory traversal attacks
    if (!filePath.getParent().equals(this.fileStorageLocation.toAbsolutePath())) {
        throw new SecurityException("Invalid file path");
    }
    
    if (Files.exists(filePath)) {
        return Files.readAllBytes(filePath);
    }
    
    throw new FileNotFoundException("File not found: " + fileName);
}

    public Image getImageByUrl(String url) {
        return imageRepository.findByUrl(url)
            .orElseThrow(() -> new RuntimeException("Image not found with URL: " + url));
    }

    public Image getDefaultImage() {
        // Return a default image if no image is provided
        return imageRepository.findByUrl("/uploads/default.png")
            .orElseThrow(() -> new RuntimeException("Default image not found"));
    }
}
