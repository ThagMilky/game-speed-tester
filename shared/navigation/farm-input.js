(() => {
  "use strict";
  const bindings = new WeakMap();
  globalThis.GSTFarmInput = {
    movement(scene) {
      const typing = scene.chat?.typing || scene.inputFieldActive?.() || scene.keyCapture;
      return !!scene.clickOrder || !!scene.joyX || !!scene.joyY || (!typing
        && ["W", "A", "S", "D", "UP", "DOWN", "LEFT", "RIGHT"].some((key) => scene.keys?.[key]?.isDown));
    },
    add(scene, callback) {
      let entry = bindings.get(scene);
      if (entry && scene.startClickOrder !== entry.wrapper) throw new Error("Click input owner changed");
      if (!entry) {
        const original = scene.startClickOrder;
        const descriptor = Object.getOwnPropertyDescriptor(scene, "startClickOrder");
        entry = { callbacks: new Map(), descriptor };
        const keepFarm = () => globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() === true
          && scene.auto?.on === true && typeof scene.auto.pause === "function";
        entry.pauseClick = () => {
          if (!scene.clickOrder || !keepFarm()) return;
          scene.auto.pause(scene.now());
          scene.autoX = scene.autoY = 0;
        };
        entry.wrapper = function (...args) {
          if (this !== scene) return original.apply(this, args);
          // Phaser may process a previously queued canvas click on a later frame.
          // Validate focus here, where that click would actually turn farm off.
          const accepted = !document.hidden && document.hasFocus();
          for (const observer of entry.callbacks.values()) {
            try { observer(accepted); } catch { /* Diagnostics must not break native input. */ }
          }
          if (!accepted) return;
          if (!keepFarm() || args[2] !== 0 || typeof scene.toggleAutoFarm !== "function")
            return original.apply(this, args);
          // Suppress only the synchronous OFF request made by native click movement.
          // Explicit toggles outside this call retain their normal behavior.
          const toggle = scene.toggleAutoFarm;
          const toggleDescriptor = Object.getOwnPropertyDescriptor(scene, "toggleAutoFarm");
          const preserve = function (...toggleArgs) {
            if (this === scene && scene.auto.on) return;
            return toggle.apply(this, toggleArgs);
          };
          scene.toggleAutoFarm = preserve;
          try { return original.apply(this, args); }
          finally {
            if (scene.toggleAutoFarm === preserve) {
              if (toggleDescriptor) Object.defineProperty(scene, "toggleAutoFarm", toggleDescriptor);
              else delete scene.toggleAutoFarm;
            }
            entry.pauseClick();
          }
        };
        scene.startClickOrder = entry.wrapper;
        scene.events.on("preupdate", entry.pauseClick);
        bindings.set(scene, entry);
      }
      const token = Symbol(); entry.callbacks.set(token, callback);
      return () => {
        entry.callbacks.delete(token);
        if (entry.callbacks.size) return;
        scene.events.off("preupdate", entry.pauseClick);
        if (scene.startClickOrder === entry.wrapper) {
          if (entry.descriptor) Object.defineProperty(scene, "startClickOrder", entry.descriptor);
          else delete scene.startClickOrder;
        }
        if (bindings.get(scene) === entry) bindings.delete(scene);
      };
    }
  };
})();
