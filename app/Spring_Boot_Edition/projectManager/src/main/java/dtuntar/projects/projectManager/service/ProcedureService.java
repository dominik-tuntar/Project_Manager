package dtuntar.projects.projectManager.service;

import dtuntar.projects.projectManager.model.Employee;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import org.hibernate.dialect.OracleTypes;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedCaseInsensitiveMap;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProcedureService {
    private final JdbcTemplate jdbcTemplate;
    private SimpleJdbcCall GETALLUSERSCALL;
    private SimpleJdbcCall GETCUSTOMATTRIBUTESCALL;
    private static SimpleJdbcCall CREATECUSTOMATTRIBUTECALL;
    private static SimpleJdbcCall UPDATECUSTOMATTRIBUTECALL;
    private static SimpleJdbcCall DELETECUSTOMATTRIBUTECALL;
    private static SimpleJdbcCall CREATEUSERCALL;
    private static SimpleJdbcCall UPDATEUSERCALL;
    private static SimpleJdbcCall DISABLEUSERCALL;
    private static SimpleJdbcCall ENABLEUSERCALL;
    private SimpleJdbcCall GETALLCLIENTSCALL;
    private static SimpleJdbcCall CREATECLIENTCALL;
    private static SimpleJdbcCall UPDATECLIENTCALL;
    private static SimpleJdbcCall DELETECLIENTCALL;
    private SimpleJdbcCall GETALLINBOUNDREQUESTSCALL;
    private static SimpleJdbcCall CREATEINBOUNDREQUESTCALL;
    private static SimpleJdbcCall UPDATEINBOUNDREQUESTCALL;
    private static SimpleJdbcCall DELETEINBOUNDREQUESTCALL;
    private SimpleJdbcCall GETALLPROJECTSCALL;
    private static SimpleJdbcCall CREATEPROJECTCALL;
    private static SimpleJdbcCall UPDATEPROJECTCALL;
    private static SimpleJdbcCall DELETEPROJECTCALL;
    private SimpleJdbcCall GETELIGIBLEPROJECTUSERSCALL;
    private SimpleJdbcCall GETPROJECTUSERSCALL;
    private SimpleJdbcCall GETPROJECTLEADCALL;
    private SimpleJdbcCall CREATEPROJECTUSERCALL;
    private SimpleJdbcCall DELETEPROJECTUSERCALL;
    private SimpleJdbcCall UPDATELEADCALL;
    private SimpleJdbcCall DELETELEADCALL;
    private SimpleJdbcCall GETLEADPROJECTSCALL;
    private SimpleJdbcCall GETUSERPROJECTTASKSCALL;
    private static SimpleJdbcCall GETPROJECTTASKSCALL;
    private static SimpleJdbcCall CREATETASKCALL;
    private static SimpleJdbcCall UPDATETASKCALL;
    private static SimpleJdbcCall DELETETASKCALL;
    private static SimpleJdbcCall UPDATETASKSTATUSCALL;
    private SimpleJdbcCall GETPENDINGTASKSCALL;
    private static SimpleJdbcCall CREATEFINALPROJECTCALL;
    private SimpleJdbcCall GETALLFINALPROJECTSCALL;
    private static SimpleJdbcCall DELETEFINALPROJECTCALL;
    private static SimpleJdbcCall DISABLEFINALPROJECTCALL;
    private static SimpleJdbcCall ENABLEFINALPROJECTCALL;
    private static SimpleJdbcCall UPDATEFINALPROJECTCALL;
    private static SimpleJdbcCall CREATEKNOWLEDGEBASEITEMCALL;
    private static SimpleJdbcCall DELETEKNOWLEDGEBASEITEMCALL;
    private SimpleJdbcCall GETACTIVITYLOGCALL;
    private static SimpleJdbcCall LOGACTIVITYCALL;

    public ProcedureService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final String JWT_SECRET = "insert_token";

    public String login(String username, String password, Employee employee) {
        int loginResult = 0;
        Connection conn = null;
        CallableStatement stmt = null;

        try {
            conn = DriverManager.getConnection("insert_connection_data");
            String sql = "{CALL LOGIN(?, ?, ?, ?, ?, ?, ?, ?)}";
            stmt = conn.prepareCall(sql);

            stmt.setString(1, username);
            stmt.setString(2, password);

            stmt.registerOutParameter(3, Types.INTEGER);
            stmt.registerOutParameter(4, Types.INTEGER);
            stmt.registerOutParameter(5, Types.VARCHAR);
            stmt.registerOutParameter(6, Types.VARCHAR);
            stmt.registerOutParameter(7, Types.INTEGER);
            stmt.registerOutParameter(8, Types.INTEGER);

            stmt.execute();

            employee.setIdEmployee(stmt.getLong(3));
            employee.setIdEmployeeRole(stmt.getShort(4));
            employee.setFullname(stmt.getString(5));
            employee.setUsername(stmt.getString(6));
            employee.setStatus(stmt.getShort(7));
            loginResult = stmt.getInt(8);


            if (loginResult == 1) {

                String token = Jwts.builder()
                        .setSubject(username)
                        .claim("idEmployee", employee.getIdEmployee())
                        .claim("role", employee.getIdEmployeeRole())
                        .signWith(SignatureAlgorithm.HS256, JWT_SECRET)
                        .compact();

                return token;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }


    @PostConstruct
    public void init() {
        this.GETALLUSERSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETALLUSERS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR)
                );
        this.GETCUSTOMATTRIBUTESCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETCUSTOMATTRIBUTES")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("table_name", Types.VARCHAR),
                        new SqlParameter("table_row", Types.NUMERIC)
                );
        CREATECUSTOMATTRIBUTECALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATECUSTOMATTRIBUTE")
                .declareParameters(
                        new SqlParameter("table_name", Types.VARCHAR),
                        new SqlParameter("table_row", Types.NUMERIC),
                        new SqlParameter("title", Types.VARCHAR),
                        new SqlParameter("content_", Types.VARCHAR)
                );

        UPDATECUSTOMATTRIBUTECALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATECUSTOMATTRIBUTE")
                .declareParameters(
                        new SqlParameter("v_id_c_attribute", Types.NUMERIC),
                        new SqlParameter("v_title", Types.VARCHAR),
                        new SqlParameter("v_content_", Types.VARCHAR)
                );

        DELETECUSTOMATTRIBUTECALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETECUSTOMATTRIBUTE")
                .declareParameters(
                        new SqlParameter("v_id_c_attribute", Types.NUMERIC)
                );

        CREATEUSERCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATEUSER")
                .declareParameters(
                        new SqlParameter("fullname", Types.VARCHAR),
                        new SqlParameter("username", Types.VARCHAR),
                        new SqlParameter("pass_word", Types.VARCHAR)
                );

        UPDATEUSERCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATEUSER")
                .declareParameters(
                        new SqlParameter("v_id_employee", Types.NUMERIC),
                        new SqlParameter("v_fullname", Types.VARCHAR),
                        new SqlParameter("v_username", Types.VARCHAR),
                        new SqlParameter("v_pass_word", Types.VARCHAR)
                );

        DISABLEUSERCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DISABLEUSER")
                .declareParameters(
                        new SqlParameter("v_id_employee", Types.NUMERIC)
                );

        ENABLEUSERCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("ENABLEUSER")
                .declareParameters(
                        new SqlParameter("v_id_employee", Types.NUMERIC)
                );

        this.GETALLCLIENTSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETALLCLIENTS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR)
                );

        CREATECLIENTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATECLIENT")
                .declareParameters(
                        new SqlParameter("name_", Types.VARCHAR),
                        new SqlParameter("email", Types.VARCHAR)
                );

        UPDATECLIENTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATECLIENT")
                .declareParameters(
                        new SqlParameter("v_id_client", Types.NUMERIC),
                        new SqlParameter("v_name_", Types.VARCHAR),
                        new SqlParameter("v_email", Types.VARCHAR)
                );

        DELETECLIENTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETECLIENT")
                .declareParameters(
                        new SqlParameter("v_id_client", Types.NUMERIC)
                );

        this.GETALLINBOUNDREQUESTSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETALLINBOUNDREQUESTS")
                .declareParameters(new SqlOutParameter("result_cursor", OracleTypes.CURSOR));

        CREATEINBOUNDREQUESTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATEINBOUNDREQUEST")
                .declareParameters(
                        new SqlParameter("title", Types.VARCHAR),
                        new SqlParameter("sender_name", Types.VARCHAR),
                        new SqlParameter("description_", Types.VARCHAR)
                );

        UPDATEINBOUNDREQUESTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATEINBOUNDREQUEST")
                .declareParameters(
                        new SqlParameter("v_id_i_request", Types.NUMERIC),
                        new SqlParameter("v_title", Types.VARCHAR),
                        new SqlParameter("v_sender_name", Types.VARCHAR),
                        new SqlParameter("v_description_", Types.VARCHAR)
                );

        DELETEINBOUNDREQUESTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETEINBOUNDREQUEST")
                .declareParameters(new SqlParameter("v_id_i_request", Types.NUMERIC));

        this.GETALLPROJECTSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETALLPROJECTS")
                .declareParameters(new SqlOutParameter("result_cursor", OracleTypes.CURSOR));

        CREATEPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATEPROJECT")
                .declareParameters(
                        new SqlParameter("title", Types.VARCHAR),
                        new SqlParameter("description_", Types.VARCHAR)
                );

        UPDATEPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATEPROJECT")
                .declareParameters(
                        new SqlParameter("v_id_devproject", Types.NUMERIC),
                        new SqlParameter("v_title", Types.VARCHAR),
                        new SqlParameter("v_description_", Types.VARCHAR)
                );

        DELETEPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETEPROJECT")
                .declareParameters(new SqlParameter("v_id_devproject", Types.NUMERIC));

        this.GETELIGIBLEPROJECTUSERSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETELIGIBLEPROJECTUSERS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );

        this.GETPROJECTUSERSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETPROJECTUSERS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );

        this.GETPROJECTLEADCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETPROJECTLEAD")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );

        this.CREATEPROJECTUSERCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATEPROJECTUSER")
                .declareParameters(
                        new SqlParameter("id_employee", Types.NUMERIC),
                        new SqlParameter("id_devproject", Types.NUMERIC)
                );

        CREATETASKCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATETASK")
                .declareParameters(
                        new SqlParameter("id_devproject", Types.NUMERIC),
                        new SqlParameter("id_employee", Types.NUMERIC),
                        new SqlParameter("description_", Types.VARCHAR),
                        new SqlOutParameter("new_id_task", Types.NUMERIC)
                );

        UPDATETASKCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATETASK")
                .declareParameters(
                        new SqlParameter("v_id_task", Types.NUMERIC),
                        new SqlParameter("v_id_employee", Types.NUMERIC),
                        new SqlParameter("v_description_", Types.VARCHAR)
                );

        UPDATETASKSTATUSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATETASKSTATUS")
                .declareParameters(
                        new SqlParameter("v_id_task", Types.NUMERIC),
                        new SqlParameter("v_status", Types.NUMERIC)
                );

        DELETETASKCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETETASK")
                .declareParameters(
                        new SqlParameter("v_id_task", Types.NUMERIC)
                );

        this.DELETEPROJECTUSERCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETEPROJECTUSER")
                .declareParameters(
                        new SqlParameter("v_id_employee", Types.NUMERIC),
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );

        this.UPDATELEADCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATELEAD")
                .declareParameters(
                        new SqlParameter("v_id_employee", Types.NUMERIC),
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );

        this.DELETELEADCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETELEAD")
                .declareParameters(
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );
        this.GETLEADPROJECTSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETLEADPROJECTS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_employee", Types.NUMERIC)
                );

        this.GETUSERPROJECTTASKSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETUSERPROJECTTASKS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_employee", Types.NUMERIC),
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );

        GETPROJECTTASKSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETPROJECTTASKS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_devproject", Types.NUMERIC)
                );

        this.GETPENDINGTASKSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETPENDINGTASKS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_employee", Types.NUMERIC)
                );

        CREATEFINALPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATEFINALPROJECT")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR),
                        new SqlParameter("v_id_devproject", Types.NUMERIC),
                        new SqlParameter("title", Types.VARCHAR),
                        new SqlParameter("description_", Types.VARCHAR)
                );

        this.GETALLFINALPROJECTSCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETALLFINALPROJECTS")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR)
                );

        DELETEFINALPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETEFINALPROJECT")
                .declareParameters(
                        new SqlParameter("v_id_f_project", Types.NUMERIC)
                );

        DISABLEFINALPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DISABLEFPROJECT")
                .declareParameters(
                        new SqlParameter("v_id_f_project", Types.NUMERIC)
                );

        ENABLEFINALPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("ENABLEFPROJECT")
                .declareParameters(
                        new SqlParameter("v_id_f_project", Types.NUMERIC)
                );

        UPDATEFINALPROJECTCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UPDATEFINALPROJECT")
                .declareParameters(
                        new SqlParameter("v_id_f_project", Types.NUMERIC),
                        new SqlParameter("v_title", Types.VARCHAR),
                        new SqlParameter("v_description_", Types.VARCHAR)
                );

        CREATEKNOWLEDGEBASEITEMCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CREATEKNOWLEDGEBASEITEM")
                .declareParameters(
                        new SqlParameter("title", Types.VARCHAR),
                        new SqlParameter("description", Types.VARCHAR),
                        new SqlOutParameter("new_id_kb_item", Types.NUMERIC)
                );

        DELETEKNOWLEDGEBASEITEMCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("DELETEKNOWLEDGEBASEITEM")
                .declareParameters(
                        new SqlParameter("v_id_kb_item", Types.NUMERIC)
                );

        this.GETACTIVITYLOGCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GETACTIVITYLOG")
                .declareParameters(
                        new SqlOutParameter("result_cursor", OracleTypes.CURSOR)
                );

        LOGACTIVITYCALL = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("LOGACTIVITY")
                .declareParameters(
                        new SqlParameter("username", Types.VARCHAR),
                        new SqlParameter("db_action", Types.VARCHAR),
                        new SqlParameter("db_object", Types.VARCHAR)
                );
    }

    public List<Map<String, Object>> GETALLUSERS() {

        Map<String, Object> result = GETALLUSERSCALL.execute();


        Object employeesObject = result.get("result_cursor");
        if (employeesObject instanceof List<?>) {
            return (List<Map<String, Object>>) employeesObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: \" + employeesObject.getClass().getName()");
        }
    }

    public List<Map<String, Object>> GETCUSTOMATTRIBUTES(String tableName, String tableRow) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("table_name", tableName);
        inParams.put("table_row", tableRow);


        Map<String, Object> result = GETCUSTOMATTRIBUTESCALL.execute(inParams);


        Object attributesObject = result.get("result_cursor");
        if (attributesObject instanceof List<?>) {
            return (List<Map<String, Object>>) attributesObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + attributesObject.getClass().getName());
        }
    }

    public static void CREATECUSTOMATTRIBUTE(String table_name, Integer table_row, String title, String content_) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("table_name", table_name);
        inParams.put("table_row", table_row);
        inParams.put("title", title);
        inParams.put("content_", content_);


        CREATECUSTOMATTRIBUTECALL.execute(inParams);
    }

    public static void UPDATECUSTOMATTRIBUTE(Integer v_id_c_attribute, String v_title, String v_content_) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_c_attribute", v_id_c_attribute);
        inParams.put("v_title", v_title);
        inParams.put("v_content_", v_content_);


        UPDATECUSTOMATTRIBUTECALL.execute(inParams);
    }

    public static void DELETECUSTOMATTRIBUTE(Integer v_id_c_attribute) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_c_attribute", v_id_c_attribute);


        DELETECUSTOMATTRIBUTECALL.execute(inParams);
    }

    public static void CREATEUSER(String fullname, String username, String pass_word) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("fullname", fullname);
        inParams.put("username", username);
        inParams.put("pass_word", pass_word);


        CREATEUSERCALL.execute(inParams);
    }

    public static void UPDATEUSER(Integer v_id_employee, String v_fullname, String v_username, String v_pass_word) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);
        inParams.put("v_fullname", v_fullname);
        inParams.put("v_username", v_username);
        inParams.put("v_pass_word", v_pass_word);


        UPDATEUSERCALL.execute(inParams);
    }

    public static void DISABLEUSER(Integer v_id_employee) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);


        DISABLEUSERCALL.execute(inParams);
    }

    public static void ENABLEUSER(Integer v_id_employee) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);


        ENABLEUSERCALL.execute(inParams);
    }


    public List<Map<String, Object>> GETALLCLIENTS() {
        Map<String, Object> result = GETALLCLIENTSCALL.execute();
        Object clientsObject = result.get("result_cursor");
        if (clientsObject instanceof List<?>) {
            return (List<Map<String, Object>>) clientsObject;
        } else {
            throw new ClassCastException("Expected List<Map<String, Object>>, but got: " + clientsObject.getClass().getName());
        }
    }


    public static void CREATECLIENT(String name, String email) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("name_", name);
        inParams.put("email", email);
        CREATECLIENTCALL.execute(inParams);
    }


    public static void UPDATECLIENT(Integer v_id_client, String v_name_, String v_email) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_client", v_id_client);
        inParams.put("v_name_", v_name_);
        inParams.put("v_email", v_email);
        UPDATECLIENTCALL.execute(inParams);
    }


    public static void DELETECLIENT(Integer v_id_client) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_client", v_id_client);
        DELETECLIENTCALL.execute(inParams);
    }

    public List<Map<String, Object>> GETALLINBOUNDREQUESTS() {
        Map<String, Object> result = GETALLINBOUNDREQUESTSCALL.execute();
        Object inboundRequests = result.get("result_cursor");
        if (inboundRequests instanceof List<?>) {
            return (List<Map<String, Object>>) inboundRequests;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + inboundRequests.getClass().getName());
        }
    }

    public static void CREATEINBOUNDREQUEST(String title, String sender_name, String description_) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("title", title);
        inParams.put("sender_name", sender_name);
        inParams.put("description_", description_);
        CREATEINBOUNDREQUESTCALL.execute(inParams);
    }

    public static void UPDATEINBOUNDREQUEST(Integer v_id_i_request, String v_title, String v_sender_name, String v_description_) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_i_request", v_id_i_request);
        inParams.put("v_title", v_title);
        inParams.put("v_sender_name", v_sender_name);
        inParams.put("v_description_", v_description_);
        UPDATEINBOUNDREQUESTCALL.execute(inParams);
    }

    public static void DELETEINBOUNDREQUEST(Integer v_id_i_request) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_i_request", v_id_i_request);
        DELETEINBOUNDREQUESTCALL.execute(inParams);
    }

    public List<Map<String, Object>> GETALLPROJECTS() {
        Map<String, Object> result = GETALLPROJECTSCALL.execute();
        return (List<Map<String, Object>>) result.get("result_cursor");
    }

    public void CREATEPROJECT(String title, String description_) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("title", title);
        inParams.put("description_", description_);
        CREATEPROJECTCALL.execute(inParams);
    }

    public void CREATEPROJECTUSER(Long id_employee, Long id_devproject) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("id_employee", id_employee);
        inParams.put("id_devproject", id_devproject);
        CREATEPROJECTUSERCALL.execute(inParams);
    }

    public void DELETEPROJECTUSER(Long v_id_employee, Long v_id_devproject) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);
        inParams.put("v_id_devproject", v_id_devproject);
        DELETEPROJECTUSERCALL.execute(inParams);
    }

    public void UPDATELEAD(Long v_id_employee, Long v_id_devproject) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);
        inParams.put("v_id_devproject", v_id_devproject);
        UPDATELEADCALL.execute(inParams);
    }

    public void DELETELEAD(Long v_id_devproject) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_devproject", v_id_devproject);
        DELETELEADCALL.execute(inParams);
    }

    public void UPDATEPROJECT(Integer v_id_devproject, String v_title, String v_description_) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_devproject", v_id_devproject);
        inParams.put("v_title", v_title);
        inParams.put("v_description_", v_description_);
        UPDATEPROJECTCALL.execute(inParams);
    }

    public void DELETEPROJECT(Integer v_id_devproject) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_devproject", v_id_devproject);
        DELETEPROJECTCALL.execute(inParams);
    }

    public List<Map<String, Object>> GETELIGIBLEPROJECTUSERS(Long v_id_devproject) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_devproject", v_id_devproject);


        Map<String, Object> result = GETELIGIBLEPROJECTUSERSCALL.execute(inParams);


        Object elUsersObject = result.get("result_cursor");
        if (elUsersObject instanceof List<?>) {
            return (List<Map<String, Object>>) elUsersObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + elUsersObject.getClass().getName());
        }
    }

    public List<Map<String, Object>> GETPROJECTUSERS(Long v_id_devproject) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_devproject", v_id_devproject);


        Map<String, Object> result = GETPROJECTUSERSCALL.execute(inParams);


        Object elUsersObject = result.get("result_cursor");
        if (elUsersObject instanceof List<?>) {
            return (List<Map<String, Object>>) elUsersObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + elUsersObject.getClass().getName());
        }
    }

    public List<Map<String, Object>> GETPROJECTLEAD(Long v_id_devproject) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_devproject", v_id_devproject);


        Map<String, Object> result = GETPROJECTLEADCALL.execute(inParams);


        Object elUsersObject = result.get("result_cursor");
        if (elUsersObject instanceof List<?>) {
            return (List<Map<String, Object>>) elUsersObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + elUsersObject.getClass().getName());
        }
    }

    public List<Map<String, Object>> GETLEADPROJECTS(Long v_id_employee) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);


        Map<String, Object> result = GETLEADPROJECTSCALL.execute(inParams);


        Object elUsersObject = result.get("result_cursor");
        if (elUsersObject instanceof List<?>) {
            return (List<Map<String, Object>>) elUsersObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + elUsersObject.getClass().getName());
        }
    }

    public List<Map<String, Object>> GETUSERPROJECTTASKS(Long v_id_employee, Long v_id_devproject) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);
        inParams.put("v_id_devproject", v_id_devproject);


        Map<String, Object> result = GETUSERPROJECTTASKSCALL.execute(inParams);


        Object elUsersObject = result.get("result_cursor");
        if (elUsersObject instanceof List<?>) {
            return (List<Map<String, Object>>) elUsersObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + elUsersObject.getClass().getName());
        }
    }

    public List<Map<String, Object>> GETPROJECTTASKS(Long v_id_devproject) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_devproject", v_id_devproject);


        Map<String, Object> result = GETPROJECTTASKSCALL.execute(inParams);


        Object elUsersObject = result.get("result_cursor");
        if (elUsersObject instanceof List<?>) {
            return (List<Map<String, Object>>) elUsersObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + elUsersObject.getClass().getName());
        }
    }

    public List<Map<String, Object>> GETPENDINGTASKS(Long v_id_employee) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_employee", v_id_employee);


        Map<String, Object> result = GETPENDINGTASKSCALL.execute(inParams);


        Object elUsersObject = result.get("result_cursor");
        if (elUsersObject instanceof List<?>) {
            return (List<Map<String, Object>>) elUsersObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: " + elUsersObject.getClass().getName());
        }
    }

    public static Long CREATETASK(Long id_devproject, Long id_employee, String description_) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("id_devproject", id_devproject);
        inParams.put("id_employee", id_employee);
        inParams.put("description_", description_);

        Map<String, Object> result = CREATETASKCALL.declareParameters(
                new SqlParameter("id_devproject", Types.NUMERIC),
                new SqlParameter("id_employee", Types.NUMERIC),
                new SqlParameter("description_", Types.VARCHAR),
                new SqlOutParameter("new_id_task", Types.NUMERIC)
        ).execute(inParams);

        Long id_task = ((Number) result.get("new_id_task")).longValue();

        try {
            if (id_task != null) {
                String folderPath = "uploads/task/" + id_task + " - " + description_;
                File folder = new File(folderPath);
                if (!folder.exists()) {
                    Files.createDirectories(Paths.get(folderPath));
                    System.out.println("Folder created: " + folderPath);
                } else {
                    System.out.println("Folder already exists: " + folderPath);
                }
            }
        } catch (Exception e) {
            System.err.println("Error during folder creation: " + e.getMessage());
        }

        return id_task;
    }

    public static void DELETETASK(Integer v_id_task) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_task", v_id_task);


        DELETETASKCALL.execute(inParams);


        String basePath = "uploads/task";
        String folderPath = new File(basePath)
                .listFiles((dir, name) -> name.startsWith(String.valueOf(v_id_task)))[0]
                .getAbsolutePath();


        File folder = new File(folderPath);


        if (folder.exists() && folder.isDirectory()) {

            deleteDirectory(folder);
        }
    }


    private static boolean deleteDirectory(File directory) {

        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {

                if (file.isDirectory()) {
                    deleteDirectory(file);
                } else {
                    file.delete();
                }
            }
        }

        return directory.delete();
    }

    public static void UPDATETASK(Long v_id_task, Long v_id_employee, String v_description_) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_task", v_id_task);
        inParams.put("v_id_employee", v_id_employee);
        inParams.put("v_description_", v_description_);


        UPDATETASKCALL.execute(inParams);
    }

    public static void UPDATETASKSTATUS(Long v_id_task, Short v_status) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_task", v_id_task);
        inParams.put("v_status", v_status);


        UPDATETASKSTATUSCALL.execute(inParams);
    }

    public static String getTaskFolderPath(int idTask) {
        String basePath = "uploads/task";
        File taskFolder = new File(basePath).listFiles((dir, name) -> name.startsWith(String.valueOf(idTask)))[0];

        if (!taskFolder.exists() || !taskFolder.isDirectory()) {
            System.out.println("Folder for task ID " + idTask + " does not exist. Path: " + taskFolder);
            return null;
        }


        return taskFolder.getAbsolutePath();
    }

    public static Map<String, List<String>> getFolderStructure(int idTask) {
        String basePath = "uploads/task";
        File taskFolder = new File(basePath).listFiles((dir, name) -> name.startsWith(String.valueOf(idTask)))[0];

        if (!taskFolder.exists() || !taskFolder.isDirectory()) {
            System.out.println("Folder for task ID " + idTask + " does not exist.");
            return new HashMap<>();
        }


        List<String> folderStructure = new ArrayList<>();
        List<String> absoluteFilePaths = new ArrayList<>();


        getFolderContents(taskFolder, "", folderStructure, absoluteFilePaths);


        Map<String, List<String>> result = new HashMap<>();
        result.put("folderStructure", folderStructure);
        result.put("absoluteFilePaths", absoluteFilePaths);

        return result;
    }

    private static void getFolderContents(File folder, String indent, List<String> folderStructure, List<String> absoluteFilePaths) {

        folderStructure.add(indent + folder.getName() + "/");


        String absolutePath = folder.getAbsolutePath().replace("\\", "/");
        absoluteFilePaths.add(absolutePath);

        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {

                    getFolderContents(file, indent + "  ", folderStructure, absoluteFilePaths);
                } else {

                    folderStructure.add(indent + "  " + file.getName() + " (file)");


                    absolutePath = file.getAbsolutePath().replace("\\", "/");
                    absoluteFilePaths.add(absolutePath);
                }
            }
        }
    }

    public static boolean createFolder(String absolutePath, String folderName) {

        File targetDirectory = new File(absolutePath);


        if (!targetDirectory.exists() || !targetDirectory.isDirectory()) {
            System.out.println("The path " + absolutePath + " does not exist or is not a directory.");
            return false;
        }


        File newFolder = new File(targetDirectory, folderName);


        if (newFolder.exists()) {
            System.out.println("The folder " + folderName + " already exists at " + absolutePath);
            return false;
        } else {
            try {
                boolean created = newFolder.mkdir();
                if (created) {
                    System.out.println("Folder " + folderName + " created successfully at " + absolutePath);
                    return true;
                } else {
                    System.out.println("Failed to create folder " + folderName + " at " + absolutePath);
                    return false;
                }
            } catch (SecurityException e) {
                System.out.println("Permission denied: Unable to create folder at " + absolutePath);
                e.printStackTrace();
                return false;
            }
        }
    }

    public static boolean renameFolder(String absolutePath, String folderName) {
        if (absolutePath == null) {
            System.out.println("Absolute path is null");
            return false;
        } else if (folderName == null) {
            System.out.println("new folder name is null");
            return false;
        } else if (absolutePath == null && folderName == null) {
            System.out.println("both are null");
            return false;
        }

        File folderToRename = new File(absolutePath);


        if (!folderToRename.exists() || !folderToRename.isDirectory()) {
            System.out.println("The folder does not exist or is not a directory: " + absolutePath);
            return false;
        }


        File renamedFolder = new File(folderToRename.getParent(), folderName);


        if (renamedFolder.exists()) {
            System.out.println("A folder with the name " + folderName + " already exists.");
            return false;
        }


        boolean success = folderToRename.renameTo(renamedFolder);
        if (!success) {
            System.out.println("Failed to rename folder from " + folderToRename.getName() + " to " + folderName);
            return false;
        }

        System.out.println("Folder renamed successfully to " + folderName);
        return true;
    }

    public static boolean deleteFolder(String absolutePath) {

        if (absolutePath == null) {
            System.out.println("Absolute path is null");
            return false;
        }

        File folderToDelete = new File(absolutePath);


        if (!folderToDelete.exists() || !folderToDelete.isDirectory()) {
            System.out.println("The folder does not exist or is not a directory: " + absolutePath);
            return false;
        }


        boolean success = deleteRecursively(folderToDelete);
        if (!success) {
            System.out.println("Failed to delete folder: " + absolutePath);
            return false;
        }

        System.out.println("Folder deleted successfully: " + absolutePath);
        return true;
    }


    private static boolean deleteRecursively(File folder) {

        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {

                if (file.isDirectory()) {
                    deleteRecursively(file);
                }

                if (!file.delete()) {
                    System.out.println("Failed to delete file: " + file.getAbsolutePath());
                    return false;
                }
            }
        }

        return folder.delete();
    }

    public static boolean renameFile(String absolutePath, String fileName) {
        if (absolutePath == null) {
            System.out.println("Absolute path is null");
            return false;
        } else if (fileName == null) {
            System.out.println("File name is null");
            return false;
        }

        File fileToRename = new File(absolutePath);


        if (!fileToRename.exists() || !fileToRename.isFile()) {
            System.out.println("The file does not exist or is not a regular file: " + absolutePath);
            return false;
        }


        String originalFileName = fileToRename.getName();
        String extension = "";
        int dotIndex = originalFileName.lastIndexOf(".");
        if (dotIndex > 0 && dotIndex < originalFileName.length() - 1) {
            extension = originalFileName.substring(dotIndex);
        }


        File renamedFile = new File(fileToRename.getParent(), fileName + extension);


        if (renamedFile.exists()) {
            System.out.println("A file with the name " + fileName + extension + " already exists.");
            return false;
        }


        boolean success = fileToRename.renameTo(renamedFile);
        if (!success) {
            System.out.println("Failed to rename file from " + originalFileName + " to " + fileName + extension);
            return false;
        }

        System.out.println("File renamed successfully to " + fileName + extension);
        return true;
    }

    public static boolean deleteFile(String absolutePath) {
        if (absolutePath == null) {
            System.out.println("Absolute path is null");
            return false;
        }

        File fileToDelete = new File(absolutePath);


        if (!fileToDelete.exists() || !fileToDelete.isFile()) {
            System.out.println("The file does not exist or is not a regular file: " + absolutePath);
            return false;
        }


        boolean success = fileToDelete.delete();
        if (!success) {
            System.out.println("Failed to delete file: " + fileToDelete.getName());
            return false;
        }

        System.out.println("File deleted successfully: " + fileToDelete.getName());
        return true;
    }

    public static boolean uploadFile(String absolutePath, File uploadedFile) {

        File targetDirectory = new File(absolutePath);


        if (!targetDirectory.exists() || !targetDirectory.isDirectory()) {
            System.out.println("The path " + absolutePath + " does not exist or is not a directory.");
            return false;
        }


        String fileName = uploadedFile.getName();


        File targetFile = new File(targetDirectory, fileName);


        if (targetFile.exists()) {
            System.out.println("The file " + fileName + " already exists at " + absolutePath);
            return false;
        }


        try {

            Files.copy(uploadedFile.toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File " + fileName + " uploaded successfully to " + absolutePath);
            return true;
        } catch (IOException e) {
            System.out.println("An error occurred while uploading the file: " + e.getMessage());
            e.printStackTrace();
            return false;
        } catch (SecurityException e) {
            System.out.println("Permission denied: Unable to upload file at " + absolutePath);
            e.printStackTrace();
            return false;
        }
    }

    public static void createFinalProject(Long idDevProject, String title, String description) throws IOException {

        List<Long> taskIds = executeCreateFinalProject(idDevProject, title, description);


        String taskFolderBasePath = "uploads/task/";
        String finalProjectBasePath = "uploads/final_project/";


        Path finalProjectFolderPath = Paths.get("uploads/final_project/" + idDevProject + " - " + title);
        if (!Files.exists(finalProjectFolderPath)) {
            Files.createDirectories(finalProjectFolderPath);
        }

        for (Long taskId : taskIds) {
            File[] matchingFiles = new File(taskFolderBasePath).listFiles((dir, name) -> name.startsWith(String.valueOf(taskId)));

            if (matchingFiles != null && matchingFiles.length > 0) {
                Path taskFolderPath = matchingFiles[0].toPath();
                if (Files.exists(taskFolderPath)) {
                    Path destinationFolderPath = finalProjectFolderPath.resolve(String.valueOf(taskId));
                    copyFolder(taskFolderPath, destinationFolderPath);
                }
            }
        }
    }

    private static List<Long> executeCreateFinalProject(Long idDevProject, String title, String description) {

        Map<String, Object> result = CREATEFINALPROJECTCALL.execute(idDevProject, title, description);


        Object resultCursor = result.get("result_cursor");


        if (resultCursor instanceof ArrayList<?> taskIdsList) {
            List<Long> taskIds = new ArrayList<>();


            for (Object task : taskIdsList) {
                if (task instanceof LinkedCaseInsensitiveMap taskMap) {

                    Object taskId = taskMap.get("ID_TASK");

                    if (taskId instanceof Number) {
                        taskIds.add(((Number) taskId).longValue());
                    } else {
                        throw new RuntimeException("Unexpected type for task ID: " + taskId.getClass());
                    }
                } else {
                    throw new RuntimeException("Unexpected type in task IDs list: " + task.getClass());
                }
            }
            return taskIds;
        } else {
            throw new RuntimeException("Expected result_cursor to be an ArrayList, but got: " + resultCursor.getClass());
        }
    }


    private static void copyFolder(Path source, Path destination) throws IOException {

        if (!Files.exists(destination)) {
            Files.createDirectories(destination);
        }

        Files.walk(source)
                .forEach(sourcePath -> {
                    try {
                        Path destinationPath = destination.resolve(source.relativize(sourcePath));
                        if (Files.isDirectory(sourcePath)) {
                            if (!Files.exists(destinationPath)) {
                                Files.createDirectories(destinationPath);
                            }
                        } else {
                            Files.copy(sourcePath, destinationPath);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException("Error copying folder", e);
                    }
                });
    }

    public List<Map<String, Object>> GETALLFINALPROJECTS() {

        Map<String, Object> result = GETALLFINALPROJECTSCALL.execute();


        Object fprojectsObject = result.get("result_cursor");
        if (fprojectsObject instanceof List<?>) {
            return (List<Map<String, Object>>) fprojectsObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: \" + employeesObject.getClass().getName()");
        }
    }

    public static void DISABLEFINALPROJECT(Integer v_id_f_project) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_f_project", v_id_f_project);


        DISABLEFINALPROJECTCALL.execute(inParams);
    }

    public static void ENABLEFINALPROJECT(Integer v_id_f_project) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_f_project", v_id_f_project);


        ENABLEFINALPROJECTCALL.execute(inParams);
    }

    public static void DELETEFINALPROJECT(Integer v_id_f_project) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_f_project", v_id_f_project);


        DELETEFINALPROJECTCALL.execute(inParams);
    }

    public void UPDATEFINALPROJECT(Integer v_id_f_project, String v_title, String v_description_) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_f_project", v_id_f_project);
        inParams.put("v_title", v_title);
        inParams.put("v_description_", v_description_);
        UPDATEFINALPROJECTCALL.execute(inParams);
    }

    public static Long CREATEKNOWLEDGEBASEITEM(String title, String description) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("title", title);
        inParams.put("description_", description);

        Map<String, Object> result = CREATEKNOWLEDGEBASEITEMCALL.declareParameters(
                new SqlParameter("title", Types.VARCHAR),
                new SqlParameter("description_", Types.VARCHAR),
                new SqlOutParameter("new_id_kb_item", Types.NUMERIC)
        ).execute(inParams);

        Long id_kb_item = ((Number) result.get("new_id_kb_item")).longValue();

        try {
            if (id_kb_item != null) {
                String folderPath = "uploads/knowledge_base/" + id_kb_item + " - " + title;
                File folder = new File(folderPath);
                if (!folder.exists()) {
                    Files.createDirectories(Paths.get(folderPath));
                    System.out.println("Folder created: " + folderPath);
                } else {
                    System.out.println("Folder already exists: " + folderPath);
                }
            }
        } catch (Exception e) {
            System.err.println("Error during folder creation: " + e.getMessage());
        }

        return id_kb_item;
    }

    public static void DELETEKNOWLEDGEBASEITEM(Integer v_id_kb_item) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("v_id_kb_item", v_id_kb_item);


        DELETEKNOWLEDGEBASEITEMCALL.execute(inParams);


        String basePath = "uploads/knowledge_base";
        String folderPath = new File(basePath)
                .listFiles((dir, name) -> name.startsWith(String.valueOf(v_id_kb_item)))[0]
                .getAbsolutePath();

        System.out.println("folderPath: " + folderPath);


        File folder = new File(folderPath);


        if (folder.exists() && folder.isDirectory()) {

            deleteDirectory(folder);
        }
    }

    public static String getKBFolderPath() {
        File basePathAbs = new File("uploads/knowledge_base");
        return basePathAbs.getAbsolutePath();
    }

    public static Map<String, List<String>> getKBFolderStructure() {
        File basePathAbs = new File("uploads/knowledge_base");


        List<String> folderStructure = new ArrayList<>();
        List<String> absoluteFilePaths = new ArrayList<>();


        getFolderContents(basePathAbs, "", folderStructure, absoluteFilePaths);


        Map<String, List<String>> result = new HashMap<>();
        result.put("folderStructure", folderStructure);
        result.put("absoluteFilePaths", absoluteFilePaths);

        return result;
    }

    public List<Map<String, Object>> GETACTIVITYLOG() {

        Map<String, Object> result = GETACTIVITYLOGCALL.execute();


        Object employeesObject = result.get("result_cursor");
        if (employeesObject instanceof List<?>) {
            return (List<Map<String, Object>>) employeesObject;
        } else {
            throw new ClassCastException("Expected a List<Map<String, Object>>, but got: \" + employeesObject.getClass().getName()");
        }
    }

    public static void LOGACTIVITY(String username, String db_action, String db_object) {

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("username", username);
        inParams.put("db_action", db_action);
        inParams.put("db_object", db_object);


        LOGACTIVITYCALL.execute(inParams);
    }

}
