export const importModules = (modules: __WebpackModuleApi.RequireContext, fn: any) => {
  modules.keys().forEach(module => fn(modules(module)))
}