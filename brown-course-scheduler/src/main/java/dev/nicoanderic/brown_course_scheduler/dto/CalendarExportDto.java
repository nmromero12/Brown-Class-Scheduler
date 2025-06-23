package dev.nicoanderic.brown_course_scheduler.dto;

public class CalendarExportDto {
  private String courseName;
  private String section;
  private String recurrenceRule;
  private String startTime;
  private String endTime;
  private String location;

  public CalendarExportDto() {}

  public String getCourseName() {
    return courseName;
  }

  public void setCourseName(String courseName) {
    this.courseName = courseName;
  }

  public String getSection() {
    return section;
  }

  public void setSection(String section) {
    this.section = section;
  }

  public String getRecurrenceRule() {
    return recurrenceRule;
  }

  public void setRecurrenceRule(String recurrenceRule) {
    this.recurrenceRule = recurrenceRule;
  }

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

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }
}
