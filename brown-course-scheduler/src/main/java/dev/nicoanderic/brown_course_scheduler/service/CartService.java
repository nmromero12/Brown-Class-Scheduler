package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;

import java.lang.reflect.Executable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class CartService {
  private final CartItemRepository cartItemRepository;

  public CartService(CartItemRepository cartItemRepository) {
    this.cartItemRepository = cartItemRepository;
  }

  public Object getCartItems(String clerkUserId) {
    Map<String, Object> result = new HashMap<>();
    List<CartItem> userItems = cartItemRepository.findByuserName(clerkUserId);
    if (userItems.isEmpty()) {
      result.put("result", "No cart");
    } else {
      result.put("result", "success");
      result.put("items", userItems);
    }
    return result;
  }


  public void addToCart(CartItem cartItem) {

    try {
      CartItem existing = cartItemRepository.findByUserNameAndCrn(cartItem.getUserName(), cartItem.getCrn());

    if (existing == null) {
      cartItemRepository.saveAndFlush(cartItem);
    }} catch (Exception e) {
      System.out.println("Already added to cart");
    }
  }
  @Transactional
  public void deleteFromCart(String crn, String username) {
    cartItemRepository.deleteByCrnAndUserName(crn, username);
    cartItemRepository.flush();
  }

}
