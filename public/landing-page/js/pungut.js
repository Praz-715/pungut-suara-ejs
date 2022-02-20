function waktuBerjalanLanding() {
  const ambilspan = document.getElementById('countdown')

  if (ambilspan === null) {
    return;
  }

  moment.locale('id')
  const waktuAwal = moment(document.getElementById('waktuAwal').innerText);
  const waktuAkhir = moment(document.getElementById('waktuAkhir').innerText);

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
          clearInterval(x)
          setTimeout(()=>{
            location.reload()
          },800)
        }
        // window.location.reload()
        $('#sifatPemilihan').text('berakhir pada')
        $('#countdown').text(moment(waktuAkhir).countdown().toString());
      }
    } else {
      if (waktuAwal.diff(moment(), 'seconds') == 0) {
        $('#sifatPemilihan').text('sedang beralangsung')
        // window.location.reload()
        clearInterval(x)
        setTimeout(()=>{
          location.reload()
        },800)
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

waktuBerjalanLanding()