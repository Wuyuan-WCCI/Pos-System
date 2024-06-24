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
        List<GiftCard> customers = giftCardService.getAllGiftCards();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<GiftCard> createGiftCard(@RequestBody GiftCard giftCard) {
        GiftCard createGiftCard = giftCardService.createGiftCard(giftCard);
        return ResponseEntity.ok(createGiftCard);
    }

    @GetMapping("/{code}")
    public ResponseEntity<GiftCard> getGiftCardByCode(@PathVariable String code) {
        return giftCardService.getGiftCardByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<GiftCard> updateGiftCard(@RequestBody GiftCard giftCard) {
        Optional<GiftCard> existingGiftCardOpt = giftCardRepository.findByCode(giftCard.getCode());
        if (existingGiftCardOpt.isPresent()) {
            GiftCard existingGiftCard = existingGiftCardOpt.get();
            existingGiftCard.setBalance(giftCard.getBalance());
            existingGiftCard.setIsActive(giftCard.getIsActive());
            giftCardRepository.save(existingGiftCard);
            return ResponseEntity.ok(existingGiftCard);
        } else {
            // handle the case where the gift card does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
