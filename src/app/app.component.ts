import { Component, OnInit } from '@angular/core';

import { GameStateService } from './game-state/game-state.service';
import data from './samples/sample1.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  constructor(private gameState: GameStateService) {}

  ngOnInit() {
    this.gameState.initState(data);
  }
}
