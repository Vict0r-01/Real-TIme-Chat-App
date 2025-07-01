package com.vaikrochat.backend.service;

import java.io.IOException;
import java.time.Duration;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class S3Service {
    private final S3Client s3Client;
    private final String bucketName = "vaikrobucket";

    public S3Service() {
        this.s3Client = S3Client.builder()
        .region(Region.US_EAST_2)
        .credentialsProvider(DefaultCredentialsProvider.create())
        .build();
    }

    public void uploadFile(MultipartFile file) throws IOException {
        String key = "images/" + file.getOriginalFilename();
        System.out.println("UPLOADING FILE~!!!!!");
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
        );
    }

    public String createPresignedGetUrl(String keyName) {
        System.out.println("Getting Presigned URL for key: " + keyName);
        System.out.println("Bucket name: " + bucketName);
        
        try (S3Presigner presigner = S3Presigner.create()) {
            GetObjectRequest objectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(keyName)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(10))
                    .getObjectRequest(objectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
            String url = presignedRequest.url().toExternalForm();
            
            System.out.println("Generated presigned URL: " + url);
            return url;
            
        } catch (Exception e) {
            System.err.println("Error creating presigned URL: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create presigned URL", e);
        }
    }
}
