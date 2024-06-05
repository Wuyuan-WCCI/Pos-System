package com.pos.project;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @CrossOrigin(origins = "http://192.168.137.1:5173") // Replace with your frontend's URL
    @GetMapping("/api/**")
    public String someEndpoint() {
        return "Response";
    }
}
