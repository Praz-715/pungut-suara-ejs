




function gantiSandi() {
  const form = document.getElementById('gantiSandi');
  const sandiBaru = form.elements['sandiBaru'];
  const sandiLama = form.elements['sandiLama'];
  const btnUbahSandi = form.elements['btnUbahSandi'];

  sandiBaru.disabled = true
  sandiLama.disabled = true

  const data = {
    sandiBaru: sandiBaru.value,
    sandiLama: sandiLama.value
  }
  btnUbahSandi.innerHTML = "<i class='fa fa-spin fa-spinner'></i> Tunggu"

  fetch('/dashboard/ganti-sandi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      // console.log('Success:', data.);
      btnUbahSandi.innerHTML = "Ubah"
      let eror = false 
      if (data.msg === 'Sandi tidak berbeda') {
        sandiBaru.value = ''
        sandiLama.value = ''
        eror = true
      } else if (data.msg === 'Sandi lama salah') {
        sandiLama.value = ''
        eror = true
      } else if (data.msg === 'sukses') {
        sandiBaru.value = ''
        sandiLama.value = ''
      }
      sandiBaru.disabled = false
      sandiLama.disabled = false
      if(eror){
        return new PNotify({
          title: 'Pembaruan kata sandi',
          text: data.msg,
          type: 'danger',
          styling: 'bootstrap3'
        });
      }else{
        return new PNotify({
          title: 'Pembaruan kata sandi',
          text: data.msg,
          type: 'info',
          styling: 'bootstrap3'
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}

function updateProfile() {
  const form = document.getElementById('updateProfile');
  const nama = form.elements['nama']
  const nohp = form.elements['nohp']
  const simpan = form.elements['simpan']

  nama.disabled = true
  nohp.disabled = true
  simpan.disabled = true

  const data = {
    nama: nama.value,
    nohp: nohp.value
  }

  simpan.innerHTML = "<i class='fa fa-spin fa-spinner'></i> Tunggu"

  fetch('/dashboard/update-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const semuaNama = document.querySelectorAll('#idnama');
      semuaNama.forEach((nama) => {
        nama.innerHTML = data.nama
      })
      simpan.innerHTML = "Simpan"
      nama.disabled = false
      nohp.disabled = false
      simpan.disabled = false
      return new PNotify({
        title: 'Pembaruan profil',
        text: data.msg,
        type: 'info',
        styling: 'bootstrap3'
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // console.log(nama.toString())

}
