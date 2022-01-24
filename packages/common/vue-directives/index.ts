const importModules = (modules: __WebpackModuleApi.RequireContext, fn: any) => {
  modules.keys().forEach(module => fn(modules(module)))
}
const installDirectives = ({ directive }: any) => {
  importModules(require.context('./', false, /\.(ts|js)$/), (module: any) => {
    // 不是默认导出的directives不做安装
    const directiveModule = module.default
    directiveModule && directiveModule.directive &&
      directive(directiveModule.name, directiveModule.directive)
  })
}
export default installDirectives
