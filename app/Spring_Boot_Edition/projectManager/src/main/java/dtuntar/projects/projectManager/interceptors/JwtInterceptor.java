package dtuntar.projects.projectManager.interceptors;

import dtuntar.projects.projectManager.utils.JwtUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        if (request.getRequestURI().equals("/api/login")) {
            return true;
        }

        String token = request.getHeader("Authorization");

        if (token == null || !token.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); 
            response.getWriter().write("Unauthorized: No token provided.");
            return false; 
        }

        
        token = token.substring(7);

        try {
            
            int role = JwtUtil.getRoleFromToken(token); 
            request.setAttribute("userRole", role); 
            return true;
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Invalid or expired token.");
            return false;
        }
    }
}