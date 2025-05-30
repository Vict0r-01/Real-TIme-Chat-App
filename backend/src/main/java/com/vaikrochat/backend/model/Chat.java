package com.vaikrochat.backend.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @ManyToMany(mappedBy = "chats")
    private Set<Account> participants = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "image_id")
    private Image chatImage;

    @Data
    @AllArgsConstructor
    public static class ParticipantDTO {
        private int id;
        private String username;
        private String profileImageUrl;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatType type;

    public enum ChatType {
        PRIVATE,
        GROUP
    }

    public Chat() {
        // Default constructor
    }
    public Chat(String name) {
        this.name = name;
    }
    public Chat(String name, Set<Account> participants) {
        this.name = name;
        this.participants = participants;
    }
    public Chat(String name, Set<Account> participants, ChatType type, Image chatImage) {
        this.type = type;
        this.name = name;
        this.participants = participants;
        this.chatImage = chatImage;
    }
    public Chat(String name, Set<Account> participants, ChatType type) {
        this.name = name;
        this.participants = participants;
        this.type = type;
    }

    public void addParticipant(Account account) {
        this.participants.add(account);
    }

    public void setRawParticipants(Set<Account> participants) {
        this.participants = participants;
    }

    public Set<ParticipantDTO> getParticipants() {
        return this.participants.stream().map(
            account -> new ParticipantDTO(account.getId(), 
            account.getUsername(), 
            account.getProfilePicture() != null ? account.getProfilePicture().getUrl() : null))
            .collect((Collectors.toSet()));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Chat)) return false;
        Chat other = (Chat) o;
        
        // Compare private chats by participants
        if (this.type == ChatType.PRIVATE && other.type == ChatType.PRIVATE) {
            if (this.participants.size() != 2 || other.participants.size() != 2) {
                return false;
            }
            
            Set<String> thisUsernames = this.participants.stream()
                .map(Account::getUsername)
                .collect(Collectors.toSet());
            
            Set<String> otherUsernames = other.participants.stream()
                .map(Account::getUsername)
                .collect(Collectors.toSet());
            
            return thisUsernames.equals(otherUsernames);
        }
        
        // Compare group chats by name
        return this.type == other.type 
            && this.name != null 
            && this.name.equalsIgnoreCase(other.name);
    }

    @Override
    public int hashCode() {
        if (type == ChatType.PRIVATE) {
            return participants.stream()
                .map(Account::getUsername)
                .collect(Collectors.toSet())
                .hashCode();
        }
        return name != null ? name.toLowerCase().hashCode() : 0;
    }
}
