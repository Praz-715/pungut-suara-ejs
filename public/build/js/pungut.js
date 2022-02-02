

const dataJson = [
  {
    "Name": "Tiger Nixon",
    "Position": "System Architect",
    "Office": "Edinburgh",
    "Age": 61,
    "Start date": "2011/04/25",
    "Salary": "$320,800"
  },
  {
    "Name": "Garrett Winters",
    "Position": "Accountant",
    "Office": "Tokyo",
    "Age": 63,
    "Start date": "2011/07/25",
    "Salary": "$170,750"
  },
  {
    "Name": "Ashton Cox",
    "Position": "Junior Technical Author",
    "Office": "San Francisco",
    "Age": 66,
    "Start date": "2009/01/12",
    "Salary": "$86,000"
  },
  {
    "Name": "Cedric Kelly",
    "Position": "Senior Javascript Developer",
    "Office": "Edinburgh",
    "Age": 22,
    "Start date": "2012/03/29",
    "Salary": "$433,060"
  },
  {
    "Name": "Airi Satou",
    "Position": "Accountant",
    "Office": "Tokyo",
    "Age": 33,
    "Start date": "2008/11/28",
    "Salary": "$162,700"
  },
  {
    "Name": "Brielle Williamson",
    "Position": "Integration Specialist",
    "Office": "New York",
    "Age": 61,
    "Start date": "2012/12/02",
    "Salary": "$372,000"
  },
  {
    "Name": "Herrod Chandler",
    "Position": "Sales Assistant",
    "Office": "San Francisco",
    "Age": 59,
    "Start date": "2012/08/06",
    "Salary": "$137,500"
  },
  {
    "Name": "Rhona Davidson",
    "Position": "Integration Specialist",
    "Office": "Tokyo",
    "Age": 55,
    "Start date": "2010/10/14",
    "Salary": "$327,900"
  },
  {
    "Name": "Colleen Hurst",
    "Position": "Javascript Developer",
    "Office": "San Francisco",
    "Age": 39,
    "Start date": "2009/09/15",
    "Salary": "$205,500"
  },
  {
    "Name": "Sonya Frost",
    "Position": "Software Engineer",
    "Office": "Edinburgh",
    "Age": 23,
    "Start date": "2008/12/13",
    "Salary": "$103,600"
  },
  {
    "Name": "Jena Gaines",
    "Position": "Office Manager",
    "Office": "London",
    "Age": 30,
    "Start date": "2008/12/19",
    "Salary": "$90,560"
  },
  {
    "Name": "Quinn Flynn",
    "Position": "Support Lead",
    "Office": "Edinburgh",
    "Age": 22,
    "Start date": "2013/03/03",
    "Salary": "$342,000"
  },
  {
    "Name": "Charde Marshall",
    "Position": "Regional Director",
    "Office": "San Francisco",
    "Age": 36,
    "Start date": "2008/10/16",
    "Salary": "$470,600"
  },

]
const columnData = [

  { data: "Name", },
  { data: "Position", },
  { data: "Office", },
  { data: "Age", },
  { data: "Start date", },
  { data: "Salary", }

]



function textAreaFlora() {
  const deskrpsi = document.getElementById('deskripsi')

  if (deskrpsi == null) {
    return;
  }

  var editor = new FroalaEditor('#deskripsi', {
    imageUploadURL: '/upload_image'
  });
  editor.opts.events['image.removed'] = function (e, editor, $img) {
    $.ajax({
      // Request method.
      method: 'POST',

      // Request URL.
      url: '/delete_image',

      // Request params.
      data: {
        src: $img.attr('src')
      }
    })
      .done(function (data) {
        console.log('Image was deleted');
      })
      .fail(function (err) {
        console.log('Image delete problem: ' + JSON.stringify(err));
      })
  }
}

textAreaFlora()


function waktuBerjalan() {
  const ambilspan = document.getElementById('countdown')

  if (ambilspan === null) {
    return;
  }

  moment.locale('id')
  const waktuAwal = moment(waktuPelaksanaan.awal);
  const waktuAkhir = moment(waktuPelaksanaan.akhir);

  console.log('waktu pelaksanaan', waktuPelaksanaan)
  console.log('waktu awal', waktuAwal.toString())
  console.log('waltu akhir', waktuAkhir.toString())

  // console.log('countdate',countDownDate)
  let x = setInterval(function () {

    if (waktuAwal.diff(moment()) < 0) {
      // console.log('diff waktu awal', waktuAwal.diff(moment()))
      if (waktuAkhir.diff(moment()) < 0) {
        // $('#countdown').text(`${Math.abs(waktuAkhir.diff(moment(), 'days'))} hari`)
        $('#sifatPemilihan').text('telah berakhir')
        $('#countdown').text(`${moment(waktuAkhir).countdown().toString()} lalu`);
        clearInterval(x)
      } else {
        if (waktuAkhir.diff(moment(), 'seconds') == 0) {
          location.reload()
          clearInterval(x)
        }
        // window.location.reload()
        $('#countdown').text(moment(waktuAkhir).countdown().toString());
      }
    } else {
      if (waktuAwal.diff(moment(), 'seconds') == 0) {
        $('#sifatPemilihan').text('sedang beralangsung')
        window.location.reload()
        clearInterval(x)
      }
      $('#countdown').text(moment(waktuAwal).countdown().toString());
    }


    // console.log('di interval')
    // diff = countDownDate.diff(moment());

    // console.log('difff',diff)

    // if (diff <= 0) {
    //   clearInterval(x);
    //    // If the count down is finished, write some text 
    //   $('#countdown').text("EXPIRED");
    // } else
    //   $('#countdown').text(moment.utc(diff).format("M[bulan] D[hari] HH:mm:ss"));

  }, 1000);


  // console.log(ambilspan);
}

waktuBerjalan()

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
      if (eror) {
        return new PNotify({
          title: 'Pembaruan kata sandi',
          text: data.msg,
          type: 'danger',
          styling: 'bootstrap3'
        });
      } else {
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
