import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { InventoryItem, InventoryItemForm } from '../models/inventory-item.model';
import { InventoryApiService } from '../services/inventory-api.service';

// Tab2 页面：库存管理功能
// 主要负责新增、更新、删除库存物品，以及展示推荐商品列表
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar
  ]
})
export class Tab2Page implements OnInit {
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

  form: InventoryItemForm;                    // 表单数据
  featuredItems: InventoryItem[] = [];        // 推荐商品列表
  updateTargetName = '';                       // 要更新的物品名称
  deleteTargetName = '';                       // 要删除的物品名称
  notice = '请填写表单以新增库存记录。';       // 提示信息
  noticeColor: 'success' | 'danger' | 'medium' = 'medium';  // 提示信息的颜色

  // 从服务里获取分类和库存状态列表
  get categories(): string[] {
    return this.inventoryApi.categories;
  }

  get stockStates(): string[] {
    return this.inventoryApi.stockStates;
  }

  // 注入服务并初始化表单
  constructor(
    private readonly inventoryApi: InventoryApiService,
    private readonly alertController: AlertController
  ) {
    this.form = this.inventoryApi.buildEmptyForm();
  }

  // 页面初始化时，加载推荐商品列表
  ngOnInit(): void {
    this.refreshFeatured();
  }

  // 刷新推荐商品列表（featured_item > 0 的物品）
  refreshFeatured(): void {
    this.inventoryApi.getAllItems().subscribe({
      next: (items) => {
        this.featuredItems = items.filter((item) => item.featured_item > 0);
      },
      error: (error: Error) => {
        this.setNotice(error.message, 'danger');
      }
    });
  }

  // 新增库存物品
  addItem(): void {
    const validation = this.validateForm();
    if (!validation.valid) {
      this.setNotice(validation.message, 'danger');
      return;
    }

    this.inventoryApi.createItem(this.form).subscribe({
      next: () => {
        this.setNotice(`已新增物品：${this.form.item_name}。`, 'success');
        this.form = this.inventoryApi.buildEmptyForm();
        this.refreshFeatured();
      },
      error: (error: Error) => {
        this.setNotice(error.message, 'danger');
      }
    });
  }

  // 根据名称加载物品信息到表单，用于编辑
  loadByNameForEdit(): void {
    if (!this.updateTargetName.trim()) {
      this.setNotice('请输入要加载编辑的物品名称。', 'danger');
      return;
    }

    this.inventoryApi.searchByName(this.updateTargetName).subscribe({
      next: (items) => {
        // 精确匹配物品名称
        const exact = items.find(
          (item) => item.item_name.toLowerCase() === this.updateTargetName.trim().toLowerCase()
        );

        if (!exact) {
          this.setNotice('未找到可更新的匹配物品。', 'danger');
          return;
        }

        // 把找到的物品数据填入表单
        this.form = {
          item_name: exact.item_name,
          category: exact.category,
          quantity: exact.quantity,
          price: exact.price,
          supplier_name: exact.supplier_name,
          stock_status: exact.stock_status,
          featured_item: exact.featured_item > 0,
          special_note: exact.special_note ?? ''
        };
        this.setNotice(`已将 ${exact.item_name} 载入表单。`, 'medium');
      },
      error: (error: Error) => {
        this.setNotice(error.message, 'danger');
      }
    });
  }

  // 根据名称更新库存物品
  updateByName(): void {
    if (!this.updateTargetName.trim()) {
      this.setNotice('请输入要更新的目标名称。', 'danger');
      return;
    }

    const validation = this.validateForm();
    if (!validation.valid) {
      this.setNotice(validation.message, 'danger');
      return;
    }

    this.inventoryApi.updateByName(this.updateTargetName, this.form).subscribe({
      next: () => {
        this.setNotice(`已更新物品：${this.updateTargetName}。`, 'success');
        this.refreshFeatured();
      },
      error: (error: Error) => {
        this.setNotice(error.message, 'danger');
      }
    });
  }

  // 根据名称删除库存物品
  // 注意：根据作业要求，Laptop 不能删除
  async deleteByName(): Promise<void> {
    const target = this.deleteTargetName.trim();
    if (!target) {
      this.setNotice('请输入要删除的目标名称。', 'danger');
      return;
    }

    // 特殊规则：禁止删除 Laptop
    if (target.toLowerCase() === 'laptop') {
      this.setNotice('根据作业要求，禁止删除 Laptop。', 'danger');
      return;
    }

    // 弹出确认对话框
    const confirmAlert = await this.alertController.create({
      header: '确认删除',
      message: `确定删除 ${target} 吗？`,
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '删除',
          role: 'destructive',
          handler: () => {
            this.inventoryApi.deleteByName(target).subscribe({
              next: () => {
                this.setNotice(`已删除物品：${target}。`, 'success');
                this.deleteTargetName = '';
                this.refreshFeatured();
              },
              error: (error: Error) => {
                this.setNotice(error.message, 'danger');
              }
            });
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  // 打开帮助弹窗
  async openHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: '帮助',
      message:
        '使用表单可新增或编辑物品数据；更新和删除按目标名称执行；根据规则 Laptop 不能删除。',
      buttons: ['确定']
    });

    await alert.present();
  }

  // 私有方法：验证表单数据
  private validateForm(): { valid: boolean; message: string } {
    if (!this.form.item_name.trim()) {
      return { valid: false, message: '物品名称不能为空。' };
    }
    // 检查物品名称是否只包含 ASCII 字符（后端数据库暂不支持中文）
    if (!this.isAsciiText(this.form.item_name.trim())) {
      return { valid: false, message: '物品名称暂不支持中文字符，请使用英文、数字或常见符号。' };
    }
    if (!this.form.supplier_name.trim()) {
      return { valid: false, message: '供应商名称不能为空。' };
    }
    if (!Number.isFinite(Number(this.form.quantity)) || Number(this.form.quantity) < 0) {
      return { valid: false, message: '数量必须是大于或等于 0 的数字。' };
    }
    if (!Number.isFinite(Number(this.form.price)) || Number(this.form.price) < 0) {
      return { valid: false, message: '价格必须是大于或等于 0 的数字。' };
    }

    return { valid: true, message: '通过' };
  }

  // 把英文分类转成中文
  toCategoryLabel(value: string): string {
    return this.categoryMap[value] ?? value;
  }

  // 把英文库存状态转成中文
  toStockStatusLabel(value: string): string {
    return this.stockStatusMap[value] ?? value;
  }

  // 私有方法：检查字符串是否只包含 ASCII 字符
  private isAsciiText(value: string): boolean {
    return /^[\x20-\x7E]+$/.test(value);
  }

  // 私有方法：设置提示信息
  private setNotice(message: string, color: 'success' | 'danger' | 'medium'): void {
    this.notice = message;
    this.noticeColor = color;
  }
}
