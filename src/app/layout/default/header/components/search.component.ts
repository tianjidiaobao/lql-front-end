import {
  Component,
  HostBinding,
  Input,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'header-search',
  template: `
  <button nz-button nzType="primary" nzSize="large" nzBlock>留学归侨人员联合信息发布与共享系统</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderSearchComponent implements AfterViewInit {
  q: string;

  qIpt: HTMLInputElement;

  @HostBinding('class.alain-default__search-focus')
  focus = false;

  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false;

  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') return;
    this.searchToggled = true;
    this.focus = true;
    setTimeout(() => this.qIpt.focus(), 300);
  }

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input');
  }

  qFocus() {
    this.focus = true;
  }

  qBlur() {
    this.focus = false;
    this.searchToggled = false;
  }
}
