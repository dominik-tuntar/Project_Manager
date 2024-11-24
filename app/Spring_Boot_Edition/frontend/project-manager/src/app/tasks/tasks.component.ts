import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Devproject } from '../devproject';
import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '../service';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { Task } from '../task';
import { saveAs } from 'file-saver';
interface FileSystemNode {
  name: string;
  isFolder: boolean;
  children?: FileSystemNode[];
  showChildren?: boolean;
  absolutePath?: string;
  newFolderVisible?: boolean;
  renameFolderVisible?: boolean;
  newFolderName?: string;
  renameFolderName?: string;
  renameFileVisible?: boolean;
  renameFileName?: string;
  uploadFileVisible?: boolean;
  isUploading?: boolean;
  uploadComplete?: boolean;
}
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})

export class TasksComponent implements OnInit {
  public username: string = '';
  public idEmployee: number = 0;
  public selectedIdTask: number = 0;
  public allowed_projects: Devproject[] = [];
  public task_data: any;
  public renderLeadProjects = false;
  public user_tasks: Task[] = [];
  public searchTerm: string = '';
  public searchTermProj: string = '';
  public tasks: Task[] = [];
  public filteredTasks: Task[] = [];
  public filteredProjects: Devproject[] = [];
  public fileSystemStructure: FileSystemNode[] = [];
  public newFolderName: string = '';
  public newFolderRename: string = '';

  constructor(private service: Service, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.idEmployee = parseInt(localStorage.getItem('id_employee') || '0', 10);
    this.getLeadProjects(this.idEmployee);
    this.getPendingTasks(this.idEmployee);
  }

  public logActivity(username: string, db_action: string, db_object: string): void {
    this.service.logActivity(username, db_action, db_object)
      .subscribe(
        (response: any) => {

        },
        (error: any) => {
          alert(error);
        }
      );


  }

