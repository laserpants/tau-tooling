import React, { useContext } from "react";
import { IoCube } from "react-icons/io5";
import { FaPenFancy, FaPlusSquare, FaMinusSquare } from "react-icons/fa";

export function TreeMenuContainer({ children }) {
  return <div className="tree-menu__container">{children}</div>;
}

export function TreeMenu({ children }) {
  return <ul className="tree-menu__ul">{children}</ul>;
}

export function TreeMenuItem({
  title,
  icon: Icon,
  iconSize = 11,
  typeAnnotation,
  kindAnnotation,
  classPredicates,
  errors,
  argument,
  children,
  onClick,
  toStr,
  root = false,
}) {
  const printArray = (items) => {
    if (items?.length > 0) {
      return `[${items.map(({ toStr }) => toStr).join(", ")}]`;
    }
    return "";
  };

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
              <Icon size={iconSize} />
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
        {classPredicates?.length > 0 && (
          <span>
            <span className="tree-menu__node-predicates">
              {printArray(classPredicates)}
            </span>
          </span>
        )}
        {errors?.length > 0 && (
          <span>
            <span className="tree-menu__node-errors">{printArray(errors)}</span>
          </span>
        )}
        {toStr && (
          <span className="tree-menu__node-print">
            <FaPenFancy
              onClick={() => {
                console.log(toStr);
              }}
            />
          </span>
        )}
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

export function Tree({ nodes, map, toggle }) {
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
                classPredicates,
                errors,
                argument,
                icon,
                iconSize,
                alwaysExpanded,
                toStr,
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
                  classPredicates={classPredicates}
                  errors={errors}
                  argument={argument}
                  toStr={toStr}
                  icon={getIcon(
                    icon
                      ? icon
                      : children?.length > 0 &&
                          (expanded ? expandedIcon : collapsedIcon)
                  )}
                  iconSize={iconSize}
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
