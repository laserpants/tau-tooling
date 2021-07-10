import React, { useState } from "react";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";

function getTypeInfo({ children, meta: [datatype, con], pretty }) {
  const kind = ({ meta: [, con], children }) => {
    switch (con) {
      case "TVar":
      case "TCon":
      case "TApp":
        const [k] = children;
        return k.pretty;
      case "TRow":
        return "Row";
      default:
        return "*";
    }
  };

  switch (datatype) {
    case "TypeInfoT": {
      const [errors, ty, predicates] = children;

      return {
        typeAnnotation: ty.pretty,
        kindAnnotation: kind(ty),
        classPredicates: predicates.children.map(builder),
        errors: errors.children.map(builder),
      };
    }
    case "Type": {
      return {
        typeAnnotation: pretty,
        kindAnnotation: kind({ meta: [datatype, con], children }),
        classPredicates: [],
        errors: [],
      };
    }
    default:
      break;
  }
  return {};
}

function getAttributes(datatype, con, children, args) {
  switch (datatype) {
    case "Expr": {
      switch (con) {
        case "EVar": {
          const [t, name] = children;

          return {
            argument: name,
            children: [],
            ...getTypeInfo(t),
          };
        }
        case "EFix": {
          const [t, name, e1, e2] = children;

          return {
            argument: name,
            children: [builder(e1), builder(e2)],
            ...getTypeInfo(t),
          };
        }
        default:
          break;
      }
      break;
    }
    default:
      break;
  }
  return {};
}

export function builder(obj) {
  const attributes = {
    expandedIcon: FaMinusSquare,
    collapsedIcon: FaPlusSquare,
  };

  if (Array.isArray(obj)) {
    return {
      ...attributes,
      nodeName: "[...]",
      children: obj.map(builder),
    };
  }

  if (!obj.meta) {
    return {
      ...attributes,
      nodeName: obj,
      children: [],
    };
  }

  const {
    meta: [datatype, con],
    children,
    ...args
  } = obj;

  return {
    ...attributes,
    nodeName: con,
    datatype,
    children: Array.isArray(obj.children) ? obj.children.map(builder) : [],
    ...getAttributes(datatype, con, children, args),
  };
}

export function TreeMenuContainer({ children }) {
  return <div className="tree-menu__container">{children}</div>;
}

export function TreeMenu({ children }) {
  return <ul className="tree-menu__ul">{children}</ul>;
}

export function TreeMenuItem({
  title,
  icon: Icon,
  typeAnnotation,
  kindAnnotation,
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
        <span className="tree-menu__node-title">{title}</span>
        {typeAnnotation && (
          <span className="tree-menu__node-annotation">
            {`: ${typeAnnotation} :: ${kindAnnotation}`}
          </span>
        )}
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

  const handleNodeToggled = (path) => {
    const updateNode =
      (path) =>
      ({ children, expanded, ...node }, i) => {
        return {
          ...node,
          children: children.map((child, j) =>
            path.length > 1 && j === path[1]
              ? updateNode(path.slice(1))(child, j)
              : child
          ),
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
    handleNodeToggled,
  };
}

export function Tree({ nodes, onToggleNode = () => {} }) {
  const Subtree = ({ nodes, root = false }) => {
    console.log(nodes);
    return (
      nodes && (
        <TreeMenu>
          {nodes.map(
            (
              {
                nodeName,
                path,
                children,
                expandedIcon,
                collapsedIcon,
                typeAnnotation,
                kindAnnotation,
                icon,
                expanded,
              },
              i
            ) => (
              <TreeMenuItem
                key={i}
                root={root}
                title={nodeName}
                typeAnnotation={typeAnnotation}
                kindAnnotation={kindAnnotation}
                icon={
                  icon
                    ? icon
                    : children?.length > 0 &&
                      (expanded ? expandedIcon : collapsedIcon)
                }
                onClick={onToggleNode.bind(null, path)}
              >
                <Subtree nodes={expanded ? children : []} />
              </TreeMenuItem>
            )
          )}
        </TreeMenu>
      )
    );
  };

  return <Subtree nodes={nodes} root={true} />;
}
