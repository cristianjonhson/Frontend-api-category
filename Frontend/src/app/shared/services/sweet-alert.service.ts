import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { SWEET_ALERT_TEXTS, SWEET_ALERT_COLORS, SWEET_ALERT_CONFIG, SWEET_ALERT_ICONS } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  confirmDelete(message: string): Promise<boolean> {
    return Swal.fire({
      title: SWEET_ALERT_TEXTS.TITLE_CONFIRM_DELETE,
      text: message,
      icon: SWEET_ALERT_ICONS.WARNING,
      showCancelButton: true,
      confirmButtonText: SWEET_ALERT_TEXTS.BUTTON_CONFIRM_DELETE,
      cancelButtonText: SWEET_ALERT_TEXTS.BUTTON_CANCEL,
      confirmButtonColor: SWEET_ALERT_COLORS.CONFIRM,
      cancelButtonColor: SWEET_ALERT_COLORS.CANCEL,
      focusCancel: SWEET_ALERT_CONFIG.FOCUS_CANCEL,
      reverseButtons: SWEET_ALERT_CONFIG.REVERSE_BUTTONS
    }).then((result) => result.isConfirmed);
  }

  showDeleting(entityLabel: string): void {
    Swal.fire({
      title: SWEET_ALERT_TEXTS.TITLE_DELETING(entityLabel),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  showSuccess(message: string): Promise<any> {
    return Swal.fire({
      icon: SWEET_ALERT_ICONS.SUCCESS,
      title: SWEET_ALERT_TEXTS.TITLE_DELETED,
      text: message,
      timer: SWEET_ALERT_CONFIG.SUCCESS_TIMER,
      showConfirmButton: SWEET_ALERT_CONFIG.SHOW_CONFIRM_BUTTON
    });
  }

  showError(message: string): Promise<any> {
    return Swal.fire({
      icon: SWEET_ALERT_ICONS.ERROR,
      title: SWEET_ALERT_TEXTS.TITLE_ERROR,
      text: message
    });
  }
}
