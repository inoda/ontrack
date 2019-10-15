import Swal from 'sweetalert2'

const Alerts = {
  genericError() {
    Swal.fire({
      title: 'Uh oh!',
      text: 'Something went wrong. Refreshing the page and trying again might help.',
      type: 'error',
      confirmButtonText: 'Refresh'
    }).then((result) => {
      if (!result.value) { return; }
      window.location.reload();
    })
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
    })
  },

  genericConflict(description) {
    return Swal.fire({
      title: 'Hold on',
      text: description,
      type: 'warning',
    })
  },
}

export default Alerts;
