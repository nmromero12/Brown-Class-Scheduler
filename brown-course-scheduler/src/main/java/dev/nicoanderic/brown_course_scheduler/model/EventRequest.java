package dev.nicoanderic.brown_course_scheduler.model;

public class EventRequest {
  private String summary;
  private String description;
  private String startTime;
  private String endTime;
  private String userId;

  // Getters and setters
  public String getSummary() { return summary; }
  public void setSummary(String summary) { this.summary = summary; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public String getStartTime() { return startTime; }
  public void setStartTime(String startTime) { this.startTime = startTime; }
  public String getEndTime() { return endTime; }
  public void setEndTime(String endTime) { this.endTime = endTime; }

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }

}
