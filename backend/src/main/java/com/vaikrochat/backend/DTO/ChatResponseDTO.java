package com.vaikrochat.backend.DTO;

import java.util.Set;
import java.util.stream.Collectors;

import com.vaikrochat.backend.model.Chat;
import com.vaikrochat.backend.model.Chat.ParticipantDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatResponseDTO {
    private int id;
    private String name;
    private String type;
    private String imageUrl;
    private String lastMessage;
    private String lastMessageSender;
    private Set<ParticipantDTO> participants;

    public static ChatResponseDTO fromChat(Chat chat) {
        return new ChatResponseDTO(
            chat.getId(),
            chat.getName(),
            chat.getType().name(),
            chat.getChatImage().getUrl(),
            chat.getMessages().isEmpty() ? null : chat.getMessages().get(chat.getMessages().size() - 1).getText(),
            chat.getMessages().isEmpty() ? null : chat.getMessages().get(chat.getMessages().size() - 1).getSender().getUsername(),
            chat.getParticipants().stream()
                .map(participant -> new ParticipantDTO(participant.getId(), participant.getUsername(), participant.getProfileImageUrl()))
                .collect(Collectors.toSet())
        );
    }
}
