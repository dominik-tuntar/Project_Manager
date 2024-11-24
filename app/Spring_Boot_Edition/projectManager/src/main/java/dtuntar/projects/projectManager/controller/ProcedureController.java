package dtuntar.projects.projectManager.controller;

import dtuntar.projects.projectManager.annotations.RoleRequired;
import dtuntar.projects.projectManager.model.Employee;
import dtuntar.projects.projectManager.model.LoginResponse;
import dtuntar.projects.projectManager.service.ProcedureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@RestController
@RequestMapping("/api")
public class ProcedureController {

    private final ProcedureService procedureService;

    @Autowired
    public ProcedureController(ProcedureService procedureService) {
        this.procedureService = procedureService;
    }

    @Autowired
    private RestTemplate restTemplate;

    

    @PostMapping("/login")
    public LoginResponse login(@RequestParam String username, @RequestParam String password) {
        Employee employee = new Employee();  
        String token = procedureService.login(username, password, employee); 

        if (token != null) { 
            return new LoginResponse(true, "Login successful", employee, token); 
        } else {
            return new LoginResponse(false, "Invalid credentials or inactive account", null, null); 
        }
    }

    @GetMapping("/getAllUsers")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        try {
            List<Map<String, Object>> users = procedureService.GETALLUSERS();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCustomAttributes")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getCustomAttributes(
            @RequestParam("table_name") String table_name,
            @RequestParam("table_row") String table_row) {

        
        List<Map<String, Object>> customAttributes = procedureService.GETCUSTOMATTRIBUTES(table_name, table_row);

        
        return ResponseEntity.ok(customAttributes);
    }
    @PostMapping("/createCustomAttribute")
    @RoleRequired(value = {1})
    public String createCustomAttribute(
            @RequestParam("table_name") String table_name,
            @RequestParam("table_row") Integer table_row,
            @RequestParam("title") String title,
            @RequestParam("content_") String content_
    ) {
        try {
            
            ProcedureService.CREATECUSTOMATTRIBUTE(table_name, table_row, title, content_);
            return "Custom attribute created successfully!";
        } catch (Exception e) {
            return "Failed to create custom attribute: " + e.getMessage();
        }
    }
    @PostMapping("/createUser")
    @RoleRequired(value = {1})
    public String createUser(
            @RequestParam("fullname") String fullname,
            @RequestParam("username") String username,
            @RequestParam("pass_word") String pass_word
    ) {
        try {
            
            ProcedureService.CREATEUSER(fullname, username, pass_word);
            return "User created successfully!";
        } catch (Exception e) {
            return "Failed to create user: " + e.getMessage();
        }
    }
    @PutMapping("/updateCustomAttribute")
    @RoleRequired(value = {1})
    public String updateCustomAttribute(
            @RequestParam("v_id_c_attribute") Integer v_id_c_attribute,
            @RequestParam("v_title") String v_title,
            @RequestParam("v_content_") String v_content_
    ) {
        try {
            
            ProcedureService.UPDATECUSTOMATTRIBUTE(v_id_c_attribute, v_title, v_content_);
            return "Custom attribute updated successfully!";
        } catch (Exception e) {
            return "Failed to update custom attribute: " + e.getMessage();
        }
    }
    @PutMapping("/updateUser")
    @RoleRequired(value = {1})
    public String updateUser(
            @RequestParam("v_id_employee") Integer v_id_employee,
            @RequestParam("v_fullname") String v_fullname,
            @RequestParam("v_username") String v_username,
            @RequestParam("v_pass_word") String v_pass_word
    ) {
        try {
            
            ProcedureService.UPDATEUSER(v_id_employee, v_fullname, v_username, v_pass_word);
            return "User updated successfully!";
        } catch (Exception e) {
            return "Failed to update user: " + e.getMessage();
        }
    }
    @PutMapping("/disableUser")
    @RoleRequired(value = {1})
    public String disableUser(
            @RequestParam("v_id_employee") Integer v_id_employee
    ) {
        try {
            
            ProcedureService.DISABLEUSER(v_id_employee);
            return "User disabled successfully!";
        } catch (Exception e) {
            return "Failed to disable user: " + e.getMessage();
        }
    }
    @PutMapping("/enableUser")
    @RoleRequired(value = {1})
    public String enableUser(
            @RequestParam("v_id_employee") Integer v_id_employee
    ) {
        try {
            
            ProcedureService.ENABLEUSER(v_id_employee);
            return "User enabled successfully!";
        } catch (Exception e) {
            return "Failed to enable user: " + e.getMessage();
        }
    }

