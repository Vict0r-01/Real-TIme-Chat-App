package com.vaikrochat.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vaikrochat.backend.exception.UnauthorizedException;
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

    public Account getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }

        String username = authentication.getName();
        return accountRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public Account getAccountByUsername(String username) {
        return accountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String updateProfilePicture(Account account, MultipartFile profilePictureUrl)
    {
        Image image = imageService.storeFile(profilePictureUrl);
        if (image == null) {
            throw new RuntimeException("Failed to store profile picture");
        }
        account.setProfilePicture(image);
        System.out.println("Updated profile picture URL: " + account.getProfilePicture().getUrl());
        accountRepository.save(account);
        return account.getProfilePicture().getUrl();
    }

    public void updateUsername(Account account, String newUsername)
    {
        if(newUsername.length() > 1) account.setUsername(newUsername);
        else throw new RuntimeException("Username must be at least 2 characters long");
        System.out.println("Updated username: " + account.getUsername());
        accountRepository.save(account);
    }

    public void updatePassword(Account account, String newPassword)
    {
        if(newPassword.length() > 1) account.setPassword(newPassword);
        else throw new RuntimeException("Password must be at least 2 characters long");
        System.out.println("Updated password: " + account.getPassword());
        accountRepository.save(account);
    }

    public void addImagetoCollection(MultipartFile image){

        Image addedImage = imageService.storeFile(image);
        if (addedImage == null) {
            throw new RuntimeException("Failed to store profile picture");
        }
        Account account = getCurrentUser();
        account.getUserImageCollection().add(addedImage);
        accountRepository.save(account);
        System.out.println(addedImage.getFileName()+" added to the COLLECTION!");

    }

    public Image getImagefromCollection(long imageId){
        System.out.println("Image Id: -----"+imageId);
        Account account = getCurrentUser();
        Optional<Image> image = account.getUserImageCollection().stream().filter(img -> img.getId() == imageId).findFirst();
        if(image.isPresent()){
            Image foundImage = image.get();
            return foundImage;
        } else throw new RuntimeException("Image in Collection not Found!");
    }
}