  public getLeadProjects(idEmployee: number): void {

    this.service.getLeadProjects(idEmployee).subscribe(
      (response: Devproject[]) => {
        this.allowed_projects = response;
        if (response != null && response.length > 0) {
          this.renderLeadProjects = true;
          this.filteredProjects = [...this.allowed_projects];
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  @ViewChild('popupTaskEdit') popupTaskEdit!: TaskEditComponent;

  private getProjectTasks(id_devproject: number): void {
    this.service.getProjectTasks(id_devproject)
      .subscribe(
        (response: any[]) => {
          this.task_data = response;
          this.popupTaskEdit.task_data = this.task_data;
          this.popupTaskEdit.open();
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  private getPendingTasks(id_employee: number): void {
    this.service.getPendingTasks(id_employee)
      .subscribe(
        (response: any[]) => {
          this.user_tasks = response;
          this.filteredTasks = [...this.user_tasks];
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public showTaskEditPopup(idDevproject: number, projectTitle: string) {
    this.popupTaskEdit.selectedProject = idDevproject;
    this.popupTaskEdit.selectedTitle = projectTitle;
    this.getProjectTasks(idDevproject);
  }

  public filterTasks(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredTasks = this.user_tasks.filter(task =>
      task.DESCRIPTION_.toLowerCase().includes(searchTermLower)
    );
  }

  public filterProjects(): void {
    const searchTermLower = this.searchTermProj.toLowerCase();
    this.filteredProjects = this.allowed_projects.filter(a_project =>
      a_project.TITLE.toLowerCase().includes(searchTermLower) ||
      a_project.DESCRIPTION_.toLowerCase().includes(searchTermLower)
    );
  }

  public getFolderStructure(id_task: number, expandedStates?: { [key: string]: boolean }): void {
    this.selectedIdTask = id_task;
    this.service.getFolderStructure(id_task).subscribe(
      (response: { folderStructure: string[]; absoluteFilePaths: string[] }) => {
        const parsedStructure = this.parseFileStructure(response.folderStructure, response.absoluteFilePaths);
        this.fileSystemStructure = parsedStructure;
        if (expandedStates) {
          this.applyExpandedStates(this.fileSystemStructure, expandedStates);
        }

        this.cdr.detectChanges();
      },
      (error: any) => {
        alert(error);
      }
    );
  }

  private getExpandedStates(nodes: FileSystemNode[]): { [key: string]: boolean } {
    const expandedStates: { [key: string]: boolean } = {};
    const saveState = (node: FileSystemNode) => {
      if (node.isFolder) {
        expandedStates[node.absolutePath!] = !!node.showChildren;
        node.children?.forEach(saveState);
      }
    };
    nodes.forEach(saveState);
    return expandedStates;
  }

  private applyExpandedStates(nodes: FileSystemNode[], expandedStates: { [key: string]: boolean }): void {
    const restoreState = (node: FileSystemNode) => {
      if (node.isFolder) {
        node.showChildren = expandedStates[node.absolutePath!] || false;
        node.children?.forEach(restoreState);
      }
    };
    nodes.forEach(restoreState);
  }

  private findParentFolder(nodes: FileSystemNode[], child: FileSystemNode): FileSystemNode | null {
    for (const node of nodes) {
      if (node.children && node.children.includes(child)) {
        return node;
      }
      const parent = this.findParentFolder(node.children || [], child);
      if (parent) {
        return parent;
      }
    }
    return null;
  }

  toggleFolderVisibility(folder: any) {
    folder.showChildren = !folder.showChildren;
  }

  logParentFolderPath(child: FileSystemNode): void {
    const parentFolder = this.findParentFolder(this.fileSystemStructure, child);
  }

  logFolderName(folderName: string): void {
  }

  handleNewFolder(folder: FileSystemNode) {
    folder.newFolderVisible = true;
    folder.newFolderName = '';
  }

  handleRenameFolder(child: FileSystemNode) {
    child.renameFolderVisible = true;
    child.renameFolderName = child.name;
  }

  cancelNewFolder(folder: FileSystemNode) {
    folder.newFolderVisible = false;
    this.newFolderName = '';
  }

  cancelRenameFolder(child: FileSystemNode) {
    child.renameFolderVisible = false;
    this.newFolderRename = '';
  }

  public createFolder(absolutePath: string, folderName: string): void {
    if (!folderName.trim()) return;
    const expandedStates = this.getExpandedStates(this.fileSystemStructure);
    this.service.createFolder(absolutePath, folderName)
      .subscribe(
        (response: any) => {
          this.getFolderStructure(this.selectedIdTask, expandedStates);
          this.logActivity(this.username, "created a new", 'task folder');
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public renameFolder(absolutePath: string, folderName: string): void {
    if (!folderName.trim()) return;
    const expandedStates = this.getExpandedStates(this.fileSystemStructure);
    this.service.renameFolder(absolutePath, folderName)
      .subscribe(
        (response: any) => {
          this.getFolderStructure(this.selectedIdTask, expandedStates);
          this.logActivity(this.username, "renamed a", 'task folder');
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public deleteFolder(absolutePath: string): void {
    const expandedStates = this.getExpandedStates(this.fileSystemStructure);
    this.service.deleteFolder(absolutePath)
      .subscribe(
        (response: any) => {
          this.getFolderStructure(this.selectedIdTask, expandedStates);
          this.logActivity(this.username, "deleted a", 'task folder');
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public downloadFolder(child: FileSystemNode): void {
    this.service.downloadFolder(child.absolutePath!).subscribe(blob => {
      const fileName = `${child.name}.zip`;
      saveAs(blob, fileName);
    }, error => {
      alert(error);
    });
  }

  handleRenameFile(file: FileSystemNode) {
    file.renameFileVisible = true;
    file.renameFileName = file.name.substring(0, file.name.lastIndexOf('.'));
  }

  cancelRenameFile(file: FileSystemNode) {
    file.renameFileVisible = false;
    file.renameFileName = '';
  }

  renameFile(absolutePath: string, fileName: string): void {
    if (!fileName.trim()) return;
    this.service.renameFile(absolutePath, fileName).subscribe(
      response => {
        const expandedStates = this.getExpandedStates(this.fileSystemStructure);
        this.getFolderStructure(this.selectedIdTask, expandedStates);
        this.logActivity(this.username, "renamed a", 'task file');
      },
      error => {
        alert(error);
      }
    );
  }

  downloadFile(file: FileSystemNode): void {
    this.service.downloadFile(file.absolutePath!).subscribe(
      blob => {
        saveAs(blob, file.name);
      },
      error => {
        alert(error);
      }
    );
  }

  deleteFile(absolutePath: string): void {
    this.service.deleteFile(absolutePath).subscribe(
      response => {
        const expandedStates = this.getExpandedStates(this.fileSystemStructure);
        this.getFolderStructure(this.selectedIdTask, expandedStates);
        this.logActivity(this.username, "deleted a", 'task file');
      },
      error => {
        alert(error);
      }
    );
  }

  onFileSelected(event: Event, parentFolder: FileSystemNode): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      parentFolder.isUploading = true;
      parentFolder.uploadComplete = false;

      const controller = new AbortController();
      const signal = controller.signal;


      this.uploadFile(file, parentFolder.absolutePath!, parentFolder, signal);

      parentFolder.uploadFileVisible = false;
    }
  }

  uploadFile(file: File, absolutePath: string, folder: FileSystemNode, signal: AbortSignal): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('absolutePath', absolutePath);

    this.service.uploadFile(formData).subscribe(
      response => {
        folder.isUploading = false;
        folder.uploadComplete = true;

        setTimeout(() => {
          folder.uploadComplete = false;
        }, 2000);

        const expandedStates = this.getExpandedStates(this.fileSystemStructure);
        this.getFolderStructure(this.selectedIdTask, expandedStates);
        this.logActivity(this.username, "uploaded a", 'task file');
      },
      error => {
        folder.isUploading = false;
        folder.uploadComplete = false;
      }
    );
  }

  private parseFileStructure(folderStructure: string[], absoluteFilePaths: string[]): FileSystemNode[] {
    const stack: FileSystemNode[] = [];
    const result: FileSystemNode[] = [];
    let currentLevel = 0;

    for (let i = 0; i < folderStructure.length; i++) {
      const item = folderStructure[i];
      const level = item.search(/\S/) / 2;
      const name = item.trim();
      const isFolder = item.endsWith('/');
      const absolutePath = absoluteFilePaths[i];

      const node: FileSystemNode = {
        name: isFolder ? name.slice(0, -1) : name.replace(/ \(file\)$/, ""),
        isFolder,
        showChildren: true,
        absolutePath,
        newFolderVisible: false,
        renameFolderVisible: false,
        newFolderName: '',
        renameFolderName: ''
      };

      if (level > currentLevel) {
        if (stack.length) {
          const parent = stack[stack.length - 1];
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        while (stack.length > level) {
          stack.pop();
        }
        if (stack.length) {
          const parent = stack[stack.length - 1];
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          result.push(node);
        }
      }

      stack.push(node);
      currentLevel = level;
    }
    return result;
  }
}
