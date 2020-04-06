var ma_dviqly;
var ma_ddo;
var table;
var table_tsvh;
// var myurl = 'http://localhost:45860/api';
var myurl = 'http://cskh.pcdongnai.vn/BH2API/api';

$(document).ready(function() {

    if (typeof(Storage) !== "undefined") {
        ma_dviqly = localStorage.getItem("ma_dviqly");
        $('#cbo_dviqly option[value=' + ma_dviqly + ']').attr('selected', 'selected');
    } else {
        console.log("Sorry! No Web Storage support..");
    }

    // console.log(myurl);

    var d = new Date();
    var strNgay = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();

    var tungay = $("#tsvhTuNgay").datetimepicker({
        format: 'DD-MM-YYYY',
    });

    $("#tsvhTuNgay").val(strNgay);

    $("#tsvhDenNgay").datetimepicker({
        format: 'DD-MM-YYYY',
    });
    $("#tsvhDenNgay").val(strNgay);

    // loadChart();

    $('input[name="optNotes"]:radio').change(function() {
        updateNote(this.value);
    });

});

function getTheodoi() {
    ma_dviqly = $('#cbo_dviqly').children("option:selected").val();
    localStorage.setItem("ma_dviqly", ma_dviqly);

    if (ma_dviqly == '' || ma_dviqly == null) return;

    $('#lstKH a').remove();

    $.ajax({
        url: myurl + '/th_diem_do/note/' + ma_dviqly,
        type: 'GET',
        dataType: 'json'
    }).done(function(d) {
        if (d != null) {
            console.log("OK");
            if (d.length > 0) {
                $.each(d, function(i, row) {
                    $('#lstKH').append(
                        '<a href="#" class="list-group-item list-group-item-action ' + (row.temp3 == 'R' ? 'list-group-item-success' : '') + '" onclick="loadInfo(\'' + row.ma_ddo + '\')">' +
                        '<div class="row">' +
                        '<h6 class="list-group-item-heading col-md-11">' + row.ten_khang + '</h6>' +
                        // '<button class="btn btn-outline-danger btn-sm btn-circle col-md-1" onclick="updateNote(\'' + row.ma_khang + '\',\'X\')"><i class = "fa fa-heart"></i></button >' +
                        '</div>' +
                        '</a>'
                    );
                })
            }
        } else {
            console.log("No data !");
        }
    }).fail(function(msg) {
        console.log("Load data failed !");
    });

}

function loadInfo(_ma_ddo) {
    ma_ddo = _ma_ddo;
    if (ma_ddo == "") {
        $("#msg").html("Chưa nhập điều kiện tìm kiếm!");
        $("#popupDialog").popup("open");
        return;
    }
    $.ajax({
        url: myurl + '/th_diem_do/' + ma_dviqly + '/' + ma_ddo,
        type: 'GET',
        dataType: 'json'
    }).done(function(d) {
        if (d != null) {
            // $('#trang_thai').html(d.trang_thai == 1 ? '' : 'Hết hiệu lực!');
            $('#ma_khang').html(d.ma_khang);
            $('#ten_khang').html(d.ten_khang);
            $('#dchi_khang').html((d.so_nha == null ? '' : d.so_nha) + ' ' + d.duong_pho);

            // $('#title_ma_ddo').html(d.ma_khang);
            // $('#ma_ddo').html(d.ma_ddo);
            // $('#so_pha').html(d.so_pha);
            // $('#so_ho').html(d.so_ho);
            // $('#dchi_ddo').html(d.dchi_ddo);
            // $('#muc_dich').html(d.muc_dich);
            $('#chuoi_gia').html(d.chuoi_gia);

            $('#ma_tram').html(d.ma_tram);
            $('#loai_tram').html(d.loai_tram);
            $('#ten_tram').html(d.ten_tram);
            $('#ma_sogcs').html(d.ma_sogcs);
            $('#lich_ghi').html(d.lich_ghi);
            $('#ten_sogcs').html(d.ten_sogcs);
            $('#ma_gcs').html(d.ma_kvuc + '.' + d.stt);

            $('#so_cto').html(d.so_cto);
            $('#loai_cto').html(d.loai_cto);
            $('#ma_cloai').html(d.ma_cloai);
            $('#ten_cloai').html(d.ten_cloai);
            $('#ngay_bdong').html(d.so_cto == null ? '' : $.date(d.ngay_bdong));

            $('#dthoai').html(d.dthoai);
            $('#dthoai2').html(d.dthoai2);
            // $('#fax').html(d.fax);
            $('#email').html(d.email);

            var temp3 = d.temp3 == null ? 'X' : d.temp3;
            // $('input[name="optNotes"]:radio').value = temp3;
            // $('input:radio[name=optNotes][value=' + temp3 + ']').attr('checked', true);
            $('input:radio[name="optNotes"][value=' + temp3 + ']').prop('checked', true);
            console.log(temp3);

            if (table != null) {
                table.destroy();
                $('#tbl_body tr').remove();
                table = $('#table').DataTable();
            }

            if (table_tsvh != null) {
                table_tsvh.destroy();
                $('#tbl_tsvh_body tr').remove();
                table_tsvh = $('#table_tsvh').DataTable();
            }

        } else {
            console.log("Không tìm thấy dữ liệu");
        }
    }).fail(function(msg) {
        console.log(msg);
    });
    return false;
}

