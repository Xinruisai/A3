import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentText, lockClosed, create } from 'ionicons/icons';

// Tabs 页面组件
// 这是标签页的容器组件，负责管理底部导航栏和三个标签页的切换
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    // 注册标签栏用到的图标
    addIcons({ documentText, create, lockClosed });
  }
}
