package dtuntar.projects.projectManager.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.io.Serializable;

public class Custom_Attribute implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, updatable = false)
    private Long ID_C_ATTRIBUTE;
    @Column(nullable = false, updatable = false)
    private String TABLE_NAME;
    @Column(nullable = false, updatable = false)
    private String TABLE_ROW;
    private String TITLE;
    private Short CONTENT_;
}

