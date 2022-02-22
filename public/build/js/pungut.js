
const dataJson = []

const columnData = []

let dataExcel = []


// const dataJson = [
//   {
//     "Name": "Tiger Nixon",
//     "Position": "System Architect",
//     "Office": "Edinburgh",
//     "Age": 61,
//     "Start date": "2011/04/25",
//     "Salary": "$320,800"
//   },
//   {
//     "Name": "Garrett Winters",
//     "Position": "Accountant",
//     "Office": "Tokyo",
//     "Age": 63,
//     "Start date": "2011/07/25",
//     "Salary": "$170,750"
//   },
//   {
//     "Name": "Ashton Cox",
//     "Position": "Junior Technical Author",
//     "Office": "San Francisco",
//     "Age": 66,
//     "Start date": "2009/01/12",
//     "Salary": "$86,000"
//   },
//   {
//     "Name": "Cedric Kelly",
//     "Position": "Senior Javascript Developer",
//     "Office": "Edinburgh",
//     "Age": 22,
//     "Start date": "2012/03/29",
//     "Salary": "$433,060"
//   },
//   {
//     "Name": "Airi Satou",
//     "Position": "Accountant",
//     "Office": "Tokyo",
//     "Age": 33,
//     "Start date": "2008/11/28",
//     "Salary": "$162,700"
//   },
//   {
//     "Name": "Brielle Williamson",
//     "Position": "Integration Specialist",
//     "Office": "New York",
//     "Age": 61,
//     "Start date": "2012/12/02",
//     "Salary": "$372,000"
//   },
//   {
//     "Name": "Herrod Chandler",
//     "Position": "Sales Assistant",
//     "Office": "San Francisco",
//     "Age": 59,
//     "Start date": "2012/08/06",
//     "Salary": "$137,500"
//   },
//   {
//     "Name": "Rhona Davidson",
//     "Position": "Integration Specialist",
//     "Office": "Tokyo",
//     "Age": 55,
//     "Start date": "2010/10/14",
//     "Salary": "$327,900"
//   },
//   {
//     "Name": "Colleen Hurst",
//     "Position": "Javascript Developer",
//     "Office": "San Francisco",
//     "Age": 39,
//     "Start date": "2009/09/15",
//     "Salary": "$205,500"
//   },
//   {
//     "Name": "Sonya Frost",
//     "Position": "Software Engineer",
//     "Office": "Edinburgh",
//     "Age": 23,
//     "Start date": "2008/12/13",
//     "Salary": "$103,600"
//   },
//   {
//     "Name": "Jena Gaines",
//     "Position": "Office Manager",
//     "Office": "London",
//     "Age": 30,
//     "Start date": "2008/12/19",
//     "Salary": "$90,560"
//   },
//   {
//     "Name": "Quinn Flynn",
//     "Position": "Support Lead",
//     "Office": "Edinburgh",
//     "Age": 22,
//     "Start date": "2013/03/03",
//     "Salary": "$342,000"
//   },
//   {
//     "Name": "Charde Marshall",
//     "Position": "Regional Director",
//     "Office": "San Francisco",
//     "Age": 36,
//     "Start date": "2008/10/16",
//     "Salary": "$470,600"
//   },

// ]
// const columnData = [

//   { data: "Name", },
//   { data: "Position", },
//   { data: "Office", },
//   { data: "Age", },
//   { data: "Start date", },
//   { data: "Salary", }

// ]


function harusUbahTanggal(status) {
  new PNotify({
    title: `Pemilihan ${status}`,
    text: `Pemilihan ${status}, harap ubah tanggal pelaksanaan untuk mengaktifkan kembali fungsi ini`,
    type: 'danger',
    styling: 'bootstrap3'
  });
}

function editFieldPemilih(id) {
  $.ajax({
    url: `/dashboard/detail-field-pemilih/${window.location.href.split('/pemilihan/')[1].split('/')[0]}/${id}`,
    success: function (data) {
      // console.log('hahah', data.deskripsi)
      $("#namaFieldEdit").val(data.namaField)
      $("#tipeFieldEdit").val(data.tipeField)
      $("#idField").val(data._id)
      if (data.key) {
        $("#deleteFieldPemilih").hide()
      } else {
        $("#deleteFieldPemilih").show()

      }
      $("#deleteFieldPemilih").val(data._id)
      if (data.tipeField == 'select' || data.tipeField == 'checkbox' || data.tipeField == 'radiobox') {
        $("#jikaTipeFieldEdit").show()
        $("#dataFieldEdit").val(data.dataField.join(";"))
      } else {
        $("#jikaTipeFieldEdit").hide()
        $("#dataFieldEdit").val('')

      }
      if (data.harusDiisi) $("#harusDiisiEdit").attr("checked", "checked")

      $('.edit-field-pemilih').modal('show')

    }
  });
}

