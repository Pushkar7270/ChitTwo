package org.example.backendcode.Controller;


import org.example.backendcode.Entities.ChatGroup;
import org.example.backendcode.Entities.Message;
import org.example.backendcode.Payload.MessageRequest;
import org.example.backendcode.Repository.GroupRepository;
import org.example.backendcode.Repository.MessageRepository;
import org.springframework.cglib.core.Local;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    private GroupRepository groupRepository;
    private final MessageRepository messageRepository;

    public ChatController(GroupRepository groupRepository, MessageRepository messageRepository){
        this.groupRepository = groupRepository;
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/group/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest messageRequest){
        ChatGroup chatGroup = groupRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Group room not found!"));
        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setSenderId(messageRequest.getSender());
        message.setTimeSent(LocalDateTime.now());
        message.setRoomId(roomId);
        return messageRepository.save(message);
    }
}
