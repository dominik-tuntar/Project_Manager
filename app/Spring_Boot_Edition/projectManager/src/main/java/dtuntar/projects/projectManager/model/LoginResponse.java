package dtuntar.projects.projectManager.model;

public class LoginResponse {
    private boolean success;
    private String message;
    private Employee employee;
    private String token;

    // Constructor
    public LoginResponse(boolean success, String message, Employee employee, String token) {
        this.success = success;
        this.message = message;
        this.employee = employee;
        this.token = token;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getToken() { // New getter for token
        return token;
    }

    public void setToken(String token) { // New setter for token
        this.token = token;
    }
}

