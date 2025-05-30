package com.vaikrochat.backend.DTO;

import com.vaikrochat.backend.model.Account;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponseDTO {
    
    private String username;
    private String password;
    private String profilePictureUrl;

    public static ProfileResponseDTO fromAccount(Account account){
        return new ProfileResponseDTO(
            account.getUsername(),
            account.getPassword(),
            account.getProfilePicture().getUrl());
    }
}
