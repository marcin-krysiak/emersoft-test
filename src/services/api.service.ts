import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

export type MediaType =
  | "video"
  | "interactive video"
  | "audio"
  | "image"
  | "document";

export interface DataItem {
  title: string;
  date: string;
  type: MediaType;
}

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private localUrl = "assets/data.json";

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(this.localUrl);
  }
}