function showModalCalon(id) {
  // console.log(id)
  $.ajax({
    url: `/dashboard/detail-calon/${window.location.href.split('/pemilihan/')[1].split('/')[0]}/${id}`,
    success: function (data) {
      // console.log('hahah', data.deskripsi)
      $("#deskripsiBabi").html(data.des)
      $("#namaCalonEdit").val(data.calon.nama)
      $("#grupCalonEdit").val(data.calon.grup)
      $("#deleteCalonBtn").val(data.calon._id)
      $("#idCalonEdit").val(data.calon._id)
      $('.bs-example-modal-lg').modal('show')

    }
  });
}



$(function () {


  $('#isiImport').on('change', function (event) {
    selectedFile = event.target.files[0];
    console.log("hi");
    var fileReader = new FileReader()
    fileReader.onload = function (event) {
      var data = event.target.result;
      var workbook = XLSX.read(data, {
        type: "binary"
      });

      workbook.SheetNames.forEach(sheet => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet], {
          header: 1
        })
        dataExcel = rowObject

        // $('#isiImportExcelJson').val(jsonObject)
        $('#displayFieldImportExcel').show()
        $('#headers').html('')
        $.each(rowObject[0], function (i, item) {
          $('#headers').append($('<option>', {
            value: i,
            text: item
          }));

        });
        // document.getElementById("jsonData").innerHTML = jsonObject;
        // console.table(jsonObject);
      });
    };
    fileReader.readAsBinaryString(selectedFile);
  })

  $('#denganCara').on('change', function () {
    let val = this.value
    if (val == 'buatToken') { $('#buatToken').show() } else $('#buatToken').hide()
    if (val == 'buatManual') { $('#buatManual').show() } else $('#buatManual').hide()
    if (val == 'buatImportExcel') { $('#buatImportExcel').show() } else $('#buatImportExcel').hide()
    // alert(this.value)
  })

  $('#tambahKey').submit(function (event) {
    event.preventDefault()

    const denganCara = this.elements['denganCara'].value;
    let formData = {}

    if (denganCara == 'buatToken') {
      const isi = this.elements['isiToken'].value
      if (isi == "") return new PNotify({
        title: 'Peringatan',
        text: "Isi banyak nya token",
        type: 'danger',
        styling: 'bootstrap3'
      });
      const banyakToken = parseInt(isi)
      formData['banyakToken'] = banyakToken

    } else if (denganCara == 'buatManual') {
      const isiManual = this.elements['isiManual'].value
      if (isiManual == "") return new PNotify({
        title: 'Peringatan',
        text: "Isi kosong",
        type: 'danger',
        styling: 'bootstrap3'
      });
      formData['data'] = isiManual.split(';')
    } else if (denganCara == 'buatImportExcel') {
      // console.log(document.getElementById('isiImport').files)
      if (document.getElementById('isiImport').files.length === 0) return new PNotify({
        title: 'Peringatan',
        text: "file kosong",
        type: 'danger',
        styling: 'bootstrap3'
      });
      const headerExcel = this.elements['headers'].value
      formData['data'] = JSON.stringify(dataExcel.slice(1).map(e => String(e[parseInt(headerExcel)])))
    } else {
      return alert('aneh')
    }

    const btnTambahKey = $('#btnTambahKey')
    formData['denganCara']= denganCara
    formData['slug']= this.elements['slug'].value
    btnTambahKey.html(`<i class='fa fa-spin fa-spinner'></i> Tunggu`)

    console.log(formData)


    $.ajax({
      url: '/dashboard/tambah-key',
      data: formData,
      method: 'POST',
      datatype: 'json',// For jQuery < 1.9
      success: function (data) {
        alert(JSON.stringify(data))
        btnTambahKey.html(`Tambah`)

        // $("#calon").html(data)
        // namaCalon.prop('disabled', false)
        // if ($('#grupCalonEdit').length) {
        //   $('#grupCalonEdit').prop('disabled', false)
        // }
        // if ($('#fotoCalonEdit').length) {
        //   $('#fotoCalonEdit').prop('disabled', false).val('')
        // }
        // btnEdit.html(`Simpan Perubahan`)
        // $('.bs-example-modal-lg').modal('hide')

      }
    });
    // console.log(this.elements['denganCara'])
  })


  $('#editCalonNya').submit(function (event) {
    event.preventDefault()
    let formData = new FormData()
    let idCalon = $('#idCalonEdit')
    let namaCalon = $('#namaCalonEdit')
    let btnEdit = $('#saveEdit')

    // jika ada grupnya 
    if ($('#grupCalonEdit').length) {
      let grupCalon = $('#grupCalonEdit')
      formData.append('grupCalonEdit', grupCalon.val())
      grupCalon.prop('disabled', true)
    }
    if ($('#fotoCalonEdit').length) {
      let fotoCalonEdit = document.getElementById("fotoCalonEdit").files[0]
      formData.append('gantiFoto', fotoCalonEdit)
      $('#fotoCalonEdit').prop('disabled', true)
    }


    formData.append('idCalonEdit', idCalon.val())
    formData.append('namaCalonEdit', namaCalon.val())
    formData.append('deskripsiCalonEdit', $('#deskripsiCalonEdit')[0]['data-froala.editor'].html.get())
    formData.append('slug', window.location.href.split('/pemilihan/')[1].split('/')[0])

    // console.log('jika tidak ada', $('#grupCalonEdit').length)

    // const data = {
    //   idCalonEdit: idCalon.val(),
    //   namaCalonEdit: namaCalon.val(),
    //   grupCalonEdit: grupCalon.val(),
    //   deskripsiCalonEdit: $('#deskripsiCalonEdit')[0]['data-froala.editor'].html.get(),
    //   slug: window.location.href.split('/pemilihan/')[1].split('/')[0]
    // }

    // console.log(data)

    // console.log($('#deskripsiCalonEdit')[0]['data-froala.editor'].prop('disabled', true))
    // console.log($('#deskripsiCalonEdit')[0]['data-froala.editor'].html.get())



    namaCalon.prop('disabled', true)
    btnEdit.html(`<i class='fa fa-spin fa-spinner'></i> Tunggu`)


    $.ajax({
      url: '/dashboard/edit-calon',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'PUT',
      type: 'PUT', // For jQuery < 1.9
      success: function (data) {
        $("#calon").html(data)
        namaCalon.prop('disabled', false)
        if ($('#grupCalonEdit').length) {
          $('#grupCalonEdit').prop('disabled', false)
        }
        if ($('#fotoCalonEdit').length) {
          $('#fotoCalonEdit').prop('disabled', false).val('')
        }
        btnEdit.html(`Simpan Perubahan`)
        $('.bs-example-modal-lg').modal('hide')

      }
    });


  })

  $('#kotakBulet').on('click', function (event) {
    // console.log('kotak bulet segita', $('#kotakBulet').is(':checked'))

    $('.calon_img').toggleClass('img-circle img-cube')
    // console.log($('.calon_img').attr('class'))
  })

  $('#deleteCalonBtn').on('click', function (event) {

    // confirm("apa anda yakin")

    if (confirm("apa anda yakin")) {
      $(this).html(`<i class='fa fa-spin fa-spinner'></i> Tunggu`)
      $.ajax({
        type: "DELETE",
        url: '/dashboard/delete-calon',
        data: { idCalon: $(this).val(), slug: window.location.href.split('/pemilihan/')[1].split('/')[0] },
        success: function (data) {
          $("#calon").html(data)
          $('.bs-example-modal-lg').modal('hide')
        },
        datatype: 'json'
      })
    } else {
      return;
    }

  })
  $('#deleteFieldPemilih').on('click', function (event) {

    // confirm("apa anda yakin")

    if (confirm("apa anda yakin")) {
      $(this).html(`<i class='fa fa-spin fa-spinner'></i> Tunggu`)
      $.ajax({
        type: "DELETE",
        url: '/dashboard/delete-field-pemilih',
        data: { idField: $(this).val(), slug: window.location.href.split('/pemilihan/')[1].split('/')[0] },
        success: function (data) {
          location.reload()
        },
        datatype: 'json'
      })
    } else {
      return;
    }

  })


  $('#tambahCalon').submit(function (event) {
    event.preventDefault()
    let formData = new FormData()
    let fotoCalon = $('#fotoCalon')
    let namaCalon = $('#namaCalon')
    let btnTambahCalon = $('#btnTambahCalon')

    if ($('#grupCalon').length) {
      let grupCalon = $('#grupCalon')
      grupCalon.prop('disabled', true)
      formData.append('grupCalon', grupCalon.val())
    }



    fotoCalon.prop('disabled', true)
    namaCalon.prop('disabled', true)
    btnTambahCalon.html(`<i class='fa fa-spin fa-spinner'></i> Tunggu`)

    formData.append('gantiFoto', document.getElementById("fotoCalon").files[0])
    formData.append('namaCalon', namaCalon.val())
    formData.append('slug', window.location.href.split('/pemilihan/')[1].split('/')[0])

    // console.log(namaCalon)

    $.ajax({
      url: '/dashboard/tambah-calon',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      success: function (data) {
        $("#calon").html(data)
        fotoCalon.prop('disabled', false).val('')
        namaCalon.prop('disabled', false).val('')
        if ($('#grupCalon').length) {
          $('#grupCalon').prop('disabled', false)
        }
        btnTambahCalon.html(`Hapus`)
        btnTambahCalon.html(`Tambah Lagi`)

      }
    });
  })
})



