import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {

  get(key: string, fallback: any = undefined) {
    let value = localStorage.getItem(key);
    return (value) ? JSON.parse(value) : fallback;
  }
  
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

}