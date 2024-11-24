package dtuntar.projects.projectManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
public class Inbound_Request implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_I_REQUEST;

    @Column(nullable = false)
    private String TITLE;

    @Column(nullable = false)
    private String SENDER_NAME;

    @Column(nullable = false)
    private String DESCRIPTION_;

    public Inbound_Request() {}

    public Inbound_Request(String TITLE, String SENDER_NAME, String DESCRIPTION_) {
        this.TITLE = TITLE;
        this.SENDER_NAME = SENDER_NAME;
        this.DESCRIPTION_ = DESCRIPTION_;
    }

    public Long getIdIRequest() {
        return ID_I_REQUEST;
    }

    public void setIdIRequest(Long ID_I_REQUEST) {
        this.ID_I_REQUEST = ID_I_REQUEST;
    }

    public String getTitle() {
        return TITLE;
    }

    public void setTitle(String TITLE) {
        this.TITLE = TITLE;
    }

    public String getSenderName() {
        return SENDER_NAME;
    }

    public void setSenderName(String SENDER_NAME) {
        this.SENDER_NAME = SENDER_NAME;
    }

    public String getDescription() {
        return DESCRIPTION_;
    }

    public void setDescription(String DESCRIPTION_) {
        this.DESCRIPTION_ = DESCRIPTION_;
    }
}
