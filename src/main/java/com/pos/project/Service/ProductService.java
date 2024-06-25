package com.pos.project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.pos.project.Entities.Order;
import com.pos.project.Entities.Product;
import com.pos.project.Repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(long id, Product updatedProduct) {
        Product existingProduct = this.productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product Not found" + id));

        existingProduct.setQuantityInStock(updatedProduct.getQuantityInStock());

        this.productRepository.save(existingProduct);

        return existingProduct;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
