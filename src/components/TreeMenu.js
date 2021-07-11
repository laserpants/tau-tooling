import React, { useContext } from "react";
import { IoCube } from 'react-icons/io5';
import {
  FaPenFancy,
  FaPlusSquare,
  FaMinusSquare,
} from "react-icons/fa";
import { TreeContext } from "../contexts/Tree";

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
  pretty,
  root = false,
}) {
  return (
    <li className={`tree-menu__li ${root ? "root" : ""}`}>
      <span className="tree-menu__node-container no-select">
        <span
          className="tree-menu__node"
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
        <span className="tree-menu__node-print">
          <FaPenFancy
            onClick={() => {
              console.log(pretty);
            }}
          />
        </span>
      </span>
      {children}
    </li>
  );
}

function getIcon(icon) {
  if ("string" !== typeof icon) {
    return icon;
  }

  switch (icon) {
    case "ICON_PLUS":
      return FaPlusSquare;
    case "ICON_MINUS":
      return FaMinusSquare;
    case "ICON_OPEN":
    default:
      return IoCube;
  }
}

export function Tree({ nodes }) {
  const { map, toggle } = useContext(TreeContext);

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
                alwaysExpanded,
                pretty,
              },
              i
            ) => {
              const expanded = map ? map[path] : false;

              return (
                <TreeMenuItem
                  key={i}
                  root={root}
                  title={nodeName}
                  typeAnnotation={typeAnnotation}
                  kindAnnotation={kindAnnotation}
                  argument={argument}
                  pretty={pretty}
                  icon={getIcon(
                    icon
                      ? icon
                      : children?.length > 0 &&
                          (expanded ? expandedIcon : collapsedIcon)
                  )}
                  onClick={() => toggle(path)}
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
