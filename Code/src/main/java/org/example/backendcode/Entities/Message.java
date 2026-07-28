package org.example.backendcode.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "Messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomId;

    private String senderId;
    private String content;
    private LocalDateTime timeSent;


    public Message(String senderId, String content){
        this.senderId = senderId;
        this.content = content;
        this.timeSent = LocalDateTime.now();
    }



}
