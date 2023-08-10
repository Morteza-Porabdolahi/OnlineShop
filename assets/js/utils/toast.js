import Swal from 'sweetalert2/dist/sweetalert2';

const toast = Swal.mixin({
  toast: true,
  position: 'top',
  timer: 2500,
  showConfirmButton: false,
});

toast.success = function (text = '') {
  this.fire({
    icon: 'success',
    text,
  });
};

toast.error = function (text = '') {
  this.fire({
    icon: 'error',
    text,
  });
};

toast.loading = function () {
  this.fire({
    text: 'لطفا صبر کنید...',
  });
  this.showLoading();
};

export { toast };
