import React from "react";

export function TreeMenuContainer({ children }) {
  return <div className="tree-menu__container">{children}</div>;
}

export function TreeMenu({ children }) {
  return <ul className="tree-menu__ul">{children}</ul>;
}

export function TreeMenuItem({ title, icon: Icon, children, root = false }) {
  return (
    <li className={`tree-menu__li ${root ? "root" : ""}`}>
      <span className="tree-menu__node no-select">
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