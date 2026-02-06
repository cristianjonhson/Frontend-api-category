import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { SWEET_ALERT_TEXTS, SWEET_ALERT_COLORS } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  confirmDelete(message: string): Promise<boolean> {
    return Swal.fire({
      title: SWEET_ALERT_TEXTS.TITLE_CONFIRM_DELETE,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: SWEET_ALERT_TEXTS.BUTTON_CONFIRM_DELETE,
      cancelButtonText: SWEET_ALERT_TEXTS.BUTTON_CANCEL,
      confirmButtonColor: SWEET_ALERT_COLORS.CONFIRM,
      cancelButtonColor: SWEET_ALERT_COLORS.CANCEL,
      focusCancel: true,
      reverseButtons: true
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
      icon: 'success',
      title: SWEET_ALERT_TEXTS.TITLE_DELETED,
      text: message,
      timer: 1800,
      showConfirmButton: false
    });
  }

  showError(message: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: SWEET_ALERT_TEXTS.TITLE_ERROR,
      text: message
    });
  }
}
