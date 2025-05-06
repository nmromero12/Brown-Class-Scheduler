package dev.nicoanderic.brown_course_scheduler.repository;

import dev.nicoanderic.brown_course_scheduler.model.CartItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
  List<CartItem> findByuserName(String userName);
  CartItem findByitemId(int itemId);
  CartItem findByCrn(String crn);

  CartItem findByUserNameAndCrn(String userName, String crn);  // <- Add this

  void deleteByCrn(String crn);

  void deleteByCrnAndUserName(String crn, String username);
}
