package com.vaikrochat.backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.vaikrochat.backend.DTO.ChatMessage;
import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Chat;
import com.vaikrochat.backend.model.Image;
import com.vaikrochat.backend.model.Message;
import com.vaikrochat.backend.service.AccountService;
import com.vaikrochat.backend.service.ChatService;
import com.vaikrochat.backend.service.ImageService;
import com.vaikrochat.backend.service.MessageService;

@RestController
public class MessageController {
    
    private final MessageService messageService;
    private final AccountService accountService;
    private final ChatService chatService;
    private final ImageService imageService;

    public MessageController(MessageService messageService, AccountService accountService, ChatService chatService, ImageService imageService) {
        this.chatService = chatService;
        this.imageService = imageService;
        this.accountService = accountService;
        this.messageService = messageService;
    }

    @Transactional
    @GetMapping("/chat/{chatId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable int chatId) {
        List<Message> messages = messageService.getMessagesByChatId(chatId);
        List<ChatMessage> chatMessages = messages.stream()
            .map(ChatMessage::fromMessage)
            .toList();
        return ResponseEntity.ok(chatMessages);
    }

    @PostMapping(value = "/chat/{chatId}/messages", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<ChatMessage> createMessage(
        @PathVariable int chatId,
        @RequestParam(value = "text", required = false) String text,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        @RequestParam(value = "collectedImages", required = false) List<Long> collectedImageId) {
        
        Chat chat = chatService.getChatById(chatId);
        Account sender = accountService.getCurrentUser();
        List<Image> imagesMessage = new ArrayList<>();
        
        if (images != null && !images.isEmpty()) {
            System.out.println("Storing IMAGES!!");
            for (MultipartFile image : images) {
                imagesMessage.add(imageService.storeFile(image));
            }
        }
        if(text == null) {
            text = "";
        }

        if(collectedImageId!= null && !collectedImageId.isEmpty()) {
            for(long imageId : collectedImageId){
                imagesMessage.add(accountService.getImagefromCollection(imageId));
            }
        }
        Message message = new Message(sender, chat, text, imagesMessage);
        messageService.saveMessage(message);
        
        return ResponseEntity.ok(ChatMessage.fromMessage(message));
    }
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/message")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        return message;
    }

    @MessageMapping("/chat.join")
    @SendTo("/topic/message")
    public ChatMessage join(@Payload ChatMessage message) {
        message.setType(ChatMessage.MessageType.JOIN);
        return message;
    }
}