$(function () {

  $('#tipeField').on('change', function () {
    let val = this.value
    if (val == 'select' || val == 'checkbox' || val == 'radiobox') {
      $('#jikaTipeField').show()
      console.log(val)
    } else {
      $('#jikaTipeField').hide()
    }
  })



  $('#tagGrup').on('change', function (event) {
    var $element = $(event.target)
    // console.log(JSON.stringify($element.tagsinput('items')))
    if (!$element.data('tagsinput'))
      return;

    $.ajax({
      type: "PUT",
      url: '/dashboard/change-group-field',
      data: { grup: $element.tagsinput('items'), slug: window.location.href.split('/pemilihan/')[1].split('/')[0] },
      success: function (data) {
        $("#calon").html(data)
      },
      datatype: 'json'
    })
    $('#grupCalon').html('')
    $('#grupCalonEdit').html('')
    $.each($element.tagsinput('items'), function (i, item) {
      $('#grupCalon').append($('<option>', {
        value: item,
        text: item
      }));
      $('#grupCalonEdit').append($('<option>', {
        value: item,
        text: item
      }));
    });

  }).trigger('change');


  $('#tagFieldPemilih').on('change', function (event) {
    var $element = $(event.target)

    // console.log('ini tr', tr)
    // console.log(JSON.stringify($element.tagsinput('items')))
    if (!$element.data('tagsinput'))
      return;

    $.ajax({
      type: "PUT",
      url: '/dashboard/table-field-pemilih',
      data: { fieldPemilih: $element.tagsinput('items'), slug: window.location.href.split('/pemilihan/')[1].split('/')[0] },
      success: function (data) {
        // $element.tagsinput('items').forEach((el) => {
        //   var tr = document.getElementById('datatable-buttons').tHead.children[0],
        //     th = document.createElement('th');
        //   th.innerHTML = el
        //   tr.appendChild(th);
        // })

        $("#datatable-buttons").html(data)
      },
      datatype: 'json'
    })
    // $('#grupCalon').html('')
    // $('#grupCalonEdit').html('')
    // $.each($element.tagsinput('items'), function (i, item) {
    //   $('#grupCalon').append($('<option>', {
    //     value: item,
    //     text: item
    //   }));
    //   $('#grupCalonEdit').append($('<option>', {
    //     value: item,
    //     text: item
    //   }));
    // });

  })
    .trigger('change');
});

