import React, { useState } from "react";

export function TreeMenuContainer({ children }) {
  return <div className="tree-menu__container">{children}</div>;
}

export function TreeMenu({ children }) {
  return <ul className="tree-menu__ul">{children}</ul>;
}

export function TreeMenuItem({
  title,
  icon: Icon,
  children,
  onClick,
  root = false,
}) {
  return (
    <li className={`tree-menu__li ${root ? "root" : ""}`}>
      <span
        className="tree-menu__node no-select"
        onClick={(e) => {
          e.stopPropagation();
          if ("function" === typeof onClick) onClick(e);
        }}
      >
        {Icon && (
          <span className="tree-menu__node-icon">
            <Icon />
          </span>
        )}
        <span>{title}</span>
      </span>
      {children}
    </li>
  );
}

export function useMenu(nodes) {
  const insertPath =
    (parentPath) =>
    ({ children, ...node }, i) => {
      const path = [...parentPath, i];
      return {
        ...node,
        path,
        children: children.map(insertPath(path)),
      };
    };

  const [treeNodes, setTreeNodes] = useState(nodes.map(insertPath([])));

  const handleClick = (path) => {
    const updateNode =
      (path) =>
      ({ children, expanded, ...node }, i) => {
        return {
          ...node,
          children: children.map(updateNode(path.slice(1))),
          expanded: 1 === path.length && i === path[0] ? !expanded : expanded,
        };
      };
    setTreeNodes(treeNodes.map(updateNode(path)));
  };

  const expandAll = (expanded = true) => {
    const expand = ({ children, ...node }) => {
      return {
        ...node,
        children: children.map(expand),
        expanded,
      };
    };
    setTreeNodes(treeNodes.map(expand));
  };

  const collapseAll = expandAll.bind(null, false);

  return {
    treeNodes,
    setTreeNodes,
    collapseAll,
    expandAll,
    handleClick,
  };
}

export function Tree({ nodes }) {
  const {
    treeNodes,
    setTreeNodes,
    collapseAll,
    expandAll,
    handleClick,
  } = useMenu(nodes);
  
  const Subtree = ({ nodes, root = false }) => {
    return (
      <>
        {nodes && (
          <TreeMenu>
            {nodes.map(
              (
                {
                  nodeName,
                  path,
                  children,
                  expandedIcon,
                  collapsedIcon,
                  icon,
                  expanded,
                },
                i
              ) => (
                <TreeMenuItem
                  key={i}
                  root={root}
                  title={nodeName}
                  icon={
                    icon
                      ? icon
                      : children?.length > 0 &&
                        (expanded ? expandedIcon : collapsedIcon)
                  }
                  onClick={handleClick.bind(null, path)}
                >
                  <Subtree nodes={expanded ? children : []} />
                </TreeMenuItem>
              )
            )}
          </TreeMenu>
        )}
      </>
    );
  };

  return (
    <>
      <Subtree nodes={treeNodes} root={true} />
    </>
  );
}
