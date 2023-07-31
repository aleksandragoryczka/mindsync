import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'project-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isUserAuthenticated = false;
  activeIndex = 1;

  // constructor(private router: Router) {}

  ngOnInit(): void {
    this.setActiveIndexFromActivePath();
  }

  public onItemClick(index: number) {
    this.activeIndex = index;
  }

  public isMenuActive(index: number) {
    return this.activeIndex == index;
  }

  public get defaultMenu() {
    return [
      {
        text: 'Join presentaion',
        router_link: '#',
      },
      {
        text: 'Home',
        router_link: '#',
      },
      {
        text: 'Register',
        router_link: '#',
      },
      {
        text: 'Sign In',
        router_link: '#',
      },
    ];
  }

  public trackByFn(index: number, item: { text: string; router_link: string }) {
    return item.router_link;
  }

  private setActiveIndexFromActivePath() {
    const activePath = window.location.pathname;
    const newIndex = this.defaultMenu.findIndex(
      x => x.router_link == activePath
    );
    if (newIndex !== null) this.activeIndex = newIndex;
    this.activeIndex = 1;
  }
}
