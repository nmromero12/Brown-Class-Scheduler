package dev.nicoanderic.brown_course_scheduler.controller;

import dev.nicoanderic.brown_course_scheduler.dto.ParsedEventDto;
import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.service.EventParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarExportController {

  private final EventParserService eventParserService;

  public CalendarExportController(EventParserService eventParserService) {
    this.eventParserService = eventParserService;
  }

  @PostMapping("/parse-cart")
  public ResponseEntity<List<ParsedEventDto>> parseCart(@RequestBody List<CartItem> cartItems) {
    List<ParsedEventDto> parsedList = cartItems.stream()
        .map(eventParserService::parseClassTime)
        .toList();

    return ResponseEntity.ok(parsedList);
  }
}
