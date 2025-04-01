import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ModalConstant, Tracing } from 'src/assets/core/data/constant/constant';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/assets/core/services/api/user.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { Subscription } from 'rxjs';
import { LOG } from 'src/assets/core/utils/log.service';
import { Roles } from 'src/assets/core/services/config/roles.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
  exchangeTokenSubscribe: Subscription = new Subscription();
  @Input('user') user?: User;
  @Input('dashboard') dashboard?: Dashboard;
  environment = environment;
  currency: string = '';

  isShadowActive: boolean = false;
  constructor(
    private shared: SharedService,
    public authService: AuthService,
    private router: Router
  ) {
    router.events.subscribe((event: any) => {
      // Controlla se l'evento è di tipo NavigationEnd e contiene la proprietà url
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.isShadowActive = true;
        } else {
          this.isShadowActive = false;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateData();
    this.calculateHeight();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get roles(): typeof Roles {
    return Roles;
  }

  ngOnInit(): void {
    if (this.user?.name === 'DEFAULT_NAME') {
      this.user = UserService.getUserData();
    }
    this.calculateHeight();
  }

  updateData(): void {
    if (!this.dashboard) this.dashboard = this.shared.getDashboard();
    this.user = UserService.getUserData();
    this.currency = this.user.attributes.money_stats_settings.currencySymbol;
  }

  availableSoon() {
    ToastService.availableSoon();
  }

  logout() {
    this.authService.logout();
  }

  calculateHeight() {
    const setFullHeight = (): void => {
      // Calcola 1% dell'altezza del viewport
      const vh = window.innerHeight * 0.01;

      // Imposta la variabile CSS --vh con il valore calcolato
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Inizializza la variabile al caricamento della pagina
    window.addEventListener('load', setFullHeight);

    // Aggiungi un listener per il ridimensionamento della finestra
    window.addEventListener('resize', setFullHeight);

    // Ricalcola anche al caricamento iniziale per dispositivi mobili
    document.addEventListener('DOMContentLoaded', setFullHeight);
  }

  exchangeTokenAndRedirect() {
    const client_id = environment.taxCalculatorClientID;
    this.exchangeTokenSubscribe = this.authService
      .exchangeToken(client_id)
      .subscribe((data) => {
        LOG.info(data.message!, 'HeaderComponent');
        const SESSION_ID = localStorage.getItem(Tracing.SESSION_ID);
        const redirectUri = environment.taxCalculatorUrl
          .concat('?access-token=')
          .concat(data.data.token.access_token)
          .concat('&session-id=')
          .concat(SESSION_ID!);
        window.location.href = redirectUri;
      });
  }

  ngOnDestroy(): void {
    this.exchangeTokenSubscribe.unsubscribe();
  }
}
