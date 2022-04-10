import { AltSceneNode } from "../altNodes/altMixins";

export const nodesTraverserGenerator = (nodes: AltSceneNode[]) => {
  // return a traverser for modify particular type nodes
  return {
    nodes,
    traverseFirstLayer(type:string,method:Function,...args){
      // traverse first layer only
      function traverse(node:AltSceneNode){
        if (node.type === type) {
          method(node, ...args);
        }
      }
      for (const node of this.nodes) {
        traverse(node);
      }
      return this;
    },
    traverseAllNodes(method:Function,...args){
      function traverse(node:AltSceneNode){
        method(node,...args);
        if(node.type === 'FRAME'|| node.type === 'GROUP'){
          node.children.forEach(child=>traverse(child));
        }
      }
      for (const node of this.nodes) {
        traverse(node);
      }
      return this;
    },
    traverseNodesAndSkip(type:string,method:Function,...args) {
      function traverse(node:AltSceneNode){
        const typeReg = new RegExp(type)
        if (!typeReg.exec(node.type)) {
          method(node,...args);
        }
        if(node.type === 'FRAME'|| node.type === 'GROUP'){
          node.children.forEach(child=>traverse(child));
        }
      }
      for (const node of this.nodes) {
        traverse(node);
      }
      return this;
    },
    traverseNodes(type:string,method:Function,...args) {
      function traverse(node:AltSceneNode){
        const typeReg = new RegExp(type)
        if (typeReg.exec(node.type)) {
          method(node,...args);
        }
        if(node.type === 'FRAME'|| node.type === 'GROUP' || node.type === 'INSTANCE'){
          node.children.forEach(child=>traverse(child));
        }
      }
      for (const node of this.nodes) {
        traverse(node);
      }
      return this;
    }
  }
}
