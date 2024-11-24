package dtuntar.projects.projectManager.interceptors;

import dtuntar.projects.projectManager.annotations.RoleRequired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

@Component
public class RoleInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        if (request.getRequestURI().equals("/api/login")) {
            return true;
        }

        
        Integer userRole = (Integer) request.getAttribute("userRole");

        if (userRole == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: No valid role found.");
            return false; 
        }

        
        Method method = ((org.springframework.web.method.HandlerMethod) handler).getMethod();

        if (method.isAnnotationPresent(RoleRequired.class)) {
            RoleRequired roleRequired = method.getAnnotation(RoleRequired.class);

            
            for (int role : roleRequired.value()) {
                if (role == userRole) {
                    return true; 
                }
            }

            
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Forbidden: You do not have the required role.");
            return false;
        }

        return true; 
    }
}