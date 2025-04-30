package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;


@Service
public class CartService {
  private final CartItemRepository cartItemRepository;

  public CartService(CartItemRepository cartItemRepository) {
    this.cartItemRepository = cartItemRepository;
  }

  public Object getCartItems(String clerkUserId) {
    Map<String, Object> result = new HashMap<>();
    List<CartItem> userItems = cartItemRepository.findByUserId(clerkUserId);
    if (userItems.isEmpty()) {
      result.put("message", "No cart");
    } else {
      result.put("message", "success");
      result.put("items", userItems);
    }
    return result;
  }


  public void addToCart(CartItem cartItem) {
    String userId = cartItem.getUserid();
    if (cartItemRepository.findByUserId(userId) == null) {
      cartItemRepository.saveAndFlush(cartItem);
    }
  }

}
