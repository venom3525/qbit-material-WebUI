import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileDirectoryExplorerService } from '../services/file-system/file-directory-explorer.service';
import TreeNode from '../services/file-system/TreeNode';
import * as config from '../../assets/config.json';

@Component({
  selector: 'app-file-system-dialog',
  templateUrl: './file-system-dialog.component.html',
  styleUrls: ['./file-system-dialog.component.css']
})
export class FileSystemDialogComponent implements OnInit {

  public filePath: string[] = [];
  public leftChildren: TreeNode[] = [];              // Keep track of what folders to show in left nav
  public rightChildren: TreeNode[] = [];
  public selectedDir: TreeNode = null;               // Keep track of what folder the user last selected

  constructor(private dialogRef:MatDialogRef<FileSystemDialogComponent>, private fs: FileDirectoryExplorerService) { }

  ngOnInit(): void {
    let root = this.fs.getFileSystem();
    this.leftChildren = root.getChildren();
    this.leftChildren.sort(TreeNode.sort());
  }

  public closeDialog(): void {
    if(this.filePath.length > 0) {
      let fp = this.filePath.join(config.filePathDelimeter);
      this.dialogRef.close(fp);
    } else {
      this.dialogRef.close();
    }
  }

  /** Go to chosen child directory */
  public navigateToDir(dir: TreeNode, type: string): void {

    // Refresh children shown in right panel
    if(type === "parent") {
      if(this.rightChildren) {
        this.filePath.pop();
      }

      let dirChosen = TreeNode.GetChildFromChildrenList(this.leftChildren, dir);
      this.rightChildren = dirChosen.getChildren();

      this.rightChildren.sort(TreeNode.sort());
    }
    else if(type === "child") {

      this.leftChildren = this.rightChildren;

      let dirChosen = TreeNode.GetChildFromChildrenList(this.rightChildren, dir);
      this.rightChildren = dirChosen.getChildren();
      this.rightChildren.sort(TreeNode.sort());
    }

    this.filePath.push(dir.getValue());
    this.selectedDir = dir;
  }

  public navigateUp(): void {
    this.filePath.pop();

    let parent = this.leftChildren[0].getParent();

    // If parent is not root, continue
    if(parent.getParent()) {
      this.rightChildren = this.leftChildren;
      this.leftChildren = parent.getParent().getChildren();

      this.leftChildren.sort(TreeNode.sort());
      this.rightChildren.sort(TreeNode.sort());

      this.selectedDir = parent;
    }
  }

  public rightPanelHasContent(): boolean {
    return this.rightChildren.length === 0;
  }

  public getFilePath(): string {
    return this.filePath.length === 0 ? "<Unchanged>" : this.filePath.join(config.filePathDelimeter);
  }

  public isDirectorySelected(dir: TreeNode) {
    if(this.selectedDir) {
      return this.selectedDir.getValue() === dir.getValue();
    }
    return false;
  }

  /**Get the number of children a directory has, as a string
   * @param dir The directory to examine
   * 
   * E.g. "1 subfolder", "3 subfolders"
   */
  public getNumChildrenString(dir: TreeNode): string {
    let len = dir.getChildren().length
    return len < 1 ? `` : len === 1 ? `1 subfolder` : `${len} subfolders`
  }

}