function textAreaFlora() {
  const deskrpsi = document.getElementById('deskripsi')

  if (deskrpsi == null) {
    return;
  }

  var editor = new FroalaEditor('#deskripsi', {
    imageUploadURL: '/dashboard/upload_image'
  });
  editor.opts.events['image.removed'] = function (e, editor, $img) {
    $.ajax({
      // Request method.
      method: 'DELETE',

      // Request URL.
      url: '/dashboard/delete_image',

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

  // console.log('waktu pelaksanaan', waktuPelaksanaan)
  // console.log('waktu awal', waktuAwal.toString())
  // console.log('waltu akhir', waktuAkhir.toString())

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
    method: 'PUT',
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


function tambahCalonGrup() {
  const form = document.getElementById('tambahCalon');
  const nama = form.elements['namaCalon'].value
  const grup = form.elements['grup'].value
  const foto = form.elements['foto'].files[0]

  // const data = { nama, grup, foto }

  const hmmmmm = new FormData(form)
  hmmmmm.append('nama', nama)
  hmmmmm.append('grup', grup)
  hmmmmm.append('foto', foto)
  // console.log('hahahahahahhnnn', hmmmmm)

  fetch('/dashboard/tambah-calon', {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json'
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
    body: hmmmmm
  })
    .then(response => console.log('ok'))
    // .then(data => {
    //   console.log('Success:', data);
    // const semuaNama = document.querySelectorAll('#idnama');
    // semuaNama.forEach((nama) => {
    //   nama.innerHTML = data.nama
    // })
    // simpan.innerHTML = "Simpan"
    // nama.disabled = false
    // nohp.disabled = false
    // simpan.disabled = false
    // return new PNotify({
    //   title: 'Pembaruan profil',
    //   text: data.msg,
    //   type: 'info',
    //   styling: 'bootstrap3'
    // });
    // })
    .catch((error) => {
      console.error('Error:', error);
    });


  // $.ajax({
  //   type: "POST",
  //   url: '/dashboard/tambah-calon',
  //   data: formData,
  //   success: function (data) {
  //     alert('ok')
  //     // $("#calon").html(data)
  //   },
  //   contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  //   processData: 'true',
  //   // datatype: false
  // })


  // console.log(nama, grup, foto)
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
    method: 'PUT',
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
