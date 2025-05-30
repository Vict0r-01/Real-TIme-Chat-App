package com.vaikrochat.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Chat;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    
    List<Chat> findChatsById(int accountId);
    Optional<Account> findByUsername(String username);
}
