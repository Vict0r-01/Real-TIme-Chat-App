package com.vaikrochat.backend.DTO;
import java.util.Date;

import com.vaikrochat.backend.model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMessage {
    private String text;
    private String sender;
    private MessageType type;
    private int chatId;
    private Date timestamp;
    private String profilePictureUrl;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public static ChatMessage fromMessage(Message message) {
        return new ChatMessage(
            message.getText(),
            message.getSender().getUsername(),
            MessageType.CHAT,
            message.getChat().getId(),
            message.getTimestamp(),
            message.getSender().getProfilePicture().getUrl()
        );
    }
}
