import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareableLinkComponent } from './shareable-link.component';

describe('ShareableLinkComponent', () => {
  let component: ShareableLinkComponent;
  let fixture: ComponentFixture<ShareableLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareableLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareableLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
