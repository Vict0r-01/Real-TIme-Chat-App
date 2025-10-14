package com.vaikrochat.backend.DTO;

import com.vaikrochat.backend.model.Account;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ParticipantDTO {
    private String username;
    private String profilePicture;

    public static ParticipantDTO fromParticipant(Account account){
        return new ParticipantDTO(
            account.getUsername(),
            (account.getProfilePicture() == null) ? "/images/default.png" : account.getProfilePicture().getUrl());
    }
    
}
