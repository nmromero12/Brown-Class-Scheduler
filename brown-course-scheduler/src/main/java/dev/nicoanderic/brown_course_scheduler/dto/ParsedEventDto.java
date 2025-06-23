package dev.nicoanderic.brown_course_scheduler.dto;

import java.util.List;

public class ParsedEventDto {

  private String startTime;
  private String endTime;
  private List<String> days;
  private String location;
  private String description;
  private String recurrenceRule;

  // ✅ No-arg constructor (needed for serialization/deserialization)
  public ParsedEventDto() {}

  // ✅ All-args constructor
  public ParsedEventDto(String startTime, String endTime, List<String> days,
      String location, String description, String recurrenceRule) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.days = days;
    this.location = location;
    this.description = description;
    this.recurrenceRule = recurrenceRule;
  }

  // ✅ Getters and Setters
  public String getStartTime() {
    return startTime;
  }

  public void setStartTime(String startTime) {
    this.startTime = startTime;
  }

  public String getEndTime() {
    return endTime;
  }

  public void setEndTime(String endTime) {
    this.endTime = endTime;
  }

  public List<String> getDays() {
    return days;
  }

  public void setDays(List<String> days) {
    this.days = days;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getRecurrenceRule() {
    return recurrenceRule;
  }

  public void setRecurrenceRule(String recurrenceRule) {
    this.recurrenceRule = recurrenceRule;
  }
}
