import { RouteRecordRaw } from 'vue-router';
import { Store } from 'vuex';

declare interface App {
  device: string;
  size: string;
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
}

declare interface Permission {
  routes: RouteRecordRaw[];
  addRoutes: RouteRecordRaw[];
}

declare interface TagsView {
  visitedViews: any[];
  cachedViews: any[];
}

declare interface User {
  token: string | undefined;
  roles: string | undefined;
  name: string | undefined;
  avatar: string | undefined;
  introduction: string;
}

declare interface State {
  app: App;
  permission: Permission;
  tagsView: TagsView;
  user: User;
}

declare interface IBaseConfig {
  loginBgImage: string;
  systemName: string;
  productLogo?: string;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
