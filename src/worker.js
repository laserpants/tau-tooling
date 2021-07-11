function main() {
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

  const getTypeInfo = ({ children, meta: [datatype, con], pretty }) => {
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
  };

  const getAttributes = (datatype, con, children, args) => {
    switch (datatype) {
      case "PredicateT": {
        const [name, a] = children;

        return {
          argument: `${name}`,
          children: [builder(a)],
        };
      }
      case "SimplifiedPattern": {
        const [t, p, ps] = children;

        return {
          children: [builder(p), ...ps.map(builder)],
          ...getTypeInfo(t),
        };
      }
      case "Core": {
        switch (con) {
          case "CVar": {
            const [name] = children;

            return {
              argument: `${name}`,
              children: [],
            };
          }
          case "CLit": {
            const [prim] = children;

            return {
              children: [builder(prim)],
            };
          }
          case "CApp": {
            const [cs] = children;

            return {
              children: cs.map(builder),
            };
          }
          case "CLet": {
            const [name, c1, c2] = children;

            return {
              argument: `${name}`,
              children: [builder(c1), builder(c2)],
            };
          }
          case "CLam": {
            const [name, c1] = children;

            return {
              argument: `${name}`,
              children: [builder(c1)],
            };
          }
          case "CIf": {
            const [c1, c2, c3] = children;

            return {
              children: [builder(c1), builder(c2), builder(c3)],
            };
          }
          case "CPat": {
            const [c, cs] = children;

            return {
              children: [builder(c), builder(cs)],
            };
          }
          default:
            break;
        }
        break;
      }
      case "Name": {
        const [name] = children;

        return {
          argument: `${name}`,
          children: [],
        };
      }
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
              children: ps.map(builder),
              ...getTypeInfo(t),
            };
          }
          default:
            break;
        }
        break;
      }
      case "Guard": {
        const [es, e] = children;

        return {
          children: [builder(es), builder(e)],
        };
      }
      case "SimplifiedClause": {
        const [t, ps, gs] = children;

        return {
          children: [
            ...ps.map(builder),
            ...(Array.isArray(gs) ? gs.map(builder) : [builder(gs)]),
          ],
          ...getTypeInfo(t),
        };
      }
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
              children: [builder(e1), ...cs.map(builder)],
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
              children: cs.map(builder),
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
  };

  const builder = (obj, i) => {
    const attributes = {
      expandedIcon: "ICON_MINUS",
      collapsedIcon: "ICON_PLUS",
      pretty: obj.pretty,
    };

    if (Array.isArray(obj)) {
      return {
        ...attributes,
        nodeName: obj.length > 0 ? "[...]" : "[]",
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

    const computed = getAttributes(datatype, con, children, args);

    return {
      ...(computed.alwaysExpanded
        ? {
            ...attributes,
            expandedIcon: "ICON_OPEN",
            collapsedIcon: "ICON_OPEN",
            iconSize: 12,
          }
        : attributes),
      nodeName: con,
      datatype,
      children: Array.isArray(obj.children) ? obj.children.map(builder) : [],
      ...computed,
    };
  };

  onmessage = ({ data }) => {
    postMessage({ type: "ON_BEGIN" });
    const tree = builder(data);

    let map = {};
    const insertPath =
      (parentPath) =>
      ({ children, ...node }, i) => {
        const path = parentPath ? `${parentPath}.${i}` : `${i}`;
        map[path] = false;
        return {
          ...node,
          path,
          children: children.map(insertPath(path)),
        };
      };

    const pathTree = insertPath("")(tree, 0);

    postMessage({
      type: "ON_SUCCESS",
      payload: {
        tree: pathTree,
        map,
      },
    });
  };
}

const toBlob = (code) =>
  code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([toBlob(main.toString())], {
  type: "application/javascript",
});

module.exports = URL.createObjectURL(blob);
