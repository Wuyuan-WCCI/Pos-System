package com.pos.project.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pos.project.Entities.GiftCard;
import com.pos.project.Repository.GiftCardRepository;

@Service
public class GiftCardService {

    @Autowired
    private GiftCardRepository giftCardRepository;

    public List<GiftCard> getAllGiftCards() {
        return giftCardRepository.findAll();
    }

    public GiftCard createGiftCard(GiftCard giftCard) {
        return giftCardRepository.save(giftCard);

    }

    public Optional<GiftCard> getGiftCardByCode(String code) {
        return giftCardRepository.findByCode(code);
    }

    public GiftCard updateGiftCard(GiftCard giftCard) {
        return giftCardRepository.save(giftCard);
    }
}
