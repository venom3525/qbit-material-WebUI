export default class TreeNode {
    value: any = null;
    parent: TreeNode = null;
    children: TreeNode[] = [];

    constructor(options: TreeNodeConstructor) {
        this.value = options.value;
        this.children = options.children || this.children;
    }

    public getParent(): TreeNode {
        return this.parent;
    }

    public getValue(): any {
        return this.value;
    }

    public getChildren(): TreeNode[] {
      return this.children
    }

    public setParent(par: TreeNode): void {
      this.parent = par;
    }

    public setValue(val: string): void {
      this.value = val;
    }

    public setChildren(children: TreeNode[]): void {
      this.children = children;
    }

    /** Get a pointer to a child with given value. If no such child exists, null is returned*/
    public getChild(val: any): TreeNode {
        for(const child of this.children){
            if (child.value === val) { return child; }
        }
        return null;
    }

    /** Given a value of a child, add them along with other children. Will do nothing if child with
     * given value already exists (using ===)
     * @param childValue The value of the child to add
    */
    public addChild(childValue: any): void {
        let newNode = new TreeNode({value: childValue});
        this.addChildNode(newNode);
    }

    /** Add a node to the tree.  Will do nothing if child with same value already exists (using ===)
     * @param child The new child to add
     */
    public addChildNode(child: TreeNode): void {
        if(!this.hasChild(child.value)) {
            child.setParent(this);
            this.children.push(child);
        }
    }

    /** Determine if this node already has a child with given value (uses === comparison)
     * True iff the child exists, false otherwise.
     *
     * @param children The group of children to check in
     * @param val The value of the child to look for
     *
     * */
    public hasChild(val: any): boolean {
      if(!this.children) { return false; }
      for(const child of this.children){
          if (child.value === val) { return true; }
      }
      return false;
    }

    /** Removes all instances of a child with given value from the set of children using "===" comparison.
     * @param childValue The value of the child to remove
     */
    public removeChild(childValue: any): void {
      if(this.children) {
        this.children = this.children.filter((elem: TreeNode) => {elem.value !== childValue})
      }
    }

    /** Static Methods */

    public static sort() {
        return function(a: TreeNode, b: TreeNode) {
            if(a.value > b.value) {
                return 1;
            } else if (a.value < b.value) {
                return -1;
            }
            return 0;
        }
    }

    public static GetChildFromChildrenList(children: TreeNode[], child: TreeNode): TreeNode {
        for(const ch of children) {
            if(ch.value === child.value) {
                return ch;
            }
        }
        return null;
    }
}

export interface TreeNodeConstructor {
  value: any,
  children?: TreeNode[],
  size?: number
}

export type TreeNodeType = "Directory" | "File"
