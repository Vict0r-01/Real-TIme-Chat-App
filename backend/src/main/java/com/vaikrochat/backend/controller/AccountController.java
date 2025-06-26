package com.vaikrochat.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
            Account account = accountService.getCurrentUser();

            if(!account.getUsername().equals(username)) return ResponseEntity.status(401).build();

            String profilePictureUrl = accountService.updateProfilePicture(account, profilePicture);
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
            Account account = accountService.getCurrentUser();

            System.out.println("UPDATING USERNAME!!");
            if(!account.getUsername().equals(username)) return ResponseEntity.status(401).build();

            accountService.updateUsername(account, newUsername.newUsername());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Internal server error
        }
    }

    @PutMapping("profile/{username}/updatePassword")
    public ResponseEntity<Void> updatePassword(@PathVariable String username, @RequestBody PasswordRequest newPassword) {
        try {
            Account account = accountService.getCurrentUser();
            System.out.println("UPDATING PASSWORD!!!");
            if(!account.getUsername().equals(username)) return ResponseEntity.status(401).build();

            System.out.println("New Password: " + newPassword.newPassword());
            accountService.updatePassword(account, newPassword.newPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Internal server error
        }
    }

    record PasswordRequest(String newPassword) {}
    record UsernameRequest(String newUsername) {}
}