    @DeleteMapping("/deleteCustomAttribute")
    @RoleRequired(value = {1})
    public String deleteCustomAttribute(
            @RequestParam("v_id_c_attribute") Integer v_id_c_attribute
    ) {
        try {
            
            ProcedureService.DELETECUSTOMATTRIBUTE(v_id_c_attribute);
            return "Custom attribute created successfully!";
        } catch (Exception e) {
            return "Failed to create custom attribute: " + e.getMessage();
        }
    }

    
    @PostMapping("/createClient")
    @RoleRequired(value = {1})
    public String createClient(
            @RequestParam("name_") String name,
            @RequestParam("email") String email
    ) {
        try {
            ProcedureService.CREATECLIENT(name, email);
            return "Client created successfully!";
        } catch (Exception e) {
            return "Failed to create client: " + e.getMessage();
        }
    }

    
    @PutMapping("/updateClient")
    @RoleRequired(value = {1})
    public String updateClient(
            @RequestParam("v_id_client") Integer v_id_client,
            @RequestParam("v_name_") String v_name_,
            @RequestParam("v_email") String v_email
    ) {
        try {
            ProcedureService.UPDATECLIENT(v_id_client, v_name_, v_email);
            return "Client updated successfully!";
        } catch (Exception e) {
            return "Failed to update client: " + e.getMessage();
        }
    }

    @PutMapping("/updateTask")
    @RoleRequired(value = {1, 2})
    public String updateTask(
            @RequestParam("v_id_task") Long v_id_task,
            @RequestParam(value = "v_id_employee", required = false) Long v_id_employee,
            @RequestParam("v_description_") String v_description_
    ) {
        try {
            ProcedureService.UPDATETASK(v_id_task, v_id_employee, v_description_);
            return "Client updated successfully!";
        } catch (Exception e) {
            return "Failed to update client: " + e.getMessage();
        }
    }

