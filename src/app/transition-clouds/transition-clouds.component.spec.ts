import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionCloudsComponent } from './transition-clouds.component';

describe('TransitionCloudsComponent', () => {
  let component: TransitionCloudsComponent;
  let fixture: ComponentFixture<TransitionCloudsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitionCloudsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransitionCloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
