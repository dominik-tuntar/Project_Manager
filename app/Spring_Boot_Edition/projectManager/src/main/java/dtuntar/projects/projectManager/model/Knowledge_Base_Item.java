package dtuntar.projects.projectManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
public class Knowledge_Base_Item implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_KB_ITEM;

    @Column(nullable = false)
    private String TITLE;

    private String DESCRIPTION_;

    private Short STATUS;

    public Knowledge_Base_Item() {}

    public Knowledge_Base_Item(Long ID_KB_ITEM, Long ID_EMPLOYEE, String TITLE, String DESCRIPTION_, Short STATUS) {
        this.ID_KB_ITEM = ID_KB_ITEM;
        this.TITLE = TITLE;
        this.DESCRIPTION_ = DESCRIPTION_;
        this.STATUS = STATUS;
    }

    public Long getIdKBitem() {
        return ID_KB_ITEM;
    }

    public void setIdKBitem(Long ID_KB_ITEM) {
        this.ID_KB_ITEM = ID_KB_ITEM;
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

    public Short getStatus() {
        return STATUS;
    }

    public void setStatus(Short STATUS) {
        this.STATUS = STATUS;
    }
}

