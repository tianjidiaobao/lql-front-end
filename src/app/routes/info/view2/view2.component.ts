import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { InfoService } from 'app/service/Info.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { zip } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { ArticleQueryParam } from 'app/interface/ArticleQueryParam';
import { MeetingService } from 'app/service/meeting.service';

@Component({
  selector: 'app-info-view2',
  templateUrl: './view2.component.html',
})
export class InfoView2Component implements OnInit {
  q: any = {
    ps: 6,
    categories: [],
    owners: ['zxx'],
  };
  list: any[] = [];
  loading = false;
  total: number; // 新闻总数
  pageSize = 7;

  // region: cateogry
  categories = [
    { id: 0, text: '全部', value: false },
    { id: 1, text: '类目一', value: false },
    { id: 2, text: '类目二', value: false },
    { id: 3, text: '类目三', value: false },
    { id: 4, text: '类目四', value: false },
    { id: 5, text: '类目五', value: false },
    { id: 6, text: '类目六', value: false },
    { id: 7, text: '类目七', value: false },
    { id: 8, text: '类目八', value: false },
    { id: 9, text: '类目九', value: false },
    { id: 10, text: '类目十', value: false },
    { id: 11, text: '类目十一', value: false },
    { id: 12, text: '类目十二', value: false },
  ];
  articleSectionId: number;

  changeCategory(status: boolean, idx: number) {
    if (idx === 0) {
      this.categories.map(i => (i.value = status));
    } else {
      this.categories[idx].value = status;
    }
  }
  // endregion

  // region: owners
  // owners = [
  //   {
  //     id: 'wzj',
  //     name: '我自己',
  //   },
  //   {
  //     id: 'wjh',
  //     name: '吴家豪',
  //   },
  //   {
  //     id: 'zxx',
  //     name: '周星星',
  //   },
  //   {
  //     id: 'zly',
  //     name: '赵丽颖',
  //   },
  //   {
  //     id: 'ym',
  //     name: '姚明',
  //   },
  // ];

  // setOwner() {
  //   this.q.owners = [`wzj`];
  //   // TODO: wait nz-dropdown OnPush mode
  //   setTimeout(() => this.cdr.detectChanges());
  // }
  // endregion

  constructor(
    private http: _HttpClient,
    private meetingService: MeetingService,
    private cdr: ChangeDetectorRef,
    private infoService: InfoService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
   this.route.paramMap
   .subscribe(
     (param: ParamMap) => {
      this.articleSectionId = +param.get('sectionId');
      this.getData(1);
     });
  }

  meetingNav(articleId: number) {
    this.meetingService.getIdByArticleId(articleId)
    .pipe(
      map((res: any) => res.result.rows[0].id)
    )
    .subscribe(id => {
      console.log(id);
      this.router.navigate(['/meeting/meeting-view/', id]);
    });
  }
  getData(pageNum: number) {
    this.loading = true;
    // 使用虚拟数据先凑活着
    // const
    const param = new ArticleQueryParam(this.articleSectionId, pageNum);
    zip(
      this.infoService.getInfoNormal(param),
      this.http.get('/api/list', { count: this.q.ps })
    )
    .pipe(
      map( ([res, list]: any[]) => [res.result.rows, res.result.total, list] )
    )
    .subscribe(([rows, total, list]) => {
      this.total = total;
      let newlist = [];
      list.map((item: any, index: number) => {
        delete item.id;
        newlist = [...newlist, { ...rows[index], ...item } ];
      });
      this.list = newlist;
      this.loading = false;
      // 不知道是否需要调用 先留着吧
      // this.cdr.detectChanges();
    }
    );

    // this.http.get('/api/list', { count: this.q.ps }).subscribe((res: any) => {
    //   this.list = more ? this.list.concat(res) : res;
    //   this.loading = false;
    //   this.cdr.detectChanges();
    // });
  }
}
