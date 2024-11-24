package dtuntar.projects.projectManager.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;

public class JwtUtil {

    private static final String JWT_SECRET = "Token89#!1"; // Your secret key for signing JWTs

    // Method to extract role from the token
    public static int getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(JWT_SECRET)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("role", Integer.class); // Assuming the role is stored in the "role" claim
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token is expired");
        } catch (SignatureException e) {
            throw new RuntimeException("Invalid JWT signature");
        }
    }
}
