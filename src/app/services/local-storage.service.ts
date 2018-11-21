import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public constructor() { }

  public setItem(key: string | null, value: any): void {
    if (key) {
      localStorage.setItem(key, value);
    }
  }

  public getItem(key: string | null): string | null {
    let item: string | null = null;
    if (key) {
      item = localStorage.getItem(key);
    }
    return item;
  }

  public removeItem(key: string | null): void {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }


}
