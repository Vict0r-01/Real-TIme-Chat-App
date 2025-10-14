package com.vaikrochat.backend.controller;

import com.vaikrochat.backend.DTO.ChatResponseDTO;
import com.vaikrochat.backend.DTO.ParticipantDTO;
import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Chat;
import com.vaikrochat.backend.service.AccountService;
import com.vaikrochat.backend.service.ChatService;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/chat")
public class ChatController {
    private final ChatService chatService;
    private final AccountService accountService;

    public ChatController(ChatService chatService, AccountService accountService) {
        this.accountService = accountService;
        this.chatService = chatService;
    }

    @GetMapping()
    public ResponseEntity<List<ChatResponseDTO>> getChats() {
       try {
        Account account = accountService.getCurrentUser();
        Set<Chat> chats = chatService.getChats(account);
        
        if (chats.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        List<ChatResponseDTO> response = chats.stream()
            .map(ChatResponseDTO::fromChat)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).build();
    }
    }

    @PostMapping("/private")
    public ResponseEntity<ChatResponseDTO> createPrivateChat(@RequestBody Chat chat) {
        try {
            Account account = accountService.getCurrentUser();
            Set<Chat> chats = chatService.getChats(account);
            if(chats.contains(chat)) {
                return ResponseEntity.status(409).body(null); // Chat already exists
            }
            System.out.println("Creating private chat for user: " + account.getUsername());
            Chat newChat = chatService.createChat(chat, null);
            System.out.println("Private chat created with name: " + newChat.getName());
            return ResponseEntity.ok(ChatResponseDTO.fromChat(newChat));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatResponseDTO> createChat(
            @RequestPart("chat") Chat chat,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Account account = accountService.getCurrentUser();
            Set<Chat> chats = chatService.getChats(account);
            if(chats.contains(chat)) {
                return ResponseEntity.status(409).body(null); // Chat already exists
            }
            Chat newChat = chatService.createChat(chat, image);
            System.out.println("CHAT CREATED");
            return ResponseEntity.ok(ChatResponseDTO.fromChat(newChat));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/{chatId}/removeParticipant")
    public ResponseEntity<Void> deleteParticipant(@PathVariable int chatId, @RequestParam String participantName){
        try {
            Chat chat = chatService.getChatById(chatId);
            Account participant = accountService.getAccountByUsername(participantName);
            chatService.deleteParticipant(chat, participant);
            System.out.println("Chat Deleted: " + participantName + " - " + chatId);
            return ResponseEntity.ok().build();
        }catch(Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/{chatId}/addParticipants")
    @Transactional
    public ResponseEntity<Set<ParticipantDTO>> addParticipants(@PathVariable int chatId, @RequestBody participantsRequest participantsRequest){
        try {
            Chat chat = chatService.getChatById(chatId);
            Set<Account> participants = new HashSet<>();
            for(String participant : participantsRequest.participantsName){
                participants.add(accountService.getAccountByUsername(participant));
            }
            chatService.addParticipants(chat, participants);
            Set<ParticipantDTO> participantsResponse = new HashSet<>();
            for(Account participant : participants){
                participantsResponse.add(ParticipantDTO.fromParticipant(participant));
            }
            return ResponseEntity.ok(participantsResponse);
        }catch(Exception e){
            return ResponseEntity.status(500).build();
        }
    }

    record participantsRequest(String[] participantsName) {}
}