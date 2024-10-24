package com.example.bus.authentication;

import com.example.bus.User.UserRepository;
import com.twilio.exception.ApiException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final JwtUtils jwtUtils;
    @Autowired
    private UserRepository userRepository;

    public AuthenticationController(AuthenticationService authenticationService, JwtUtils jwtUtils) {
        this.authenticationService = authenticationService;
        this.jwtUtils = jwtUtils;
    }

    public String send_otp(String mobile_number, int role) {
        if (userRepository.existsByPhoneNumber(mobile_number)) {
            try {
                String otpStatus = authenticationService.send_otp(mobile_number);

                return "pending";
            } catch (ApiException e) {
                System.out.println("Failed to send OTP due to API error: " + e.getMessage());

                return "pending";
            }
        } else {
            return "User Not Found";
        }
    }



    public String verify_jwt(String JWT) {
        System.out.println(JWT);
        String username=get_username_using_jwt(JWT);
        System.out.println(username);
        return username;
    }


    public boolean verify_otp(String mobile_number,String otp) {
        return  true;
//        String s=authenticationService.verify_otp(mobile_number,otp);
//        if (s.equals("approved")) {
//            if (userRepository.existsByPhoneNumber(mobile_number)) {
//                User user = userRepository.findByPhoneNumber(mobile_number);
////                String jwtToken = jwtUtils.generateToken(String.valueOf(user.getUserId()));
//
//                Map<String, Object> response = new HashMap<>();
////                String statuss=status;
//
//                return true;
//            } else {
//                return false;
//            }
//        }
//        return true;
    }


    public String get_username_using_jwt(String token) {
        try {
            return jwtUtils.extractUsername(token);
        } catch (ExpiredJwtException ex) {
            System.out.println("Expried token");
            return "-1";
        } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            System.out.println("Invalid token");
            return"-2";
        }
    }

}