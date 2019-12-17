import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observer } from "rxjs";
import { ApiService, DataItem, MediaType } from "../../services/api.service";

type Sort = "alphabetical" | "dateUploaded" | "type";

@Component({
  selector: "app-media-list",
  templateUrl: "./media-list.component.html",
  styleUrls: ["./media-list.component.less"]
})
export class MediaListComponent implements OnInit {
  private data?: DataItem[];
  private modifiedData?: DataItem[];
  private sortOrder = 1;

  private mediaListForm = new FormGroup({
    filter: new FormControl(""),
    sort: new FormControl(""),
    searchString: new FormControl("")
  });

  private observer: Observer<any[]> = {
    next: () => {
      this.modifiedData = this.data;
      this.applyAll();
    },
    error: () => {
      console.log("ops... something when wrong");
    },
    complete: () => {
      console.log("observer completed");
    }
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getData().subscribe((data: DataItem[]) => {
      this.data = data;
      this.modifiedData = this.data;
    });

    this.mediaListForm.get("filter").valueChanges.subscribe(this.observer);
    this.mediaListForm.get("sort").valueChanges.subscribe(this.observer);
    this.mediaListForm
      .get("searchString")
      .valueChanges.subscribe(this.observer);
  }

  changeSortOrder() {
    this.sortOrder = this.sortOrder * -1;
    this.applySorting();
  }

  applySearchFiltering() {
    const searchString: string = this.mediaListForm.get("searchString").value;
    this.modifiedData = this.modifiedData.filter(mediaItem => {
      if (!searchString) return true;
      return (
        !!mediaItem.title.toLowerCase().match(searchString.toLowerCase()) ||
        mediaItem.type.toLowerCase().match(searchString.toLowerCase())
      );
    });
  }

  applyFilter() {
    const mediaType: MediaType = this.mediaListForm.get("filter").value;
    this.modifiedData = this.modifiedData.filter(mediaItem => {
      if (!mediaType) return true;
      return mediaItem.type === mediaType;
    });
  }

  applySorting() {
    const sort: Sort = this.mediaListForm.get("sort").value;
    if (!!sort) this.modifiedData = this.modifiedData.sort(this.sorter(sort));
  }

  applyAll() {
    this.applySearchFiltering();
    this.applyFilter();
    this.applySorting();
  }

  resetAll() {
    this.sortOrder = 1;
    this.modifiedData = this.data;
    this.mediaListForm.get("filter").reset("");
    this.mediaListForm.get("sort").reset("");
    this.mediaListForm.get("searchString").reset("");
  }

  sorter = (type: Sort) => (a: DataItem, b: DataItem) => {
    const x =
      type === "alphabetical"
        ? a.title
        : type === "type"
        ? a.type
        : new Date(a.date);
    const y =
      type === "alphabetical"
        ? b.title
        : type === "type"
        ? b.type
        : new Date(b.date);
    return x < y ? -1 * this.sortOrder : x > y ? 1 * this.sortOrder : 0;
  };
}
