package com.pos.project.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.project.Entities.GiftCard;
import com.pos.project.Repository.GiftCardRepository;
import com.pos.project.Service.GiftCardService;

@RestController
@RequestMapping("/api/giftcards")
@CrossOrigin(origins = "http://localhost:5173")
public class GiftCardController {
    @Autowired
    private GiftCardService giftCardService;

    @Autowired
    private GiftCardRepository giftCardRepository;

    @GetMapping
    public ResponseEntity<List<GiftCard>> getAllGiftCards() {
        List<GiftCard> giftCards = giftCardService.getAllGiftCards();
        return new ResponseEntity<>(giftCards, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createGiftCard(@RequestBody GiftCard giftCard) {
        try {
            // Validate gift card code
            if (giftCard.getCode() == null || giftCard.getCode().isEmpty()) {
                return ResponseEntity.badRequest().body("Gift card code cannot be null or empty.");
            }

            // Check if gift card with the same code already exists
            Optional<GiftCard> existingGiftCardOpt = giftCardRepository.findByCode(giftCard.getCode());
            if (existingGiftCardOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Gift card with code " + giftCard.getCode() + " already exists.");
            }

            // Proceed with creating the gift card
            GiftCard createdGiftCard = giftCardService.createGiftCard(giftCard);
            return ResponseEntity.ok(createdGiftCard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating gift card: " + e.getMessage());
        }
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> getGiftCardByCode(@PathVariable String code) {
        Optional<GiftCard> giftCardOpt = giftCardService.getGiftCardByCode(code);
        return giftCardOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<?> updateGiftCard(@RequestBody GiftCard giftCard) {
        try {
            Optional<GiftCard> existingGiftCardOpt = giftCardRepository.findByCode(giftCard.getCode());
            if (existingGiftCardOpt.isPresent()) {
                GiftCard existingGiftCard = existingGiftCardOpt.get();
                existingGiftCard.setBalance(giftCard.getBalance());
                existingGiftCard.setIsActive(giftCard.getIsActive());
                giftCardRepository.save(existingGiftCard);
                return ResponseEntity.ok(existingGiftCard);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Gift card with code " + giftCard.getCode() + " not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating gift card: " + e.getMessage());
        }
    }
}
