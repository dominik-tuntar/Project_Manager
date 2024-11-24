package dtuntar.projects.projectManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
public class Employee implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_EMPLOYEE;
    @Column(nullable = false, updatable = false)
    private Short ID_EMPLOYEE_ROLE;
    private String FULLNAME;
    @Column(nullable = false)
    private String USERNAME;
    @Column(nullable = false)
    private String PASS_WORD;
    @Column(nullable = false)
    private Short STATUS;

    public Employee() {}

    public Employee(Short ID_EMPLOYEE_ROLE, String FULLNAME, String USERNAME, String PASS_WORD, Short STATUS) {
        this.ID_EMPLOYEE_ROLE = ID_EMPLOYEE_ROLE;
        this.FULLNAME = FULLNAME;
        this.USERNAME = USERNAME;
        this.STATUS = STATUS;
    }

    public Long getIdEmployee() {
        return ID_EMPLOYEE;
    }

    public void setIdEmployee(Long ID_EMPLOYEE) {
        this.ID_EMPLOYEE = ID_EMPLOYEE;
    }

    public Short getIdEmployeeRole() {
        return ID_EMPLOYEE_ROLE;
    }

    public void setIdEmployeeRole(Short ID_EMPLOYEE_ROLE) {
        this.ID_EMPLOYEE_ROLE = ID_EMPLOYEE_ROLE;
    }

    public String getFullname() {
        return FULLNAME;
    }

    public void setFullname(String FULLNAME) {
        this.FULLNAME = FULLNAME;
    }

    public String getUsername() {
        return USERNAME;
    }

    public void setUsername(String USERNAME) {
        this.USERNAME = USERNAME;
    }

    public String getPassword() {
        return PASS_WORD;
    }

    public void setPassword(String PASS_WORD) {
        this.PASS_WORD = PASS_WORD;
    }

    public Short getStatus() {
        return STATUS;
    }

    public void setStatus(Short STATUS) {
        this.STATUS = STATUS;
    }
}
