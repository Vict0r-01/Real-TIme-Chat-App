package com.vaikrochat.backend.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class ParticipantsId {

    private int chatId;
    private int accountId;
}
