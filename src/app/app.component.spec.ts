import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        BasketService,
        AccountService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize services on ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const basketService = TestBed.inject(BasketService);
    const accountService = TestBed.inject(AccountService);
    
    spyOn(basketService, 'initializeBasket');
    spyOn(accountService, 'initializeCurrentUser');
    
    app.ngOnInit();
    
    expect(basketService.initializeBasket).toHaveBeenCalled();
    expect(accountService.initializeCurrentUser).toHaveBeenCalled();
  });
});