function loadData() {
    if (ma_dviqly == '' || ma_dviqly == null) return;
    if (ma_ddo == '' || ma_ddo == null) return;

    var ma_khang = ma_ddo.substring(0, 13);

    if (table != null) {
        table.destroy();
        $('#tbl_body tr').remove();
    }

    $.ajax({
        url: myurl + '/hdn/' + ma_dviqly + '/VC/' + ma_khang,
        type: 'GET',
        dataType: 'json'
    }).done(function(d) {
        if (d != null) {
            console.log("Start load data " + ma_khang);
            if (d.length > 0) {
                $.each(d, function(i, row) {
                    $('#tbl_body').append(
                        '<tr>' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + row.ma_khang + '</td>' +
                        '<td>' + row.ma_sogcs + '</td>' +
                        '<td>' + row.nam + '-' + row.thang + '</td>' +
                        '<td>' + row.ky + '</td>' +
                        '<td>' + moment(row.ngay_cky).format("DD/MM/YYYY") + '</td>' +
                        '<td>' + row.loai_hdon + '</td>' +
                        '<td>' + row.dien_tthu + '</td>' +
                        '<td>' + row.cosfi + '</td>' +
                        '<td>' + row.kcosfi + '</td>' +
                        '<td>' + row.so_tien + '</td>' +
                        '<td>' + row.tien_gtgt + '</td>' +
                        '<td>' + row.tong_tien + '</td>' +
                        '</tr>');
                })
                table = $('#table_hdn').DataTable();
            }
            console.log("Load data finished!");
        } else {
            console.log("No data !");
        }
    }).fail(function(msg) {
        console.log("Load data failed !");
    });

    return false;
}

