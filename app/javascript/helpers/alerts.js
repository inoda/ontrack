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
}

export default Alerts;
