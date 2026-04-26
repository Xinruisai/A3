import { Routes } from '@angular/router';

// 应用根路由配置
// 默认路由会懒加载 tabs 路由模块
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
