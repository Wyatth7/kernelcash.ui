import {Component} from '@angular/core';
import {SideNavComponent} from './side-nav/side-nav.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'kc-core',
  imports: [
    SideNavComponent,
    RouterOutlet
  ],
  templateUrl: 'core.component.html'
})
export class CoreComponent {

}