function loadTSVH() {
    if (ma_dviqly == '' || ma_dviqly == null) return;
    if (ma_ddo == '' || ma_ddo == null) return;

    var strTuNgay = $("#tsvhTuNgay").val();

    var to = $("#tsvhDenNgay").val().split("-");
    var d = new Date(to[2], to[1] - 1, to[0]);
    var strDenNgay = (d.getDate() + 1) + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();

    if (table_tsvh != null) {
        table_tsvh.destroy();
        $('#tbl_tsvh_body tr').remove();
    }

    $.ajax({
        url: myurl + '/vhIFC/' + ma_dviqly + '/' + ma_ddo + '/' + strTuNgay + '/' + strDenNgay,
        type: 'GET',
        dataType: 'json'
    }).done(function(d) {
        if (d != null) {
            console.log("Start load data " + ma_ddo);
            if (d.length > 0) {
                $.each(d, function(i, row) {
                    $('#tbl_tsvh_body').append(
                        '<tr>' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td><p class="text-warning">' + row.time + '</p><p class="text-success">' + row.timemeter + '</p><p class="text-danger"></p><p class="text-dark"></p></td>' +
                        '<td><p class="text-warning">' + row.tu + '</p><p class="text-success">' + row.ti + '</p><p class="text-danger">' + row.hsnhan + '</p><p class="text-dark">' + row.socongto + '</p></td>' +
                        '<td><p class="text-warning">A</p><p class="text-success">B</p><p class="text-danger">C</p><p class="text-dark">Tổng</p></td>' +
                        '<td><p class="text-warning">' + row.ua + '</p><p class="text-success">' + row.ub + '</p><p class="text-danger">' + row.uc + '</p><p class="text-dark"></p></td>' +
                        '<td><p class="text-warning">' + row.ia + '</p><p class="text-success">' + row.ia + '</p><p class="text-danger">' + row.ic + '</p><p class="text-dark"></p></td>' +
                        '<td><p class="text-warning">' + row.anglea + '</p><p class="text-success">' + row.angleb + '</p><p class="text-danger">' + row.anglec + '</p><p class="text-dark"></p></td>' +
                        '<td><p class="text-warning">' + row.cosa + '</p><p class="text-success">' + row.cosb + '</p><p class="text-danger">' + row.cosc + '</p><p class="text-dark"></p></td>' +
                        '<td><p class="text-warning">' + row.pa + '</p><p class="text-success">' + row.pb + '</p><p class="text-danger">' + row.pc + '</p><p class="text-dark">' + row.totalp + '</p></td>' +
                        '<td><p class="text-warning">' + row.qa + '</p><p class="text-success">' + row.qb + '</p><p class="text-danger">' + row.qc + '</p><p class="text-dark">' + row.totalq + '</p></td>' +
                        '<td><p class="text-warning">' + row.frega + '</p><p class="text-success">' + row.fregb + '</p><p class="text-danger">' + row.fregc + '</p><p class="text-dark">' + row.thutupha + '</p></td>' +
                        '</tr>');
                })
                table_tsvh = $('#table_tsvh').DataTable();
            } else {
                alert("Không có dữ liệu !");
            }
        } else {
            console.log("No data !");
        }
    }).fail(function(msg) {
        console.log("Load data failed !");
    });

    return false;
}

function updateNote(note) {

    if (ma_ddo == null || ma_ddo == "") return;

    var ma_khang = ma_ddo.substring(0, 13);

    if (!confirm("Bạn có chắc chắn thay đổi ghi chú mã: " + ma_khang + " không ?")) {
        return;
    }

    $.ajax({
        url: myurl + '/update_th_diem_do/' + ma_dviqly + '/' + ma_khang + '/NOTE/' + note,
        type: 'GET',
        dataType: 'json'
    }).done(function(d) {
        if (d) {
            alert("Update Success!");
            getTheodoi()
        } else {
            alert("Update fail !");
        }
    }).fail(function(msg) {
        alert("Update error !");
    });

    return false;
}

function loadChart() {
    var ctx = document.getElementById('myAreaChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line', //bar
        data: {
            labels: ['01/12', '02/12', '03/12', '04/12', '05/12', '06/12'],
            datasets: [{
                label: 'Q',
                data: [12, 13, 12, 15, 12, 18],
                // backgroundColor: [
                //     'rgba(255, 99, 132, 0.2)',
                //     'rgba(54, 162, 235, 0.2)',
                //     'rgba(255, 206, 86, 0.2)',
                //     'rgba(75, 192, 192, 0.2)',
                //     'rgba(153, 102, 255, 0.2)',
                //     'rgba(255, 159, 64, 0.2)'
                // ],
                borderColor: [
                    'rgba(25, 99, 132, 1)'
                ],
                borderWidth: 1,
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

$.date = function(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;

    return date;
};