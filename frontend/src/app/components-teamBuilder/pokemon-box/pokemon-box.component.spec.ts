import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonBoxComponent } from './pokemon-box.component';

describe('PokemonBoxComponent', () => {
  let component: PokemonBoxComponent;
  let fixture: ComponentFixture<PokemonBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
