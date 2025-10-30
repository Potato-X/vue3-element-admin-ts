import { State } from '#/store';
import { createStore } from 'vuex';

const modulesFiles = import.meta.glob('./modules/*.ts', { eager: true });
const moduleKeys = Object.keys(modulesFiles);

const modules = moduleKeys.reduce((modules: any, modulePath: string) => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1');
  const value: any = modulesFiles[modulePath];
  modules[moduleName] = value.default;
  return modules;
}, {});

const store = createStore<State>({
  modules
});

export default store;
