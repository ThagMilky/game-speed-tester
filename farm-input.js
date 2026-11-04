(() => {
  "use strict";
  const bindings = new WeakMap();
  globalThis.GSTFarmInput = {
    add(scene, callback) {
      let entry = bindings.get(scene);
      if (entry && scene.startClickOrder !== entry.wrapper) throw new Error("Click input owner changed");
      if (!entry) {
        const original = scene.startClickOrder;
        const descriptor = Object.getOwnPropertyDescriptor(scene, "startClickOrder");
        entry = { callbacks: new Map(), descriptor };
        entry.wrapper = function (...args) {
          if (this !== scene) return original.apply(this, args);
          // Phaser may process a previously queued canvas click on a later frame.
          // Validate focus here, where that click would actually turn farm off.
          const accepted = !document.hidden && document.hasFocus();
          for (const observer of entry.callbacks.values()) {
            try { observer(accepted); } catch { /* Diagnostics must not break native input. */ }
          }
          if (!accepted) return;
          return original.apply(this, args);
        };
        scene.startClickOrder = entry.wrapper;
        bindings.set(scene, entry);
      }
      const token = Symbol(); entry.callbacks.set(token, callback);
      return () => {
        entry.callbacks.delete(token);
        if (entry.callbacks.size) return;
        if (scene.startClickOrder === entry.wrapper) {
          if (entry.descriptor) Object.defineProperty(scene, "startClickOrder", entry.descriptor);
          else delete scene.startClickOrder;
        }
        if (bindings.get(scene) === entry) bindings.delete(scene);
      };
    }
  };
})();
