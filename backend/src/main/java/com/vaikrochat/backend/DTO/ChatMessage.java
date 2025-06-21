package com.vaikrochat.backend.DTO;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import com.vaikrochat.backend.model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMessage {
    private String text;
    private Set<String> imageUrls;
    private String sender;
    private MessageType type;
    private int chatId;
    private Date timestamp;
    private String profilePictureUrl;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public static ChatMessage fromMessage(Message message) {
        Set<String> imageUrls = message.getImages() != null
        ? message.getImages().stream().map(image -> image.getUrl()).collect(Collectors.toSet())
        : Set.of();

    String profilePictureUrl = (message.getSender() != null && message.getSender().getProfilePicture() != null)
        ? message.getSender().getProfilePicture().getUrl()
        : "/uploads/default.png";

    return new ChatMessage(
        message.getText(),
        imageUrls,
        message.getSender() != null ? message.getSender().getUsername() : "Unknown",
        MessageType.CHAT,
        message.getChat().getId(),
        message.getTimestamp(),
        profilePictureUrl
    );
    }
}
