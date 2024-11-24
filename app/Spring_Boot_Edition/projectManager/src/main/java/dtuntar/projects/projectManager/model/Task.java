package dtuntar.projects.projectManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
public class Task implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_TASK;

    @Column(nullable = false)
    private Long ID_EMPLOYEE;

    @Column(nullable = false)
    private Long ID_DEVPROJECT;

    private String DESCRIPTION_;

    private Short STATUS;

    public Task() {}

    public Task(Long ID_EMPLOYEE, Long ID_DEVPROJECT, String DESCRIPTION_, Short STATUS) {
        this.ID_EMPLOYEE = ID_EMPLOYEE;
        this.ID_DEVPROJECT = ID_DEVPROJECT;
        this.DESCRIPTION_ = DESCRIPTION_;
        this.STATUS = STATUS;
    }

    public Long getIdTask() {
        return ID_TASK;
    }

    public void setIdTask(Long ID_TASK) {
        this.ID_TASK = ID_TASK;
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

    public String getDescription() {
        return DESCRIPTION_;
    }

    public void setDescription(String DESCRIPTION_) {
        this.DESCRIPTION_ = DESCRIPTION_;
    }

    public Short getStatus() {
        return STATUS;
    }

    public void setStatus(Short STATUS) {
        this.STATUS = STATUS;
    }
}