    @PutMapping("/updateTaskStatus")
    @RoleRequired(value = {1, 2})
    public String updateTaskStatus(
            @RequestParam("v_id_task") Long v_id_task,
            @RequestParam("v_status") Short v_status
    ) {
        try {
            ProcedureService.UPDATETASKSTATUS(v_id_task, v_status);
            return "Client updated successfully!";
        } catch (Exception e) {
            return "Failed to update client: " + e.getMessage();
        }
    }

    
    @DeleteMapping("/deleteClient")
    @RoleRequired(value = {1})
    public String deleteClient(
            @RequestParam("v_id_client") Integer v_id_client
    ) {
        try {
            ProcedureService.DELETECLIENT(v_id_client);
            return "Client deleted successfully!";
        } catch (Exception e) {
            return "Failed to delete client: " + e.getMessage();
        }
    }

    
    @GetMapping("/getAllClients")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getAllClients() {
        try {
            List<Map<String, Object>> clients = procedureService.GETALLCLIENTS();
            return new ResponseEntity<>(clients, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllInboundRequests")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getAllInboundRequests() {
        try {
            List<Map<String, Object>> requests = procedureService.GETALLINBOUNDREQUESTS();
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createInboundRequest")
    @RoleRequired(value = {1})
    public String createInboundRequest(
            @RequestParam("title") String title,
            @RequestParam("sender_name") String sender_name,
            @RequestParam("description_") String description_
    ) {
        try {
            ProcedureService.CREATEINBOUNDREQUEST(title, sender_name, description_);
            return "Inbound request created successfully!";
        } catch (Exception e) {
            return "Failed to create inbound request: " + e.getMessage();
        }
    }

    @PostMapping("/createTask")
    @RoleRequired(value = {1, 2})
    public String createTask(
            @RequestParam("id_devproject") Long id_devproject,
            @RequestParam(value = "id_employee", required = false) Long id_employee,
            @RequestParam("description_") String description_
    ) {
        try {
            
            Long newTaskId = ProcedureService.CREATETASK(id_devproject, id_employee, description_);

            if (newTaskId != null) {
                return "Task created successfully with ID: " + newTaskId;
            } else {
                return "Task creation failed: unable to retrieve new task ID.";
            }
        } catch (Exception e) {
            return "Error creating task: " + e.getMessage();
        }
    }


    @PutMapping("/updateInboundRequest")
    @RoleRequired(value = {1})
    public String updateInboundRequest(
            @RequestParam("v_id_i_request") Integer v_id_i_request,
            @RequestParam("v_title") String v_title,
            @RequestParam("v_sender_name") String v_sender_name,
            @RequestParam("v_description_") String v_description_
    ) {
        try {
            ProcedureService.UPDATEINBOUNDREQUEST(v_id_i_request, v_title, v_sender_name, v_description_);
            return "Inbound request updated successfully!";
        } catch (Exception e) {
            return "Failed to update inbound request: " + e.getMessage();
        }
    }

    @DeleteMapping("/deleteInboundRequest")
    @RoleRequired(value = {1})
    public String deleteInboundRequest(
            @RequestParam("v_id_i_request") Integer v_id_i_request
    ) {
        try {
            ProcedureService.DELETEINBOUNDREQUEST(v_id_i_request);
            return "Inbound request deleted successfully!";
        } catch (Exception e) {
            return "Failed to delete inbound request: " + e.getMessage();
        }
    }

    @GetMapping("/getAllProjects")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getAllProjects() {
        try {
            List<Map<String, Object>> projects = procedureService.GETALLPROJECTS();
            return new ResponseEntity<>(projects, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createProject")
    @RoleRequired(value = {1})
    public String createProject(
            @RequestParam("title") String title,
            @RequestParam("description_") String description_
    ) {
        try {
            procedureService.CREATEPROJECT(title, description_);
            return "Project created successfully!";
        } catch (Exception e) {
            return "Failed to create project: " + e.getMessage();
        }
    }

    @PostMapping("/createProjectUser")
    @RoleRequired(value = {1})
    public String createProjectUser(
            @RequestParam("id_employee") Long id_employee,
            @RequestParam("id_devproject") Long id_devproject
    ) {
        try {
            procedureService.CREATEPROJECTUSER(id_employee, id_devproject);
            return "Project created successfully!";
        } catch (Exception e) {
            return "Failed to create project user: " + e.getMessage();
        }
    }

    @DeleteMapping("/deleteProjectUser")
    @RoleRequired(value = {1})
    public String deleteProjectUser(
            @RequestParam("v_id_employee") Long v_id_employee,
            @RequestParam("v_id_devproject") Long v_id_devproject
    ) {
        try {
            procedureService.DELETEPROJECTUSER(v_id_employee, v_id_devproject);
            return "Project created successfully!";
        } catch (Exception e) {
            return "Failed to delete project user: " + e.getMessage();
        }
    }

    @PutMapping("/updateLead")
    @RoleRequired(value = {1})
    public String updateLead(
            @RequestParam("v_id_employee") Long v_id_employee,
            @RequestParam("v_id_devproject") Long v_id_devproject
    ) {
        try {
            procedureService.UPDATELEAD(v_id_employee, v_id_devproject);
            return "Project created successfully!";
        } catch (Exception e) {
            return "Failed to update lead: " + e.getMessage();
        }
    }

    @DeleteMapping("/deleteLead")
    @RoleRequired(value = {1})
    public String deleteLead(
            @RequestParam("v_id_devproject") Long v_id_devproject
    ) {
        try {
            procedureService.DELETELEAD(v_id_devproject);
            return "Project created successfully!";
        } catch (Exception e) {
            return "Failed to delete lead: " + e.getMessage();
        }
    }

    @PutMapping("/updateProject")
    @RoleRequired(value = {1})
    public String updateProject(
            @RequestParam("v_id_devproject") Integer v_id_devproject,
            @RequestParam("v_title") String v_title,
            @RequestParam("v_description_") String v_description_
    ) {
        try {
            procedureService.UPDATEPROJECT(v_id_devproject, v_title, v_description_);
            return "Project updated successfully!";
        } catch (Exception e) {
            return "Failed to update project: " + e.getMessage();
        }
    }

    @DeleteMapping("/deleteProject")
    @RoleRequired(value = {1})
    public String deleteProject(
            @RequestParam("v_id_devproject") Integer v_id_devproject
    ) {
        try {
            procedureService.DELETEPROJECT(v_id_devproject);
            return "Project deleted successfully!";
        } catch (Exception e) {
            return "Failed to delete project: " + e.getMessage();
        }
    }

    @GetMapping("/getEligibleProjectUsers")
    @RoleRequired(value = {1})
    public ResponseEntity<List<Map<String, Object>>> getEligibleProjectUsers(
            @RequestParam("v_id_devproject") Long v_id_devproject
            ) {

        
        List<Map<String, Object>> eligibleUsers = procedureService.GETELIGIBLEPROJECTUSERS(v_id_devproject);

        
        return ResponseEntity.ok(eligibleUsers);
    }

    @GetMapping("/getProjectUsers")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getProjectUsers(
            @RequestParam("v_id_devproject") Long v_id_devproject
    ) {

        
        List<Map<String, Object>> eligibleUsers = procedureService.GETPROJECTUSERS(v_id_devproject);

        
        return ResponseEntity.ok(eligibleUsers);
    }

    @GetMapping("/getProjectLead")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getProjectLead(
            @RequestParam("v_id_devproject") Long v_id_devproject
    ) {

        
        List<Map<String, Object>> eligibleUsers = procedureService.GETPROJECTLEAD(v_id_devproject);

        
        return ResponseEntity.ok(eligibleUsers);
    }

    @GetMapping("/getLeadProjects")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getLeadProjects(
            @RequestParam("v_id_employee") Long v_id_employee
    ) {

        
        List<Map<String, Object>> eligibleUsers = procedureService.GETLEADPROJECTS(v_id_employee);

        
        return ResponseEntity.ok(eligibleUsers);
    }

    @GetMapping("/getUserProjectTasks")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getUserProjectTasks(
            @RequestParam("v_id_employee") Long v_id_employee,
            @RequestParam("v_id_devproject") Long v_id_devproject
    ) {

        
        List<Map<String, Object>> eligibleUsers = procedureService.GETUSERPROJECTTASKS(v_id_employee, v_id_devproject);

        
        return ResponseEntity.ok(eligibleUsers);
    }

    @GetMapping("/getProjectTasks")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getProjectTasks(
            @RequestParam("v_id_devproject") Long v_id_devproject
    ) {

        
        List<Map<String, Object>> projectTasks = procedureService.GETPROJECTTASKS(v_id_devproject);

        
        return ResponseEntity.ok(projectTasks);
    }

    @GetMapping("/getPendingTasks")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getPendingTasks(
            @RequestParam("v_id_employee") Long v_id_employee
    ) {

        
        List<Map<String, Object>> eligibleUsers = procedureService.GETPENDINGTASKS(v_id_employee);

        
        return ResponseEntity.ok(eligibleUsers);
    }

    @GetMapping("/getFolderStructure")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<Map<String, List<String>>> getFolderStructure(@RequestParam("id_task") int idTask) {

        
        Map<String, List<String>> folderData = ProcedureService.getFolderStructure(idTask);

        
        return ResponseEntity.ok(folderData);
    }

    @GetMapping("/getFolderPath")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<String> getTaskFolderPath(@RequestParam("id_task") int idTask) {
        String folderPath = ProcedureService.getTaskFolderPath(idTask);

        if (folderPath == null) {
            return ResponseEntity.notFound().build(); 
        }

        return ResponseEntity.ok(folderPath); 
    }

    @DeleteMapping("/deleteTask")
    @RoleRequired(value = {1, 2})
    public String deleteTask(
            @RequestParam("v_id_task") Integer v_id_task
    ) {
        try {
            
            ProcedureService.DELETETASK(v_id_task);
            return "Custom attribute created successfully!";
        } catch (Exception e) {
            return "Failed to create custom attribute: " + e.getMessage();
        }
    }

    @PostMapping("/createFolder")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<Map<String, String>> createFolder(@RequestBody Map<String, String> payload) {
        String absolutePath = payload.get("absolutePath");
        String folderName = payload.get("folderName");

        Map<String, String> response = new HashMap<>();

        try {
            boolean result = ProcedureService.createFolder(absolutePath, folderName);
            if (result) {
                response.put("message", "Folder created successfully!");
                return ResponseEntity.ok(response); 
            } else {
                response.put("message", "Failed to create folder: A folder with that name may already exist or the path is invalid.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); 
            }
        } catch (Exception e) {
            response.put("message", "Failed to create folder: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); 
        }
    }

    @PutMapping("/renameFolder")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<Map<String, String>> renameFolder(@RequestBody Map<String, String> payload) {
        String absolutePath = payload.get("absolutePath");
        String folderName = payload.get("folderName");

        Map<String, String> response = new HashMap<>();

        try {
            boolean result = ProcedureService.renameFolder(absolutePath, folderName);
            if (result) {
                response.put("message", "Folder renamed successfully!");
                return ResponseEntity.ok(response); 
            } else {
                response.put("message", "Failed to rename folder: A folder with that name may already exist or the path is invalid.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); 
            }
        } catch (Exception e) {
            
            e.printStackTrace();
            response.put("message", "Failed to rename folder: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); 
        }
    }

    @DeleteMapping("/deleteFolder")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<Map<String, String>> deleteFolder(@RequestBody Map<String, String> payload) {
        String absolutePath = payload.get("absolutePath");

        Map<String, String> response = new HashMap<>();

        try {
            
            boolean result = ProcedureService.deleteFolder(absolutePath);
            if (result) {
                response.put("message", "Folder deleted successfully!");
                return ResponseEntity.ok(response); 
            } else {
                response.put("message", "Failed to delete folder: The folder may not exist or the path is invalid.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); 
            }
        } catch (Exception e) {
            
            e.printStackTrace();
            response.put("message", "Failed to delete folder: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); 
        }
    }

    @GetMapping("/downloadFolder")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<InputStreamResource> downloadFolder(@RequestParam String absolutePath) {
        File folder = new File(absolutePath);

        if (!folder.exists() || !folder.isDirectory()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        try {
            
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream);

            
            zipFolderContents(folder, zipOutputStream, folder.getName());

            zipOutputStream.close();
            InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=" + folder.getName() + ".zip");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(byteArrayOutputStream.size())
                    .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private void zipFolderContents(File folder, ZipOutputStream zipOutputStream, String folderName) throws IOException {
        for (File file : folder.listFiles()) {
            if (file.isDirectory()) {
                zipFolderContents(file, zipOutputStream, folderName + "/" + file.getName());
            } else {
                zipOutputStream.putNextEntry(new ZipEntry(folderName + "/" + file.getName()));
                try (FileInputStream fis = new FileInputStream(file)) {
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = fis.read(buffer)) >= 0) {
                        zipOutputStream.write(buffer, 0, length);
                    }
                }
                zipOutputStream.closeEntry();
            }
        }
    }

    @PutMapping("/renameFile")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<Map<String, String>> renameFile(@RequestBody Map<String, String> payload) {
        String absolutePath = payload.get("absolutePath");
        String fileName = payload.get("fileName");

        Map<String, String> response = new HashMap<>();

        try {
            boolean result = ProcedureService.renameFile(absolutePath, fileName);
            if (result) {
                response.put("message", "File renamed successfully!");
                return ResponseEntity.ok(response); 
            } else {
                response.put("message", "Failed to rename file: A file with that name may already exist or the path is invalid.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); 
            }
        } catch (Exception e) {
            
            e.printStackTrace();
            response.put("message", "Failed to rename file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); 
        }
    }

    @DeleteMapping("/deleteFile")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<Map<String, String>> deleteFile(@RequestBody Map<String, String> payload) {
        String absolutePath = payload.get("absolutePath");

        Map<String, String> response = new HashMap<>();

        try {
            boolean result = ProcedureService.deleteFile(absolutePath);
            if (result) {
                response.put("message", "File deleted successfully!");
                return ResponseEntity.ok(response); 
            } else {
                response.put("message", "Failed to delete file: The file may not exist or the path is invalid.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); 
            }
        } catch (Exception e) {
            
            e.printStackTrace();
            response.put("message", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); 
        }
    }

    @GetMapping("/downloadFile")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<InputStreamResource> downloadFile(@RequestParam String absolutePath) {
        File file = new File(absolutePath);

        
        if (!file.exists() || !file.isFile()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        try {
            
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

            
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");

            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .body(resource);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    
    @PostMapping("/uploadFile")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<String> uploadFile(@RequestParam(value = "file", required = false) MultipartFile file,
                                             @RequestParam("absolutePath") String absolutePath) {
        File tempFile = null;
        try {
            
            String originalFileName = file.getOriginalFilename();
            
            tempFile = new File(System.getProperty("java.io.tmpdir"), originalFileName);

            
            int counter = 1;
            while (tempFile.exists()) {
                
                String newFileName = originalFileName.substring(0, originalFileName.lastIndexOf('.'))
                        + "_" + counter++
                        + originalFileName.substring(originalFileName.lastIndexOf('.'));
                tempFile = new File(System.getProperty("java.io.tmpdir"), newFileName);
            }

            
            file.transferTo(tempFile);

            
            boolean success = ProcedureService.uploadFile(absolutePath, tempFile);
            if (success) {
                return ResponseEntity.ok("File uploaded successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to upload file.");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        } finally {
            
            if (tempFile != null && tempFile.exists()) {
                
                tempFile.delete();
            }
        }
    }

    @PostMapping("/createFinalProject")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<String> createFinalProject(
            @RequestParam Long idDevProject,
            @RequestParam String title,
            @RequestParam String description) {
        try {
            
            ProcedureService.createFinalProject(idDevProject, title, description);
            return ResponseEntity.ok("Final project created successfully.");
        } catch (IOException e) {
            
            return ResponseEntity.status(500).body("Error creating final project: " + e.getMessage());
        }
    }

    @GetMapping("/getAllFinalProjects")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getAllFinalProjects() {
        try {
            List<Map<String, Object>> users = procedureService.GETALLFINALPROJECTS();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/disableFinalProject")
    @RoleRequired(value = {1})
    public String disableFinalProject(
            @RequestParam("v_id_f_project") Integer v_id_f_project
    ) {
        try {
            
            ProcedureService.DISABLEFINALPROJECT(v_id_f_project);
            return "User disabled successfully!";
        } catch (Exception e) {
            return "Failed to disable user: " + e.getMessage();
        }
    }

    @PutMapping("/enableFinalProject")
    @RoleRequired(value = {1})
    public String enableFinalProject(
            @RequestParam("v_id_f_project") Integer v_id_f_project
    ) {
        try {
            
            ProcedureService.ENABLEFINALPROJECT(v_id_f_project);
            return "User disabled successfully!";
        } catch (Exception e) {
            return "Failed to disable user: " + e.getMessage();
        }
    }

    @DeleteMapping("/deleteFinalProject")
    @RoleRequired(value = {1})
    public String deleteFinalProject(
            @RequestParam("v_id_f_project") Integer v_id_f_project
    ) {
        try {
            
            ProcedureService.DELETEFINALPROJECT(v_id_f_project);
            return "User disabled successfully!";
        } catch (Exception e) {
            return "Failed to disable user: " + e.getMessage();
        }
    }

    @GetMapping("/downloadFinalProject")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<InputStreamResource> downloadFinalProject(@RequestParam("id_f_project") String idFProject) throws IOException {
        
        String baseDirPath = "uploads/final_project/";
        File baseDir = new File(baseDirPath);

        if (!baseDir.exists() || !baseDir.isDirectory()) {
            return ResponseEntity.notFound().build(); 
        }

        
        File[] matchingFolders = baseDir.listFiles((dir, name) -> name.startsWith(idFProject) && new File(dir, name).isDirectory());

        if (matchingFolders == null || matchingFolders.length == 0) {
            return ResponseEntity.notFound().build(); 
        }

        
        File projectDir = matchingFolders[0];

        
        Path zipFilePath = Files.createTempFile(idFProject, ".zip");

        try (FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
             ZipOutputStream zos = new ZipOutputStream(fos)) {

            
            zipFolderContents(projectDir, zos, projectDir.getName());
        }

        
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + idFProject + ".zip");
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        InputStreamResource resource = new InputStreamResource(new FileInputStream(zipFilePath.toFile()));

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(zipFilePath.toFile().length())
                .body(resource);
    }

    @PutMapping("/updateFinalProject")
    @RoleRequired(value = {1})
    public String updateFinalProject(
            @RequestParam("v_id_f_project") Integer v_id_f_project,
            @RequestParam("v_title") String v_title,
            @RequestParam("v_description_") String v_description_
    ) {
        try {
            procedureService.UPDATEFINALPROJECT(v_id_f_project, v_title, v_description_);
            return "Project updated successfully!";
        } catch (Exception e) {
            return "Failed to update project: " + e.getMessage();
        }
    }

    @PostMapping("/createKnowledgeBaseItem")
    @RoleRequired(value = {1})
    public String createKnowledgeBaseItem(
            @RequestParam("title") String title,
            @RequestParam("description_") String description_
    ) {
        try {
            
            Long newKBitemId = ProcedureService.CREATEKNOWLEDGEBASEITEM(title, description_);

            if (newKBitemId != null) {
                return "Task created successfully with ID: " + newKBitemId;
            } else {
                return "Task creation failed: unable to retrieve new task ID.";
            }
        } catch (Exception e) {
            return "Error creating task: " + e.getMessage();
        }
    }

    @DeleteMapping("/deleteKnowledgeBaseItem")
    @RoleRequired(value = {1})
    public String deleteKnowledgeBaseItem(
            @RequestParam("v_id_kb_item") Integer v_id_kb_item
    ) {
        try {
            
            ProcedureService.DELETEKNOWLEDGEBASEITEM(v_id_kb_item);
            return "Knowledge base item deleted successfully!";
        } catch (Exception e) {
            return "Failed to delete knowledge base item: " + e.getMessage();
        }
    }

    @GetMapping("/getKBFolderStructure")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<Map<String, List<String>>> getKBFolderStructure() {

        
        Map<String, List<String>> folderData = ProcedureService.getKBFolderStructure();

        
        return ResponseEntity.ok(folderData);
    }

    @GetMapping("/getKBFolderPath")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<String> getKBFolderPath() {
        String folderPath = ProcedureService.getKBFolderPath();

        return ResponseEntity.ok(folderPath); 
    }

    @GetMapping("/getActivityLog")
    @RoleRequired(value = {1, 2})
    public ResponseEntity<List<Map<String, Object>>> getActivityLog() {
        try {
            List<Map<String, Object>> users = procedureService.GETACTIVITYLOG();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/logActivity")
    @RoleRequired(value = {1, 2})
    public String logActivity(
            @RequestParam("username") String username,
            @RequestParam("db_action") String db_action,
            @RequestParam("db_object") String db_object
    ) {
        try {
            
            ProcedureService.LOGACTIVITY(username, db_action, db_object);
            return "Custom attribute created successfully!";
        } catch (Exception e) {
            return "Failed to create custom attribute: " + e.getMessage();
        }
    }


}


