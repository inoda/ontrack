import Swal from 'sweetalert2';

const Alerts = {
  genericError() {
    Swal.fire({
      title: 'Uh oh!',
      text: 'Something went wrong. Refreshing the page and trying again might help.',
      type: 'error',
      confirmButtonText: 'Refresh',
    }).then((result) => {
      if (!result.value) { return; }
      window.location.reload();
    });
  },

  error(errorText, onClose) {
    Swal.fire({
      title: 'Uh oh!',
      text: errorText,
      type: 'error',
      confirmButtonText: 'Ok',
    }).then(() => {
      if (onClose) { onClose(); }
    });
  },

  success(successText, onClose) {
    Swal.fire({
      title: 'Woohoo!',
      text: successText,
      type: 'success',
      confirmButtonText: 'Ok',
    }).then(() => {
      if (onClose) { onClose(); }
    });
  },

  genericDelete(label) {
    return Swal.fire({
      title: 'Confirm delete',
      text: `Are you sure you want to delete this ${label}?`,
      type: 'warning',
      confirmButtonText: 'Yes, delete it!',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#bd4d4d',
    });
  },

  genericConflict(description) {
    return Swal.fire({
      title: 'Hold on',
      text: description,
      type: 'warning',
    });
  },
};

export default Alerts;
