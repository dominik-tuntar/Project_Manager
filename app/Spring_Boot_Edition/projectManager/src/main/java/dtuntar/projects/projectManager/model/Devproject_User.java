package dtuntar.projects.projectManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
public class Devproject_User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_DEVPROJECT_USER;

    private Long ID_EMPLOYEE;
    private Long ID_DEVPROJECT;
    private Long ID_DEVPROJECT_ROLE;

    public Devproject_User() {}

    public Devproject_User(Long ID_EMPLOYEE, Long ID_DEVPROJECT, Long ID_DEVPROJECT_ROLE) {
        this.ID_EMPLOYEE = ID_EMPLOYEE;
        this.ID_DEVPROJECT = ID_DEVPROJECT;
        this.ID_DEVPROJECT_ROLE = ID_DEVPROJECT_ROLE;
    }

    public Long getIdDevprojectUser() {
        return ID_DEVPROJECT_USER;
    }

    public void setIdDevprojectUser(Long ID_DEVPROJECT_USER) {
        this.ID_DEVPROJECT_USER = ID_DEVPROJECT_USER;
    }

    public Long getIdEmployee() {
        return ID_EMPLOYEE;
    }

    public void setIdEmployee(Long ID_EMPLOYEE) {
        this.ID_EMPLOYEE = ID_EMPLOYEE;
    }

    public Long getIdDevproject() {
        return ID_DEVPROJECT;
    }

    public void setIdDevproject(Long ID_DEVPROJECT) {
        this.ID_DEVPROJECT = ID_DEVPROJECT;
    }

    public Long getIdDevprojectRole() {
        return ID_DEVPROJECT_ROLE;
    }

    public void setIdDevprojectRole(Long ID_DEVPROJECT_ROLE) {
        this.ID_DEVPROJECT_ROLE = ID_DEVPROJECT_ROLE;
    }
}

