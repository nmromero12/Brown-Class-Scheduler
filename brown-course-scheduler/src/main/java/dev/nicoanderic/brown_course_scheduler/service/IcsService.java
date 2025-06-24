package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.dto.ParsedEventDto;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class IcsService {

  public String convertToIcs(List<ParsedEventDto> eventDto) {
    StringBuilder sb = new StringBuilder();

    sb.append("BEGIN:VCALENDAR\n")
        .append("VERSION:2.0\n")
        .append("PRODID:-//BrownCourseScheduler//EN\n")
        .append("CALSCALE:GREGORIAN\n");


    for (ParsedEventDto parsedEventDto : eventDto) {



      sb.append("BEGIN:VEVENT\n")
          .append("UID:").append(UUID.randomUUID()).append("\n")
          .append("DTSTAMP:").append(getCurrentUtcTimestamp()).append("\n")
          .append("SUMMARY:").append(escapeText(parsedEventDto.getDescription())).append("\n")
          .append("DTSTART;TZID=America/New_York:")
          .append(getNextStartDateTime(parsedEventDto.getStartTime())).append("\n")
          .append("DTEND;TZID=America/New_York:")
          .append(getNextStartDateTime(parsedEventDto.getEndTime())).append("\n");

      sb.append("RRULE:").append(parsedEventDto.getRecurrence()).append("\n");


      sb.append("LOCATION:").append(escapeText(parsedEventDto.getLocation())).append("\n");
      sb.append("DESCRIPTION:").append(escapeText(parsedEventDto.getDescription())).append("\n");
      sb.append("END:VEVENT\n");
    }

    sb.append("END:VCALENDAR\n");




    return sb.toString();
  }

  private String getNextStartDateTime(String time) {
    LocalDate now = LocalDate.now();
    LocalDate nextMonday = now.with(java.time.DayOfWeek.MONDAY);
    DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd");

    return dateFormat.format(nextMonday) + "T" + time;
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

}
