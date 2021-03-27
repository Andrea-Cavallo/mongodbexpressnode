$(document).ready(function () {
  ottieniUtenti();

  $("#cercaPerNomeBut").click(function () {
    ottieniPerNome();
  });

  $("#updatemodale").click(function () {
    modificaStudente();
  });


  $("#inviaForm").click(function () {
    let studente = {};
    studente.name = $("#name").val();
    studente.address = $("#address").val();
    studente.city = $("#city").val();
    studente.Postcode = $("#Postcode").val();
    console.log(studente);

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/api/students/send1",
      data: studente, // data lo passi con post e put >
    })
      .done(function (data) {
        alert("STUDENTE INSERITO CON SUCCESSO");
        location.reload();
      })
      .fail(function (data) {
        alert("QUALCOSA E ANDATO STORTO");
      });
  });

  $("#check").change(function () {
    if ($(this).is(":checked")) {
      $("#delete-row").removeAttr("disabled");
    } else {
      $("#delete-row").attr("disabled", "disabled");
    }
  });

  // Find and remove selected table rows
  $("#delete-row").on("click", function () {
    let id = $("#delete-row").attr("data-idstudente");
    if (id != undefined) {
      deleteStud(id);
    }
  });

  $("#update-row").on("click", function () {
    let stud = $("#update-row").attr("data-studente");
    updateStud(stud);
  });
});
function ottieniPerNome() {
  let nome = $("#cercaPerNome").val();
    $.get(
    "http://localhost:3000/api/students/findbyName/" + nome,
    function (res) {
      console.log("FIND BY NAME RETURN :" + nome);
      console.log(JSON.stringify(res));
    }
  ).done(function (res) {
    console.log(res);

    if (res.length == 0) {
      let row = "<tr><td>NON CI SONO RECORDS</td></tr>";
      return;
    }
    $("#risultati").empty();
    for (let elem of res) {
      console.log("ho trovato dei nomi !!");
     
      let row =
        "<tr><td>" +
        elem.name +
        "&nbsp;&nbsp;</td><td>" +
        elem.city +
        "&nbsp;&nbsp;</td><td>" +
        elem.address +
        "&nbsp;&nbsp;</td><td>" +
        elem.Postcode +
        "&nbsp;&nbsp;</td></tr>";

      $("#risultati").append(row);
      $("#modaleCerca").modal({
        backdrop: "static",
        keyboard: true,
        show: true,
      });
    }
  });
}

function ottieniUtenti() {
  $.get("http://localhost:3000/api/students", function () {
    console.log("CHIAMATA REST");
  })
    .done(function (res) {
      console.log(res);
      $("tbody#bodyTabella").empty();

      if (res.length == 0) {
        let row = "<tr><td>NON CI SONO RECORDS</td></tr>";
        return;
      }

      for (let elem of res) {
        console.log("sto mettendo riga");
        let row =
          //id univoco e nel value gli abbiamo passato l'elemento stringhifato
          "<tr><td><input type='radio' name='studenteradio' id='" +
          elem._id +
          "' value='" +
          JSON.stringify(elem) +
          "'></input></td><td>" +
          elem.name +
          "</td><td>" +
          elem.city +
          "</td><td>" +
          elem.address +
          "</td><td>" +
          elem.Postcode +
          "</td></tr>";

        $("tbody#bodyTabella").append(row);
        // mi crea la riga e gli aggancia poi qst funzione nel ciclo tt i radio hanno qst comportaemnto
        $("input[type=radio][name=studenteradio]").click(function () {
          let id = $(this).attr("id");
          let studente = $(this).val(); // tt la stringa che rapp il json studente
          console.log(id);
          $("#delete-row").attr("data-idstudente", id);
          $("#update-row").attr("data-studente", studente);
        });
      }
    })
    .fail(function () {
      alert("error");
    })
    .always(function () {});

  $(".top").click(function () {
    $("body , html").animate({ scrollTop: 0 }, 1500);
  });
}

function deleteStud(id) {
  console.log(id);
  $.ajax({
    type: "DELETE",
    url: "http://localhost:3000/api/students/remove/" + id,

    success: function (res) {
      alert(JSON.stringify(res));
      let string = "ELIMINATO CON SUCCESSSO!!!"
      ("#Eliminato").append(string);
      $("#modaleEliminato").modal({
        backdrop: "static",
        keyboard: true,
        show: true,
      });
      location.reload();
    },
    error: function () {
      console.log("Error:");
    },
  });
}

function updateStud(studente) {
  let stud = JSON.parse(studente);
  console.log(stud);
  //oggetto trasformato prendo singole propr e assegna i valori alla mdoale
  $("#idMod").val(stud._id);
  $("#nameMod").val(stud.name);
  $("#cityMod").val(stud.city);
  $("#addressMod").val(stud.address);
  $("#postcodeMod").val(stud.Postcode);
  $("#modaleModifica").modal();
}

function modificaStudente() {
  let toupdate = {};
  toupdate.name = $("#nameMod").val();
  toupdate.address = $("#addressMod").val();
  toupdate.city = $("#cityMod").val();
  toupdate.Postcode = $("#postcodeMod").val();
  let id = $("#idMod").val();

  $.ajax({
    type: "PUT",
    url: "http://localhost:3000/api/students/update/" + id,
    data: toupdate,
    success: function (data) {
      alert(JSON.stringify(data));
      location.reload();
    },
    error: function () {
      console.log("Error:");
    },
  });
}
