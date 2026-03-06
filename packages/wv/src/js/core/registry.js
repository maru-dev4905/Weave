export function createRegistry() {
  const plugins = [];
  const stores = new Map();

  function register(plugin) {
    if (!plugin || !plugin.name) {
      throw new Error('WEAVE plugin must have a name');
    }

    const exists = plugins.find((p) => p.name === plugin.name);
    if (exists) {
      console.warn(`WEAVE plugin "${plugin.name}" already registered`);
      return;
    }

    plugins.push(plugin);
    stores.set(plugin.name, new Map());
  }

  function getPlugins() {
    return plugins;
  }

  function getPlugin(name) {
    return plugins.find((p) => p.name === name);
  }

  function getStore(name) {
    if (!stores.has(name)) {
      stores.set(name, new Map());
    }
    return stores.get(name);
  }

  function getInstance(pluginName, el) {
    return getStore(pluginName).get(el);
  }

  function setInstance(pluginName, el, instance) {
    getStore(pluginName).set(el, instance);
  }

  function deleteInstance(pluginName, el) {
    getStore(pluginName).delete(el);
  }

  function getStoreEntries(pluginName) {
    return Array.from(getStore(pluginName).entries());
  }

  function clearStore(pluginName) {
    getStore(pluginName).clear();
  }

  return {
    plugins,
    register,
    getPlugins,
    getPlugin,
    getStore,
    getInstance,
    setInstance,
    deleteInstance,
    getStoreEntries,
    clearStore,
  };
}
