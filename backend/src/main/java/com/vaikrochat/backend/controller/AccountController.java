package com.vaikrochat.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.vaikrochat.backend.DTO.ProfileResponseDTO;
import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.service.AccountService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService){
        this.accountService = accountService;
    }

    @GetMapping("profile/{username}")
    public ResponseEntity<ProfileResponseDTO> getProfile(@PathVariable String username) {
        Account account = accountService.getAccountByUsername(username);
        return ResponseEntity.ok(ProfileResponseDTO.fromAccount(account));
    }
    @PutMapping(value = "profile/{username}/updateProfilePicture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> updateProfilePicture(@PathVariable String username, @RequestPart(value = "image") MultipartFile profilePicture) {
        try {
            String profilePictureUrl = accountService.updateProfilePicture(username, profilePicture);
            Map<String, String> response = new HashMap<>();
            response.put("profilePictureUrl", profilePictureUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Internal server error
        }
    }
    @PutMapping("profile/{username}/updateUsername")
    public ResponseEntity<Void> updateUsername(@PathVariable String username, @RequestBody UsernameRequest newUsername) {
        try{
        accountService.updateUsername(username, newUsername.newUsername());
        return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Internal server error
        }
    }

    @PutMapping("profile/{username}/updatePassword")
    public ResponseEntity<Void> updatePassword(@PathVariable String username, @RequestBody PasswordRequest newPassword) {
        try {
            System.out.println("New Password: " + newPassword.newPassword());
            accountService.updatePassword(username, newPassword.newPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Internal server error
        }
    }

    record PasswordRequest(String newPassword) {}
    record UsernameRequest(String newUsername) {}
}
