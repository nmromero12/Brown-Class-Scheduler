package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.dao.DataAccessException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceTest {

  @Mock
  private CartItemRepository cartItemRepository;

  @InjectMocks
  private CartService cartService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void getCartItems_returnsCartItems_whenItemsExist() {
    String uid = "user123";
    CartItem item = new CartItem();
    item.setUserName(uid);
    item.setCrn("CRN123");

    when(cartItemRepository.findByuid(uid)).thenReturn(List.of(item));

    Object result = cartService.getCartItems(uid);

    assertTrue(result instanceof Map);
    Map<String, Object> resultMap = (Map<String, Object>) result;
    assertEquals("success", resultMap.get("result"));
    assertEquals(1, ((List<?>) resultMap.get("items")).size());
    verify(cartItemRepository).findByuid(uid);
  }

  @Test
  void getCartItems_returnsNoCart_whenEmpty() {
    String uid = "emptyUser";
    when(cartItemRepository.findByuid(uid)).thenReturn(Collections.emptyList());

    Object result = cartService.getCartItems(uid);

    assertTrue(result instanceof Map);
    Map<String, Object> resultMap = (Map<String, Object>) result;
    assertEquals("No cart", resultMap.get("result"));
    assertNull(resultMap.get("items"));
    verify(cartItemRepository).findByuid(uid);
  }

  @Test
  void addToCart_savesItem_whenNotExists() {
    CartItem item = new CartItem();
    item.setUserName("userA");
    item.setCrn("CRN001");

    when(cartItemRepository.findByUidAndCrn("userA", "CRN001")).thenReturn(null);

    cartService.addToCart(item);

    verify(cartItemRepository).saveAndFlush(item);
  }

  @Test
  void addToCart_doesNotSave_whenItemAlreadyExists() {
    CartItem item = new CartItem();
    item.setUserName("userB");
    item.setCrn("CRN002");

    when(cartItemRepository.findByUidAndCrn("userB", "CRN002")).thenReturn(new CartItem());

    cartService.addToCart(item);

    verify(cartItemRepository, never()).saveAndFlush(any());
  }

  @Test
  void addToCart_handlesExceptionGracefully() {
    CartItem item = new CartItem();
    item.setUserName("userX");
    item.setCrn("CRN_ERR");

    when(cartItemRepository.findByUidAndCrn("userX", "CRN_ERR"))
        .thenThrow(new DataAccessException("DB Error") {});

    assertDoesNotThrow(() -> cartService.addToCart(item));
  }

  @Test
  void deleteFromCart_deletesAndFlushes() {
    String crn = "CRN123";
    String username = "user123";

    doNothing().when(cartItemRepository).deleteByCrnAndUid(crn, username);

    cartService.deleteFromCart(crn, username);

    verify(cartItemRepository).deleteByCrnAndUid(crn, username);
    verify(cartItemRepository).flush();
  }
}
