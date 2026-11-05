(() => {
  "use strict";
  // One native update wrapper shared by the two temporary movement owners.
  const bindings = new WeakMap();
  globalThis.GSTFarmUpdate = {
    attached(scene) {
      if (!scene?.auto) return false;
      const entry = bindings.get(scene.auto);
      return !!entry && scene.auto.update === entry.wrapper;
    },
    add(scene, priority, callback) {
      const auto = scene.auto;
      let entry = bindings.get(auto);
      if (entry && auto.update !== entry.wrapper) throw new Error("Auto update owner changed");
      if (!entry) {
        const original = auto.update;
        const descriptor = Object.getOwnPropertyDescriptor(auto, "update");
        entry = { original, descriptor, callbacks: new Map(), ordered: [] };
        entry.wrapper = function (...args) {
          if (this === auto) {
            for (const handler of entry.ordered) if (handler.callback.apply(this, args) === true) return;
          }
          if (this === auto && globalThis.GSTFarmCombat?.active(scene)) {
            const nativeArgs = [...args];
            nativeArgs[0] = GSTFarmCombat.host(scene, args[0]);
            return original.apply(this, nativeArgs);
          }
          return original.apply(this, args);
        };
        auto.update = entry.wrapper;
        bindings.set(auto, entry);
      }
      const token = Symbol();
      entry.callbacks.set(token, { priority, callback });
      entry.ordered = [...entry.callbacks.values()].sort((a, b) => a.priority - b.priority);
      return () => {
        entry.callbacks.delete(token);
        entry.ordered = [...entry.callbacks.values()].sort((a, b) => a.priority - b.priority);
        if (entry.callbacks.size) return;
        if (auto.update === entry.wrapper) {
          if (entry.descriptor) Object.defineProperty(auto, "update", entry.descriptor);
          else delete auto.update;
        }
        if (bindings.get(auto) === entry) bindings.delete(auto);
      };
    }
  };
})();
