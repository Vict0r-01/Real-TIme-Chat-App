package com.vaikrochat.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.vaikrochat.backend.DTO.ChatMessage;
import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Chat;
import com.vaikrochat.backend.model.Message;
import com.vaikrochat.backend.service.AccountService;
import com.vaikrochat.backend.service.ChatService;
import com.vaikrochat.backend.service.MessageService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    
    private final MessageService messageService;
    private final AccountService accountService;
    private final ChatService chatService;

    public MessageController(MessageService messageService, AccountService accountService, ChatService chatService) {
        this.chatService = chatService;
        this.accountService = accountService;
        this.messageService = messageService;
    }


    @GetMapping("/chat/{chatId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable int chatId) {
        List<Message> messages = messageService.getMessagesByChatId(chatId);
        List<ChatMessage> chatMessages = messages.stream()
            .map(ChatMessage::fromMessage)
            .toList();
        return ResponseEntity.ok(chatMessages);
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chat")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        Chat chat = chatService.getChatById(message.getChatId());
        Account sender = accountService.getAccountByUsername(message.getSender());
        message.setProfilePictureUrl(sender.getProfilePicture().getUrl());
        System.out.println("Sender: " + sender.getUsername()+ "Chat: " + chat.getName()+ "Message: " + message.getText());
        messageService.saveMessage(new Message(sender, chat, message.getText()));
        return message;
    }

    @MessageMapping("/chat.join")
    @SendTo("/topic/chat")
    public ChatMessage join(@Payload ChatMessage message) {
        message.setType(ChatMessage.MessageType.JOIN);
        return message;
    }
}
