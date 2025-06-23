package dev.nicoanderic.brown_course_scheduler.controller;

import dev.nicoanderic.brown_course_scheduler.dto.ParsedEventDto;
import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.service.EventParserService;
import dev.nicoanderic.brown_course_scheduler.service.IcsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarExportController {

  private final EventParserService eventParserService;
  private final IcsService icsService;

  public CalendarExportController(EventParserService eventParserService, IcsService icsService) {
    this.eventParserService = eventParserService;
    this.icsService = icsService;
  }

  @PostMapping("/parse-cart")
  public ResponseEntity<List<ParsedEventDto>> parseCart(@RequestBody List<CartItem> cartItems) {
    List<ParsedEventDto> parsedList = cartItems.stream()
        .map(eventParserService::parseClassTime)
        .toList();

    return ResponseEntity.ok(parsedList);
  }

  @PostMapping("/ics")
  public ResponseEntity<String> formatIcs(@RequestBody List<ParsedEventDto> parsedCartItems) {
    String icsFile = icsService.convertToIcs(parsedCartItems);
    if (parsedCartItems == null || parsedCartItems.isEmpty()) {
      return ResponseEntity.badRequest().body("No events to convert");
    }
    return ResponseEntity.ok(icsFile);
  }
}
