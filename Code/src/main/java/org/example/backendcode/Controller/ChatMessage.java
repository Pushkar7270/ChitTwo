package org.example.backendcode.Controller;


import lombok.*;

/**
 * @Builder  creates a builder object that helps you construct the real object.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private String content;
    private String sender;
    private messageType type;
}
