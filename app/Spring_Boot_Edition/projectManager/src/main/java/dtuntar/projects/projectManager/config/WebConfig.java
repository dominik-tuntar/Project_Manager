package dtuntar.projects.projectManager.config;

import dtuntar.projects.projectManager.interceptors.JwtInterceptor;
import dtuntar.projects.projectManager.interceptors.RoleInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final JwtInterceptor jwtInterceptor;
    private final RoleInterceptor roleInterceptor;

    public WebConfig(JwtInterceptor jwtInterceptor, RoleInterceptor roleInterceptor) {
        this.jwtInterceptor = jwtInterceptor;
        this.roleInterceptor = roleInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor).addPathPatterns("/**"); 
        registry.addInterceptor(roleInterceptor).addPathPatterns("/**"); 
    }
}
