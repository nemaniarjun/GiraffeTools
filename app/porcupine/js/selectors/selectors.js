import { createSelector } from "redux-orm";

import orm from "../models";


export const nodes = createSelector(
  orm,
  state => state.orm,
  session => {
    return session.Node.all().toRefArray();
  }
);

export const nodesWithPorts = createSelector(
  orm,
  state => state.orm,
  session => {
    return session.Node.all().toRefArray().map(node => {
      const obj = Object.assign({}, node);
      obj.ports = session.Node.withId(node.id).ports.toRefArray();
      return obj;
    });
  }
);

export const selectedNode = createSelector(
  orm,
  state => state.orm,
  state => state.scene.selectedNode,
  (orm, selectedNode) => {
    const node = orm.Node.withId(selectedNode);
    if (!selectedNode){ return null };
    const obj = Object.assign({}, node.ref);
    //add ports
    obj.ports = node.ports.toRefArray().map(portRef => {
      const port = orm.Port.withId(portRef.id);
      //add links
      const inputLinks  = port.inputLinks  ? port.inputLinks.toRefArray()  : [];
      const outputLinks = port.outputLinks ? port.outputLinks.toRefArray() : [];

      const obj = Object.assign({}, port.ref);
      return {...obj, outputLinks, inputLinks }
    });
    return obj;
  }
);

export const hoveredNode = createSelector(
  orm,
  state => state.orm,
  state => state.scene.hoveredNode,
  (orm, hoveredNode) => {
    if (!hoveredNode) {
      return null;
    }
    const selectedNode = orm.Node.withId(hoveredNode);
    const obj = Object.assign({}, selectedNode.ref);
    obj.ports = selectedNode.ports.toRefArray();
    return obj;
  }
);

export const links = createSelector(
  orm,
  state => state.orm,
  session => {
    return session.Link.all().toRefArray();
  }
);

export const linksWithPorts = createSelector(
  orm,
  state => state.orm,
  session => {
    return session.Link.all().toRefArray().map(link => {
      const obj = Object.assign({}, link);
      obj.portFrom = obj.portFrom ? session.Port.withId(obj.portFrom).ref : null;
      obj.portTo   = obj.portTo   ? session.Port.withId(obj.portTo  ).ref : null;
      return obj;
    });
  }
);