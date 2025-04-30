package dev.nicoanderic.brown_course_scheduler.controller;


import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import dev.nicoanderic.brown_course_scheduler.repository.CartItemRepository;
import dev.nicoanderic.brown_course_scheduler.service.CartService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

@RequestMapping("/")
public class CartController {
  private final CartService cartService;
  private final CartItemRepository cartItemRepository;

  public CartController(CartService cartService, CartItemRepository cartItemRepository) {
    this.cartService = cartService;
    this.cartItemRepository = cartItemRepository;
  }

  @GetMapping("/userCart/{userId}")
  public Object getCartItem(@PathVariable String userId) {
    return cartService.getCartItems(userId);
  }

  @GetMapping("/addToCart/{cartItem}")
  public void addToCart(@PathVariable CartItem cartItem) {
    cartService.addToCart(cartItem);
  }


}
