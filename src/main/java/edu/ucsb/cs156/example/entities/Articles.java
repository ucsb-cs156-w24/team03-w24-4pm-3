package edu.ucsb.cs156.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "articles")
public class Articles {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; 

  private String title;
  private String url;
  private String explanation;
  private String email; 
  private LocalDateTime dateAdded;
}
