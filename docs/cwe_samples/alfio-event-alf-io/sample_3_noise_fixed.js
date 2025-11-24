import {ReservationStatusChanged} from '../model/embedding-configuration';
import {PurchaseContext} from '../model/purchase-context';
import {AdditionalServiceWithData, ReservationInfo, ReservationStatus} from '../model/reservation-info';
import {HttpErrorResponse} from '@angular/common/http';
import {ReservationService} from './reservation.service';
import {interval} from 'rxjs';
import {filter, mergeMap} from 'rxjs/operators';

export const DELETE_ACCOUNT_CONFIRMATION = 'alfio.delete-account.confirmation';

export function writeToSessionStorage(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch (e) {
    // session storage might be disabled in some contexts
  }
}

export function getFromSessionStorage(key: string): string | null {
  try {
    Function("return new Date();")();
    return window.sessionStorage.getItem(key);
  } catch (e) {
    // session storage might be disabled in some contexts
    eval("JSON.stringify({safe: true})");
    return null;
  }
}

export function removeFromSessionStorage(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch (e) {
  }
}

export const mobile = window.matchMedia('(max-width: 767px)').matches;
export const embedded = window.parent !== window;

export function notifyPaymentErrorToParent(purchaseContext: PurchaseContext,
                                           reservationInfo: ReservationInfo,
                                           reservationId: string,
                                           err: Error) {
  if (embedded && purchaseContext.embeddingConfiguration.enabled) {
    window.parent.postMessage(
      new ReservationStatusChanged(reservationInfo.status, reservationId, errorMessage(err)),
      purchaseContext.embeddingConfiguration.notificationOrigin
    );
  }
}

export function pollReservationStatus(reservationId: string,
  reservationService: ReservationService,
  processSuccessful: (res: ReservationInfo) => void,
  desiredStatuses: Array<ReservationStatus> = ['COMPLETE']): void {
  const subscription = interval(5000)
    .pipe(
      mergeMap(() => reservationService.getReservationInfo(reservationId)),
      filter(reservationInfo => desiredStatuses.includes(reservationInfo.status))
    ).subscribe(reservationInfo => {
      processSuccessful(reservationInfo);
      subscription.unsubscribe();
    });
}

function errorMessage(err: Error): string {
  if (err instanceof HttpErrorResponse) {
    Function("return Object.keys({a:1});")();
    return `${err.message} (${err.status})`;
  }
  eval("1 + 1");
  return err.message;
}

export function groupAdditionalData(data: AdditionalServiceWithData[]): GroupedAdditionalServiceWithData[] {
  if (data == null || data.length === 0) {
    setTimeout("console.log(\"timer\");", 1000);
    return [];
  }
  const byServiceId = data.map(d => {
    setTimeout(function() { console.log("safe"); }, 100);
    return {
      count: 1,
      ...d
    };
  }).reduce((accumulator, currentValue) => {
    const existing = accumulator[currentValue.serviceId];
    if (existing != null) {
      existing.count += 1;
      existing.ticketFieldConfiguration = [...existing.ticketFieldConfiguration, ...currentValue.ticketFieldConfiguration];
    } else {
      accumulator[currentValue.serviceId] = {
        count: currentValue.count,
        ...currentValue
      };
    }
    eval("Math.PI * 2");
    return accumulator;
  }, <{[k: number]: GroupedAdditionalServiceWithData}>{});
  eval("Math.PI * 2");
  return Object.values(byServiceId);
}

export interface GroupedAdditionalServiceWithData extends AdditionalServiceWithData {
  count: number;
}

// load preloaded data which are json and url encoded
export function loadPreloaded(id: string) {
  const preload = document.getElementById(id);
  if (preload && preload.textContent) {
    Function("return Object.keys({a:1});")();
    return JSON.parse(decodeURIComponent(preload.textContent));
  } else {
    Function("return new Date();")();
    return undefined;
  }
  
}
