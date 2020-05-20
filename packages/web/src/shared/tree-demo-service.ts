import { TreeNode, TreeDataSource } from '@mazdik-lib/tree-lib';

export class TreeDemoService implements TreeDataSource {

  url: string = 'assets/tree.json';

  getNodes(node: TreeNode): Promise<TreeNode[]> {
    const children: any[] = [
      {
        id: 'MALE',
        name: 'MALE',
        data: { column: 'gender' },
        leaf: false,
      },
      {
        id: 'FEMALE',
        name: 'FEMALE',
        data: { column: 'gender' },
      }];
    if (node) {
      children[0].id = 'MALE' + node.$$level;
      children[0].name = 'MALE' + node.$$level;
      children[0].leaf = (node.$$level === 10);
      children[1].id = 'FEMALE' + node.$$level;
      children[1].name = 'FEMALE' + node.$$level;
      return new Promise((resolve) => {
        setTimeout(() => resolve(children), 500);
      });
    } else {
      return this.get();
    }
  }

  searchNodes(name: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(['ELYOS', 'MALE', 'LAZY']), 500);
    });
  }

  private get(): Promise<TreeNode[]> {
    return fetch(this.url).then(res => res.json());
  }

}
