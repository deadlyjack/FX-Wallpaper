/**
 * @returns {ActionStack}
 */
export default function ActionStack() {
  /**
   * @type {Array<Action>}
   */
  const stack = [];
  const listeners = {
    push: [],
    pop: [],
    remove: [],
  };
  let onpush;
  let onpop;
  let onremove;

  return {
    push(action) {
      stack.push(action);
      if (onpush && typeof onpush === 'function') onpush(action);
      listeners.push.map((listener) => listener(action));
    },
    pop() {
      if (window.freeze) return;
      const action = stack.pop();

      if (action) {
        action.action();
        if (onpush && typeof onpush === 'function') onpop(action);
        listeners.pop.map((listener) => listener(action));
        if (onremove && typeof onremove === 'function') onremove(action.id);
        listeners.remove.map((listener) => listener(action.id));
      }
    },
    remove(id) {
      const mapCallback = (listener) => listener(id);
      for (let i = 0; i < stack.length; i += 1) {
        const action = stack[i];
        if (action.id === id) {
          stack.splice(i, 1);

          if (onremove && typeof onremove === 'function') onpop(id);
          listeners.remove.map(mapCallback);

          return true;
        }
      }

      return false;
    },
    has(id) {
      return stack.find(((action) => action.id === id));
    },
    on(event, listener) {
      if (event in listeners) listeners[event].push(listener);
    },
    off(event, listener) {
      if (event in listener) {
        const index = listeners[event].indexOf(listener);
        if (index > -1) listeners[event].splice(index, 1);
      }
    },
    get length() {
      return stack.length;
    },
    get onpush() {
      return onpush;
    },
    set onpush(fun) {
      if (typeof fun === 'function') onpush = fun;
    },
    get onpop() {
      return onpop;
    },
    set onpop(fun) {
      if (typeof fun === 'function') onpop = fun;
    },
    get onremove() {
      return onremove;
    },
    set onremove(fun) {
      if (typeof fun === 'function') onremove = fun;
    },
  };
}
