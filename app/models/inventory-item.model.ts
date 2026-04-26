// 物品分类类型，一共五种：电子产品、家具、服装、工具、其他
export type ItemCategory = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Other';

// 库存状态类型：有货、库存不足、无货
export type StockStatus = 'In stock' | 'Low stock' | 'Out of stock';

// 库存物品的数据结构，对应后端 API 返回的数据格式
export interface InventoryItem {
  item_id?: number;              // 物品编号，由后端自动生成，新增时不需要填
  item_name: string;             // 物品名称，这个必须唯一哦
  category: string;              // 分类，比如 Electronics、Furniture 这些
  quantity: number;              // 库存数量
  price: number;                 // 价格
  supplier_name: string;         // 供应商名称
  stock_status: string;          // 库存状态：In stock / Low stock / Out of stock
  featured_item: number;         // 是否为推荐商品，1 表示是，0 表示否
  special_note?: string | null;  // 备注信息，可以不填
}

// 表单用的数据结构，跟上面那个差不多，但 featured_item 用 boolean 更方便前端操作
export interface InventoryItemForm {
  item_name: string;             // 物品名称
  category: string;              // 分类
  quantity: number;              // 数量
  price: number;                 // 价格
  supplier_name: string;         // 供应商
  stock_status: string;          // 库存状态
  featured_item: boolean;        // 是否推荐，这里用 true/false 更直观
  special_note: string;          // 备注
}
