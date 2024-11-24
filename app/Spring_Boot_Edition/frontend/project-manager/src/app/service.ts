import { Employee } from './employee';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { Final_Project } from './final_project';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class Service {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.apiServerUrl}/api/login`, body);
  }

  public getAllUsers(): Observable<Employee[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<Employee[]>(`${this.apiServerUrl}/api/getAllUsers`, { headers })
  }

  public getCustomAttributes(table_name: string, table_row: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('table_name', table_name)
      .set('table_row', table_row);

    return this.http.get<any>(`${this.apiServerUrl}/api/getCustomAttributes`, { params, headers });
  }

  public getEligibleProjectUsers(id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_devproject', id_devproject.toString())

    return this.http.get<any>(`${this.apiServerUrl}/api/getEligibleProjectUsers`, { params, headers });
  }

  public getProjectUsers(id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_devproject', id_devproject.toString())

    return this.http.get<any>(`${this.apiServerUrl}/api/getProjectUsers`, { params, headers });
  }

  public getProjectLead(id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_devproject', id_devproject.toString())

    return this.http.get<any>(`${this.apiServerUrl}/api/getProjectLead`, { params, headers });
  }

  public getLeadProjects(id_employee: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_employee', id_employee.toString())

    return this.http.get<any>(`${this.apiServerUrl}/api/getLeadProjects`, { params, headers });
  }

  public getPendingTasks(id_employee: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_employee', id_employee.toString())

    return this.http.get<any>(`${this.apiServerUrl}/api/getPendingTasks`, { params, headers });
  }

  public getFolderStructure(id_task: number): Observable<{ folderStructure: string[], absoluteFilePaths: string[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams().set('id_task', id_task.toString());

    return this.http.get<{ folderStructure: string[], absoluteFilePaths: string[] }>(`${this.apiServerUrl}/api/getFolderStructure`, { params, headers });
  }

  getFolderPath(id_task: number): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams().set('id_task', id_task.toString());

    return this.http.get(`${this.apiServerUrl}/api/getFolderPath`, { params, responseType: 'text', headers });
  }

  public getProjectTasks(id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_devproject', id_devproject.toString())

    return this.http.get<any>(`${this.apiServerUrl}/api/getProjectTasks`, { params, headers });
  }

  public createCustomAttribute(table_name: string, table_row: number, title: string, content: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('table_name', table_name)
      .set('table_row', table_row)
      .set('title', title)
      .set('content_', content);

    return this.http.post(`${this.apiServerUrl}/api/createCustomAttribute`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public createTask(id_devproject: number, id_employee: number | null, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('id_devproject', id_devproject)
      .set('id_employee', id_employee != null ? id_employee.toString() : '')
      .set('description_', description)

    return this.http.post(`${this.apiServerUrl}/api/createTask`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateTask(id_task: number, id_employee: number | null, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_task', id_task)
      .set('v_id_employee', id_employee != null ? id_employee.toString() : '')
      .set('v_description_', description)

    return this.http.put(`${this.apiServerUrl}/api/updateTask`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateTaskStatus(id_task: number, status: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_task', id_task)
      .set('v_status', status)

    return this.http.put(`${this.apiServerUrl}/api/updateTaskStatus`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateUser(id_employee: number, fullname: string, username: string, pass_word: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_employee', id_employee.toString())
      .set('v_fullname', fullname)
      .set('v_username', username)
      .set('v_pass_word', pass_word)

    return this.http.put(`${this.apiServerUrl}/api/updateUser`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateCustomAttribute(id_c_attribute: number, title: string, content: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_c_attribute', id_c_attribute.toString())
      .set('v_title', title)
      .set('v_content_', content)

    return this.http.put(`${this.apiServerUrl}/api/updateCustomAttribute`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public deleteCustomAttribute(id_c_attribute: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_c_attribute', id_c_attribute.toString())

    return this.http.delete(`${this.apiServerUrl}/api/deleteCustomAttribute`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public deleteTask(id_task: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_task', id_task.toString())

    return this.http.delete(`${this.apiServerUrl}/api/deleteTask`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public createUser(fullname: string, username: string, pass_word: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('fullname', fullname)
      .set('username', username)
      .set('pass_word', pass_word)

    return this.http.post(`${this.apiServerUrl}/api/createUser`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public disableUser(id_employee: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_employee', id_employee)

    return this.http.put(`${this.apiServerUrl}/api/disableUser`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public enableUser(id_employee: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_employee', id_employee)

    return this.http.put(`${this.apiServerUrl}/api/enableUser`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public getAllClients(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiServerUrl}/api/getAllClients`, { headers });
  }

  public createClient(name: string, email: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('name_', name)
      .set('email', email);

    return this.http.post(`${this.apiServerUrl}/api/createClient`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateClient(id_client: number, name: string, email: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_client', id_client.toString())
      .set('v_name_', name)
      .set('v_email', email);

    return this.http.put(`${this.apiServerUrl}/api/updateClient`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public deleteClient(id_client: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_client', id_client.toString());

    return this.http.delete(`${this.apiServerUrl}/api/deleteClient`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public getAllInboundRequests(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiServerUrl}/api/getAllInboundRequests`, { headers });
  }

  public createInboundRequest(title: string, sender_name: string, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('title', title)
      .set('sender_name', sender_name)
      .set('description_', description);

    return this.http.post(`${this.apiServerUrl}/api/createInboundRequest`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateInboundRequest(idIRequest: number, title: string, senderName: string, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_i_request', idIRequest.toString())
      .set('v_title', title)
      .set('v_sender_name', senderName)
      .set('v_description_', description);

    return this.http.put(`${this.apiServerUrl}/api/updateInboundRequest`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  // Delete an inbound request
  public deleteInboundRequest(idIRequest: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_i_request', idIRequest.toString());

    return this.http.delete(`${this.apiServerUrl}/api/deleteInboundRequest`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public getAllProjects(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiServerUrl}/api/getAllProjects`, { headers });
  }

  public createProject(title: string, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('title', title)
      .set('description_', description);

    return this.http.post(`${this.apiServerUrl}/api/createProject`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateProject(idDevProject: number, title: string, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_devproject', idDevProject.toString())
      .set('v_title', title)
      .set('v_description_', description);

    return this.http.put(`${this.apiServerUrl}/api/updateProject`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public deleteProject(idDevProject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_devproject', idDevProject.toString())

    return this.http.delete(`${this.apiServerUrl}/api/deleteProject`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public createProjectUser(id_employee: number, id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('id_employee', id_employee.toString())
      .set('id_devproject', id_devproject.toString());

    return this.http.post(`${this.apiServerUrl}/api/createProjectUser`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public deleteProjectUser(id_employee: number, id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_employee', id_employee.toString())
      .set('v_id_devproject', id_devproject.toString());

    return this.http.delete(`${this.apiServerUrl}/api/deleteProjectUser`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateLead(id_employee: number, id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_employee', id_employee.toString())
      .set('v_id_devproject', id_devproject.toString());

    return this.http.put(`${this.apiServerUrl}/api/updateLead`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public deleteLead(id_devproject: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_devproject', id_devproject.toString());

    return this.http.delete(`${this.apiServerUrl}/api/deleteLead`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public createFolder(absolutePath: string, folderName: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    const payload = { absolutePath, folderName };
    return this.http.post(`${this.apiServerUrl}/api/createFolder`, payload, { headers });
  }

  public renameFolder(absolutePath: string, folderName: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    const payload = { absolutePath, folderName };
    return this.http.put(`${this.apiServerUrl}/api/renameFolder`, payload, { headers });
  }

  public renameFile(absolutePath: string, fileName: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    const payload = { absolutePath, fileName };
    return this.http.put(`${this.apiServerUrl}/api/renameFile`, payload, { headers });
  }

  public deleteFolder(absolutePath: string) {
    const token = localStorage.getItem('token');
    const payload = { absolutePath };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      body: payload
    };

    return this.http.delete(`${this.apiServerUrl}/api/deleteFolder`, options);
  }

  public deleteFile(absolutePath: string) {
    const payload = { absolutePath };
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      body: payload
    };

    return this.http.delete(`${this.apiServerUrl}/api/deleteFile`, options);
  }

  public downloadFolder(absolutePath: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get(`${this.apiServerUrl}/api/downloadFolder`, {
      responseType: 'blob',
      params: { absolutePath },
      headers
    });
  }

  public downloadFile(absolutePath: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get(`${this.apiServerUrl}/api/downloadFile`, {
      responseType: 'blob',
      params: { absolutePath },
      headers
    });
  }

  public downloadFinalProject(id_f_project: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams().set('id_f_project', id_f_project.toString());

    return this.http.get(`${this.apiServerUrl}/api/downloadFinalProject`, {
      params: params,
      responseType: 'blob',
      headers
    });
  }

  uploadFile(formData: FormData): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.post(`${this.apiServerUrl}/api/uploadFile`, formData, { responseType: 'text', headers });
  }

  public createFinalProject(idDevProject: number, title: string, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    const body = new HttpParams()
      .set('idDevProject', idDevProject.toString())
      .set('title', title)
      .set('description', description);

    return this.http.post(`${this.apiServerUrl}/api/createFinalProject`, body, { responseType: 'text', headers });
  }

  public disableFinalProject(id_f_project: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_f_project', id_f_project)

    return this.http.put(`${this.apiServerUrl}/api/disableFinalProject`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public enableFinalProject(id_f_project: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_f_project', id_f_project)

    return this.http.put(`${this.apiServerUrl}/api/enableFinalProject`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public getAllFinalProjects(): Observable<Final_Project[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<Final_Project[]>(`${this.apiServerUrl}/api/getAllFinalProjects`, { headers })
  }

  public deleteFinalProject(id_f_project: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_f_project', id_f_project)

    return this.http.delete(`${this.apiServerUrl}/api/deleteFinalProject`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public updateFinalProject(idFinalProject: number, title: string, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_f_project', idFinalProject.toString())
      .set('v_title', title)
      .set('v_description_', description);

    return this.http.put(`${this.apiServerUrl}/api/updateFinalProject`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public createKnowledgeBaseItem(title: string, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('title', title)
      .set('description_', description)

    return this.http.post(`${this.apiServerUrl}/api/createKnowledgeBaseItem`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public deleteKnowledgeBaseItem(id_kb_item: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('v_id_kb_item', id_kb_item.toString())

    return this.http.delete(`${this.apiServerUrl}/api/deleteKnowledgeBaseItem`, {
      params: params,
      responseType: 'text',
      headers
    });
  }

  public getKBFolderStructure(): Observable<{ folderStructure: string[], absoluteFilePaths: string[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<{ folderStructure: string[], absoluteFilePaths: string[] }>(`${this.apiServerUrl}/api/getKBFolderStructure`, { headers });
  }

  getKBFolderPath(): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get(`${this.apiServerUrl}/api/getKBFolderPath`, { responseType: 'text', headers });
  }

  public getActivityLog(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiServerUrl}/api/getActivityLog`, { headers });
  }

  public logActivity(username: string, db_action: string, db_object: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    let params = new HttpParams()
      .set('username', username)
      .set('db_action', db_action)
      .set('db_object', db_object);

    return this.http.post(`${this.apiServerUrl}/api/logActivity`, null, {
      params: params,
      responseType: 'text',
      headers
    });
  }
}