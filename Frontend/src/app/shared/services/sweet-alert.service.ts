import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  confirmDelete(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Confirmar eliminacion',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      focusCancel: true,
      reverseButtons: true
    }).then((result) => result.isConfirmed);
  }

  showDeleting(entityLabel: string): void {
    Swal.fire({
      title: `Eliminando ${entityLabel}...`,
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
      title: 'Eliminado',
      text: message,
      timer: 1800,
      showConfirmButton: false
    });
  }

  showError(message: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }
}
