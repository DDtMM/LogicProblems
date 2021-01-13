import { Component, OnInit } from '@angular/core';
import data from './samples/sample1.json';
import { GameStateService } from './game-state.service';

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
