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
    case "Op1": {
      const [t] = children;

      return {
        children: [],
        ...getTypeInfo(t),
      };
    }
    case "Op2": {
      const [t] = children;

      return {
        children: [],
        ...getTypeInfo(t),
      };
    }
    case "Binding": {
      switch (con) {
        case "BPat": {
          const [t, p] = children;

          return {
            children: [builder(p)],
            ...getTypeInfo(t),
          };
        }
        case "BFun": {
          const [t, name, ps] = children;

          return {
            argument: name,
            children: [builder(ps)],
            ...getTypeInfo(t),
          };
        }
        default:
          break;
      }
      break;
    }
    case "SimplifiedClause":
    case "Clause": {
      const [t, p, gs] = children;

      return {
        children: [
          builder(p),
          ...(Array.isArray(gs) ? gs.map(builder) : [builder(gs)]),
        ],
        ...getTypeInfo(t),
      };
    }
    case "Prim": {
      switch (con) {
        case "TUnit": {
          return {
            argument: "()",
            children: [],
          };
        }
        default: {
          const [name] = children;

          return {
            argument: `${name}`,
            children: [],
          };
        }
      }
    }
    case "Pattern": {
      switch (con) {
        case "PVar": {
          const [t, name] = children;

          return {
            argument: name,
            children: [],
            ...getTypeInfo(t),
          };
        }
        case "PCon": {
          const [t, name, ps] = children;

          return {
            argument: name,
            children: ps.map(builder),
            ...getTypeInfo(t),
          };
        }
        case "PAs": {
          const [t, name, p] = children;

          return {
            argument: name,
            children: [builder(p)],
            ...getTypeInfo(t),
          };
        }
        case "PLit": {
          const [t, prim] = children;

          return {
            children: [builder(prim)],
            ...getTypeInfo(t),
          };
        }
        case "PAny": {
          const [t] = children;

          return {
            children: [],
            ...getTypeInfo(t),
          };
        }
        case "POr": {
          const [t, p1, p2] = children;

          return {
            children: [builder(p1), builder(p2)],
            ...getTypeInfo(t),
          };
        }
        case "PTuple":
        case "PList": {
          const [t, ps] = children;

          return {
            children: ps.map(builder),
            ...getTypeInfo(t),
          };
        }
        case "PRow": {
          const [t, name, p1, p2] = children;

          return {
            argument: name,
            children: [builder(p1), builder(p2)],
            ...getTypeInfo(t),
          };
        }
        case "PAnn": {
          const [t, p1] = children;

          return {
            children: [builder(t), builder(p1)],
          };
        }
        default:
          break;
      }
      break;
    }
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
        case "ECon": {
          const [t, name, es] = children;

          return {
            argument: name,
            children: es.map(builder),
            ...getTypeInfo(t),
          };
        }
        case "ELit": {
          const [t, prim] = children;

          return {
            children: [builder(prim)],
            alwaysExpanded: true,
            ...getTypeInfo(t),
          };
        }
        case "EApp": {
          const [t, es] = children;

          return {
            children: es.map(builder),
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
        case "ELam": {
          const [t, e1, e2] = children;

          return {
            children: [...e1.map(builder), builder(e2)],
            ...getTypeInfo(t),
          };
        }
        case "EIf": {
          const [t, e1, e2, e3] = children;

          return {
            children: [builder(e1), builder(e2), builder(e3)],
            ...getTypeInfo(t),
          };
        }
        case "EPat": {
          const [t, e1, cs] = children;

          return {
            children: [builder(e1), builder(cs)],
            ...getTypeInfo(t),
          };
        }
        case "ELet": {
          const [t, e1, e2, e3] = children;

          return {
            children: [builder(e1), builder(e2), builder(e3)],
            ...getTypeInfo(t),
          };
        }
        case "EFun": {
          const [t, cs] = children;

          return {
            children: [builder(cs)],
            ...getTypeInfo(t),
          };
        }
        case "EOp1": {
          const [t, op, e1] = children;

          return {
            children: [builder(op), builder(e1)],
            ...getTypeInfo(t),
          };
        }
        case "EOp2": {
          const [t, op, e1, e2] = children;

          return {
            children: [builder(op), builder(e1), builder(e2)],
            ...getTypeInfo(t),
          };
        }
        case "ETuple":
        case "EList": {
          const [t, es] = children;

          return {
            children: es.map(builder),
            ...getTypeInfo(t),
          };
        }
        case "ERow": {
          const [t, name, e1, e2] = children;

          return {
            argument: name,
            children: [builder(e1), builder(e2)],
            ...getTypeInfo(t),
          };
        }
        case "EAnn": {
          const [t, e1] = children;

          return {
            children: [builder(t), builder(e1)],
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
  argument,
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
            <Icon size={11} />
          </span>
        )}
        <span className="tree-menu__node-title">{title}</span>
        {argument && (
          <span className="tree-menu__node-argument">
            <span className="tree-menu__node-argument-label">{argument}</span>
          </span>
        )}
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
                argument,
                icon,
                expanded,
                alwaysExpanded,
              },
              i
            ) => {
              return (
                <TreeMenuItem
                  key={i}
                  root={root}
                  title={nodeName}
                  typeAnnotation={typeAnnotation}
                  kindAnnotation={kindAnnotation}
                  argument={argument}
                  icon={
                    icon
                      ? icon
                      : children?.length > 0 &&
                        (expanded ? expandedIcon : collapsedIcon)
                  }
                  onClick={onToggleNode.bind(null, path)}
                >
                  <Subtree nodes={expanded || alwaysExpanded ? children : []} />
                </TreeMenuItem>
              );
            }
          )}
        </TreeMenu>
      )
    );
  };

  return <Subtree nodes={nodes} root={true} />;
}
