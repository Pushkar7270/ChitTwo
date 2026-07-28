package org.example.backendcode.Entities;


import jakarta.persistence.*;
import lombok.*;


import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "chat_groups")   //Table name in sql
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Tells the system to auto-generate a unique string ID
    @Column(name = "roomId", length = 36)
    private String roomId;

    /**
     * @OneToMany simply fetches all the messages that belong to the roomId
     * @JoinColumn means that the roomId in Message class is same as that of roomId in chatGroup
     */
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "roomId", referencedColumnName = "roomId", insertable = false, updatable = false)
    @Builder.Default
    private List<Message> message = new ArrayList<>();

    private String roomName;




}
