package com.vaikrochat.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatUpdateDTO {
    private updateType updateType;
    private int chatId;

    public enum updateType {
        CHAT_CREATED,
        CHAT_DELETED,
        CHAT_UPDATED,
        CHAT_PARTICIPANT_DELETED,
        CHAT_PARTICIPANT_ADDED
    }
}
