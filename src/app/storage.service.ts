import { Inject, Injectable } from '@angular/core';
import { Settings } from './settings/settings.component';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storageKey = 'timerSettings';
  constructor(@Inject(DOCUMENT) private document: Document) { }


  getStoredSettings(){
    return this.getData(this.storageKey) as Settings
  }

  storeSettings(settings:Settings){
    this.setData(this.storageKey, settings)
  }

  // Method to get data from localStorage
  private getData(key: string): any {
    const data = this.document.defaultView?.localStorage.getItem(key);
    // Parse JSON if data is present
    return data ? JSON.parse(data) : null;
  }

  // Method to set data to localStorage
  private setData(key: string, value: any): void {
    this.document.defaultView?.localStorage.setItem(key, JSON.stringify(value));
  }

  // Method to remove data from localStorage
  private removeData(key: string): void {
    this.document.defaultView?.localStorage.removeItem(key);
  }

}
