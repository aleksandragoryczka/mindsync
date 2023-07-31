import { Component } from '@angular/core';

@Component({
  selector: 'project-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent  {
  isUserAuthenticated = true;
  activeIndex = 1;
  isDropdownOpen = false;

  // constructor(private router: Router) {}

  

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

  public get userMenu() {
    return [
      {
        text: 'Presentations',
        router_link: '#',
      },
      {
        text: 'Profile',
        router_link: '#',
      },
      {
        text: 'Log Out',
        router_link: '#',
      },
    ];
  }

  public trackByFn(index: number, item: { text: string; router_link: string }) {
    return item.router_link;
  }

  public openDropdown(text: string) {
    if (text === 'Presentations') this.isDropdownOpen = true;
  }

  public closeDropdown() {
    this.isDropdownOpen = false;
  }
}
