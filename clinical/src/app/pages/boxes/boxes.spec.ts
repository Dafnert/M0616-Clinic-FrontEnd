import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesComponent} from './boxes';


describe('BoxesComponent', () => {
  let component: BoxesComponent;
  let fixture: ComponentFixture<BoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
