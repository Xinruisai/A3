import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { InventoryItem } from '../models/inventory-item.model';
import { InventoryApiService } from '../services/inventory-api.service';

// Tab1 页面：库存列表和搜索功能
// 主要负责展示所有库存物品，并支持按名称搜索
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonTitle,
    IonToolbar
  ],
})
export class Tab1Page implements OnInit {
  // 分类映射表：把英文分类转成中文显示
  private readonly categoryMap: Record<string, string> = {
    Electronics: '电子产品',
    Furniture: '家具',
    Clothing: '服装',
    Tools: '工具',
    Other: '其他'
  };

  // 库存状态映射表：把英文状态转成中文显示
  private readonly stockStatusMap: Record<string, string> = {
    'In stock': '有货',
    'Low stock': '库存不足',
    'Out of stock': '无货'
  };

  items: InventoryItem[] = [];      // 当前显示的库存物品列表
  searchName = '';                   // 搜索关键字
  loading = false;                   // 是否正在加载
  errorMessage = '';                 // 错误信息

  // 注入服务：inventoryApi 用来调用后端接口，alertController 用来弹窗
  constructor(
    private readonly inventoryApi: InventoryApiService,
    private readonly alertController: AlertController
  ) {}

  // 页面初始化时，自动加载所有库存数据
  ngOnInit(): void {
    this.loadAll();
  }

  // 加载所有库存物品
  loadAll(): void {
    this.loading = true;
    this.errorMessage = '';

    this.inventoryApi.getAllItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  // 根据名称搜索库存物品
  search(): void {
    this.loading = true;
    this.errorMessage = '';

    this.inventoryApi.searchByName(this.searchName).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  // 打开帮助弹窗
  async openHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: '帮助',
      message: '可通过物品名称搜索记录；点击“刷新列表”可重新从接口拉取全部数据。',
      buttons: ['确定']
    });

    await alert.present();
  }

  // 把 featured_item 的数字转成"是"或"否"
  toFeaturedLabel(value: number): string {
    return value > 0 ? '是' : '否';
  }

  // 把英文分类转成中文
  toCategoryLabel(value: string): string {
    return this.categoryMap[value] ?? value;
  }

  // 把英文库存状态转成中文
  toStockStatusLabel(value: string): string {
    return this.stockStatusMap[value] ?? value;
  }
}
