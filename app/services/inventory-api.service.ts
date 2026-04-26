import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { InventoryItem, InventoryItemForm } from '../models/inventory-item.model';

// 这是一个库存管理的 API 服务，负责跟后端打交道
// 用了 Angular 的依赖注入，在整个应用里都是单例的
@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {
  // 后端 API 的基础地址
  readonly baseUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';
  // 支持的物品分类列表
  readonly categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Other'];
  // 支持的库存状态列表
  readonly stockStates = ['In stock', 'Low stock', 'Out of stock'];

  // 注入 HttpClient，用来发 HTTP 请求
  constructor(private readonly http: HttpClient) {}

  // 获取所有库存物品列表
  // 如果后端返回 null 或 undefined，就返回空数组，避免前端报错
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.baseUrl).pipe(
      map((items) => items ?? []),
      catchError((error) => this.handleError('加载库存列表失败。', error))
    );
  }

  // 根据物品名称搜索
  // 会先尝试精确匹配，如果没有结果再模糊匹配
  searchByName(name: string): Observable<InventoryItem[]> {
    const keyword = name.trim();
    // 如果搜索关键字为空，直接返回全部数据
    if (!keyword) {
      return this.getAllItems();
    }

    // 先尝试通过 URL 路径参数搜索
    return this.http.get<InventoryItem | InventoryItem[]>(`${this.baseUrl}/${encodeURIComponent(keyword)}`).pipe(
      map((response) => this.toArray(response)),
      // 如果路径参数方式失败，尝试用查询参数方式
      catchError(() => this.searchByNameWithQuery(keyword)),
      switchMap((items) => {
        // 如果找到了就直接返回
        if (items.length > 0) {
          return of(items);
        }

        // 如果还是没找到，就从全部数据里过滤
        return this.getAllItems().pipe(
          map((allItems) =>
            allItems.filter((item) => item.item_name.toLowerCase().includes(keyword.toLowerCase()))
          )
        );
      })
    );
  }

  // 新增一个库存物品
  createItem(form: InventoryItemForm): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.baseUrl, this.toPayload(form)).pipe(
      catchError((error) => this.handleError('新增库存物品失败。', error))
    );
  }

  // 根据物品名称更新库存信息
  // 会先尝试用 URL 路径参数，失败的话再用查询参数
  updateByName(targetName: string, form: InventoryItemForm): Observable<InventoryItem> {
    const name = targetName.trim();
    const payload = this.toPayload(form);

    return this.http.put<InventoryItem>(`${this.baseUrl}/${encodeURIComponent(name)}`, payload).pipe(
      // 如果路径参数方式失败，尝试用查询参数方式
      catchError(() => {
        const params = new HttpParams().set('item_name', name);
        return this.http.put<InventoryItem>(this.baseUrl, payload, { params });
      }),
      catchError((error) => this.handleError('更新库存物品失败。', error))
    );
  }

  // 根据物品名称删除库存记录
  // 同样会尝试两种方式：路径参数和查询参数
  deleteByName(targetName: string): Observable<void> {
    const name = targetName.trim();

    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(name)}`).pipe(
      // 如果路径参数方式失败，尝试用查询参数方式
      catchError(() => {
        const params = new HttpParams().set('item_name', name);
        return this.http.delete<void>(this.baseUrl, { params });
      }),
      catchError((error) => this.handleError('删除库存物品失败。', error))
    );
  }

  // 创建一个空的表单对象，用于初始化表单
  buildEmptyForm(): InventoryItemForm {
    return {
      item_name: '',
      category: 'Electronics',
      quantity: 0,
      price: 0,
      supplier_name: '',
      stock_status: 'In stock',
      featured_item: false,
      special_note: ''
    };
  }

  // 私有方法：用查询参数的方式搜索物品名称
  private searchByNameWithQuery(keyword: string): Observable<InventoryItem[]> {
    const params = new HttpParams().set('item_name', keyword);
    return this.http.get<InventoryItem | InventoryItem[]>(this.baseUrl, { params }).pipe(
      map((response) => this.toArray(response)),
      catchError(() => of([]))
    );
  }

  // 私有方法：把表单数据转换成后端需要的格式
  // 主要是把 featured_item 从 boolean 转成 0/1
  private toPayload(form: InventoryItemForm): InventoryItem {
    return {
      item_name: form.item_name.trim(),
      category: form.category,
      quantity: Number(form.quantity),
      price: Number(form.price),
      supplier_name: form.supplier_name.trim(),
      stock_status: form.stock_status,
      featured_item: form.featured_item ? 1 : 0,
      special_note: form.special_note.trim()
    };
  }

  // 私有方法：把单个对象或数组统一转成数组
  // 因为后端有时候返回单个对象，有时候返回数组，这里统一处理
  private toArray(response: InventoryItem | InventoryItem[] | null | undefined): InventoryItem[] {
    if (!response) {
      return [];
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [response];
  }

  // 私有方法：统一处理错误，把错误转成用户友好的提示信息
  private handleError(message: string, error: unknown): Observable<never> {
    return throwError(() => new Error(this.toFriendlyErrorMessage(message, error)));
  }

  // 私有方法：把错误信息转成用户能看懂的中文提示
  private toFriendlyErrorMessage(message: string, error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);
      // 特殊处理：后端数据库不支持中文字符的情况
      if (backendMessage.includes('Incorrect string value')) {
        return '新增失败：后端数据库暂不支持中文字符，请将物品名称改为英文或数字后再提交。';
      }

      if (backendMessage) {
        return `${message}${backendMessage}`;
      }

      // 服务器内部错误
      if (error.status === 500) {
        return `${message}服务器发生内部错误。`;
      }
    }

    if (error instanceof Error) {
      return `${message}${error.message}`;
    }

    return `${message}未知 API 错误。`;
  }

  // 私有方法：从错误响应体里提取后端返回的错误信息
  private extractBackendMessage(errorBody: unknown): string {
    if (typeof errorBody === 'string') {
      return errorBody;
    }

    if (errorBody && typeof errorBody === 'object') {
      const typedBody = errorBody as { error?: unknown; details?: unknown; message?: unknown };
      const detail = typedBody.details ?? typedBody.message ?? typedBody.error;
      if (typeof detail === 'string') {
        return detail;
      }
    }

    return '';
  }
}
