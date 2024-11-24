package dtuntar.projects.projectManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
public class Devproject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_DEVPROJECT;
    private String TITLE;
    private String DESCRIPTION_;

    public Devproject() {}

    public Devproject(String TITLE, String DESCRIPTION_) {
        this.TITLE = TITLE;
        this.DESCRIPTION_ = DESCRIPTION_;
    }

    public Long getIdDevproject() {
        return ID_DEVPROJECT;
    }

    public void setIdDevproject(Long ID_DEVPROJECT) {
        this.ID_DEVPROJECT = ID_DEVPROJECT;
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

