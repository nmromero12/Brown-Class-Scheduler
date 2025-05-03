package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.model.EventRequest;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.HashMap;

public class EventParserService {


  public EventRequest parse(EventRequest eventRequest) {
    String recurrenceRelation = "RRULE:FREQ=WEEKLY;BYDAY=";
    String timeZone = "-5:00";
    String timeLocation = eventRequest.getParseTime();
    String[] timeLocationSplit = timeLocation.split(" ");
    String dayString = timeLocationSplit[0];
    String timeString = timeLocationSplit[1];
    String[] timeSplit = timeString.split("-");
    String startTime = timeSplit[0];
    String endTime = timeSplit[1];

    LocalDate localDate = LocalDate.now();
    DateTimeFormatter timeFormatter = new DateTimeFormatterBuilder()
        .parseCaseInsensitive() // Handle "PM" or "pm"
        .appendPattern("h[:mm]a") // Primary pattern for "2pm" or "2:50pm"
        .toFormatter();

    LocalTime startLocalTime = LocalTime.parse(startTime.toLowerCase(), timeFormatter);
    LocalTime endLocalTime = LocalTime.parse(endTime.toLowerCase(), timeFormatter);

    ZoneId zoneId = ZoneId.of(timeZone);
    ZonedDateTime startZonedDateTime = ZonedDateTime.of(localDate, startLocalTime, zoneId);
    ZonedDateTime endZonedDateTime = ZonedDateTime.of(localDate, endLocalTime, zoneId);

    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    String formattedStartTime = startZonedDateTime.format(isoFormatter); // e.g., "2025-05-02T14:00:00-05:00"
    String formattedEndTime = endZonedDateTime.format(isoFormatter);

    HashMap<String, String> map = new HashMap<>();
    map.put("M", "MO");
    map.put("W", "WE");
    map.put("T", "TU");
    map.put("Th", "TH");
    map.put("F", "FR");

    if (dayString.contains("M")) {
      recurrenceRelation += map.get("M") + ",";
    }
    if (dayString.contains("W")) {
      recurrenceRelation += map.get("W") + ",";
    }
    if (dayString.contains("T")) {
      recurrenceRelation += map.get("T") + ",";
    }
    if (dayString.contains("Th")) {
      recurrenceRelation += map.get("Th") + ",";
    }
    if (dayString.contains("F")) {
      recurrenceRelation += map.get("F") + ",";
    }

    // Remove trailing comma
    recurrenceRelation = recurrenceRelation.substring(0, recurrenceRelation.length() - 1);

    return new EventRequest(eventRequest.getSummary(), eventRequest.getDescription(), eventRequest.getParseTime(), recurrenceRelation, formattedStartTime, formattedEndTime, eventRequest.getUserId());


  }





}
