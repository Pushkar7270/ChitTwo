package org.example.backendcode.Repository;

import org.example.backendcode.Entities.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GroupRepository extends JpaRepository<ChatGroup,String> {



}
