import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pb-hero',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {

}
