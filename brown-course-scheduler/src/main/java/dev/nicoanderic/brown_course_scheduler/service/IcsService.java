package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.dto.ParsedEventDto;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class IcsService {
  private static final LocalDate SEMESTER_START = LocalDate.of(2025, 9, 3);

  public String convertToIcs(List<ParsedEventDto> eventDto) {
    StringBuilder sb = new StringBuilder();

    sb.append("BEGIN:VCALENDAR\n")
        .append("VERSION:2.0\n")
        .append("PRODID:-//BrownCourseScheduler//EN\n")
        .append("CALSCALE:GREGORIAN\n");




    for (ParsedEventDto parsedEventDto : eventDto) {
      for (String dayStr: parsedEventDto.getDays()) {
        DayOfWeek classDay = convertToDayOfWeek(dayStr);



        sb.append("BEGIN:VEVENT\n")
          .append("UID:").append(UUID.randomUUID()).append("\n")
          .append("DTSTAMP:").append(getCurrentUtcTimestamp()).append("\n")
          .append("SUMMARY:").append(escapeText(parsedEventDto.getDescription())).append("\n")
          .append("DTSTART;TZID=America/New_York:")
          .append(getFirstEventDateTime(parsedEventDto.getStartTime(), classDay)).append("\n")
          .append("DTEND;TZID=America/New_York:")
          .append(getFirstEventDateTime(parsedEventDto.getEndTime(), classDay)).append("\n");

        sb.append("RRULE:FREQ=WEEKLY;BYDAY=").append(dayStr).append("\n");


        sb.append("LOCATION:").append(escapeText(parsedEventDto.getLocation())).append("\n");
        sb.append("DESCRIPTION:").append(escapeText(parsedEventDto.getDescription())).append("\n");
        sb.append("END:VEVENT\n");
    }}

    sb.append("END:VCALENDAR\n");




    return sb.toString();
  }

  private String getFirstEventDateTime(String time, DayOfWeek classDay) {
    // Find first date on or after semester start that matches class day
    LocalDate firstClassDate = SEMESTER_START;
    while (firstClassDate.getDayOfWeek() != classDay) {
      firstClassDate = firstClassDate.plusDays(1);
    }

    DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd");
    // Return in format: 20250903T150000 (date + 'T' + time)
    return dateFormat.format(firstClassDate) + "T" + time;
  }

  private String escapeText(String text) {
    return text.replace("\\", "\\\\")
        .replace(",", "\\,")
        .replace(";", "\\;")
        .replace("\n", "\\n");
  }

  private String getCurrentUtcTimestamp() {
    return ZonedDateTime.now(ZoneOffset.UTC)
        .format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
  }






  public DayOfWeek convertToDayOfWeek(String dayStr) {
    return switch (dayStr.toUpperCase()) {
      case "MO" -> DayOfWeek.MONDAY;
      case "TU" -> DayOfWeek.TUESDAY;
      case "WE" -> DayOfWeek.WEDNESDAY;
      case "TH" -> DayOfWeek.THURSDAY;
      case "FR" -> DayOfWeek.FRIDAY;
      case "SA" -> DayOfWeek.SATURDAY;
      case "SU" -> DayOfWeek.SUNDAY;
      default -> throw new IllegalArgumentException("Invalid day string: " + dayStr);
    };
  }


}
