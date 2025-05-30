package com.vaikrochat.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Image;
import com.vaikrochat.backend.repository.AccountRepository;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final ImageService imageService;

    @Autowired
    public AccountService(AccountRepository accountRepository, ImageService imageService) {
        this.imageService = imageService;
        this.accountRepository = accountRepository;
    }

    public Account login(Account account) {
        Optional<Account> accountFound = accountRepository.findByUsername(account.getUsername());
        if(accountFound.isPresent()) {
            Account foundAccount = accountFound.get();
            if (foundAccount.getUsername().equals(account.getUsername()) 
            && foundAccount.getPassword().equals(account.getPassword())) {
                return foundAccount;
            } else {
                return null; // Invalid password
            }
        } else return null;
    }


    public Account getAccountByUsername(String username) {
        return accountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String updateProfilePicture(String username, MultipartFile profilePictureUrl)
    {
        Account account = accountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Image image = imageService.storeFile(profilePictureUrl);
        if (image == null) {
            throw new RuntimeException("Failed to store profile picture");
        }
        account.setProfilePicture(image);
        System.out.println("Updated profile picture URL: " + account.getProfilePicture().getUrl());
        accountRepository.save(account);
        return account.getProfilePicture().getUrl();
    }

    public void updateUsername(String username, String newUsername)
    {
        Account account = accountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if(newUsername.length() > 1) account.setUsername(newUsername);
        else throw new RuntimeException("Username must be at least 2 characters long");
        System.out.println("Updated username: " + account.getUsername());
        accountRepository.save(account);
    }

    public void updatePassword(String username, String newPassword)
    {
        Account account = accountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if(newPassword.length() > 1) account.setPassword(newPassword);
        else throw new RuntimeException("Password must be at least 2 characters long");
        System.out.println("Updated password: " + account.getPassword());
        accountRepository.save(account);
    }
}
