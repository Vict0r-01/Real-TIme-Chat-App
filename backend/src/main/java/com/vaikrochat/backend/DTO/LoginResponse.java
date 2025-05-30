package com.vaikrochat.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private AccountDTO account;

    @Data
    @AllArgsConstructor
    public static class AccountDTO {
        private int id;
        private String username;
        private String profilePictureUrl;
    }
}
