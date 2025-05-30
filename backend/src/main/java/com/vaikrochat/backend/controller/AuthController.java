package com.vaikrochat.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.vaikrochat.backend.DTO.LoginResponse;
import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.service.AccountService;
import com.vaikrochat.backend.service.JwtService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final JwtService jwtService;
    private final AccountService accountService;

    public AuthController(JwtService jwtService, AccountService accountService) {
        this.accountService = accountService;
        this.jwtService = jwtService;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody Account loginRequest) {
        // Validate the login request (username and password)
        Account account = accountService.login(loginRequest);
        if(account == null) {
            System.out.println("Invalid username or password");
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        // If valid, generate a JWT token
        String token = jwtService.generateToken(loginRequest.getUsername());
        return ResponseEntity.ok(new LoginResponse(token, 
        new LoginResponse.AccountDTO(account.getId(), account.getUsername(), account.getProfilePicture().getUrl())));
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("Token: " + token.substring(7));
            boolean isExpired = jwtService.isTokenExpired(token.substring(7));
            System.out.println("IsValid: " + isExpired);
            return ResponseEntity.ok(isExpired);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(false); // Invalid token
        }
    }
}
