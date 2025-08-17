package com.vaikrochat.backend.controller;

import java.util.HashSet;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vaikrochat.backend.DTO.ChatResponseDTO;
import com.vaikrochat.backend.DTO.ChatUpdateDTO.updateType;
import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Chat;
import com.vaikrochat.backend.model.Chat.ChatType;
import com.vaikrochat.backend.service.AccountService;
import com.vaikrochat.backend.service.ChatService;

@RestController
@RequestMapping("/demo")
public class DemoController {
    
    private final AccountService accountService;
    private final ChatService chatService;

    public DemoController(AccountService accountService, ChatService chatService){
        this.accountService = accountService;
        this.chatService = chatService;
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetDemo() {
        Account account = accountService.getCurrentUser();
        Set<Chat> chats = chatService.getChats(account);
        for(Chat chat : chats){
            System.out.println("Deleting Chats to RESET DEMO!!");
            for(Account participants : chat.getRawParticipants()) participants.getChats().remove(chat);
            chatService.deleteChat(chat.getId());
            chatService.sendChatUpdate(chat, updateType.CHAT_DELETED);
        }
        return ResponseEntity.status(300).body(null);
    }

    @PostMapping("seed")
    public ResponseEntity<ChatResponseDTO> seedDemo(@RequestParam String type) {
        try{
            Account account = accountService.getCurrentUser();
            Set<Chat> chats = chatService.getChats(account);
                if(!chats.isEmpty()) {
                    return ResponseEntity.status(409).body(null); // Chat already exists
                }
            if(type.equals("friend")){
            Set<Account> participants = new HashSet<>(Set.of(accountService.getAccountByUsername("testuser1"), account));
            Chat newChat = chatService.createChat(new Chat("DemoChat", participants, ChatType.PRIVATE), null);
            return ResponseEntity.ok(ChatResponseDTO.fromChat(newChat));
            } else return ResponseEntity.status(408).build();
        } catch(Exception e){
            return ResponseEntity.status(500).build();
        }

    }
}
