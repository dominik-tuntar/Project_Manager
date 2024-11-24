package dtuntar.projects.projectManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
public class Final_Project implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_F_PROJECT;
    private String TITLE;
    private String DESCRIPTION_;

    public Final_Project() {}

    public Final_Project(String TITLE, String DESCRIPTION_) {
        this.TITLE = TITLE;
        this.DESCRIPTION_ = DESCRIPTION_;
    }

    public Long getIdDevproject() {
        return ID_F_PROJECT;
    }

    public void setIdDevproject(Long ID_F_PROJECT) {
        this.ID_F_PROJECT = ID_F_PROJECT;
    }

    public String getTitle() {
        return TITLE;
    }

    public void setTitle(String TITLE) {
        this.TITLE = TITLE;
    }

    public String getDescription() {
        return DESCRIPTION_;
    }

    public void setDescription(String DESCRIPTION_) {
        this.DESCRIPTION_ = DESCRIPTION_;
    }
}

