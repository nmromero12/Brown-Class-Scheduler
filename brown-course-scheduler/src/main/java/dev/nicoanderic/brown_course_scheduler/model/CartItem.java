package dev.nicoanderic.brown_course_scheduler.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class CartItem {
  @Id
  @GeneratedValue
  private Long id;



}
