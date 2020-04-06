var ma_dviqly;
var loai_hdon;
var table;
// var myurl = 'http://localhost:45860/api';
var myurl = 'http://cskh.pcdongnai.vn/BH2API/api';

$(document).ready(function() {
    if (typeof(Storage) !== "undefined") {
        ma_dviqly = localStorage.getItem("ma_dviqly");
        $('#cbo_dviqly option[value=' + ma_dviqly + ']').attr('selected', 'selected');
    } else {
        console.log("Sorry! No Web Storage support..");
    }

    $("#month-input").datetimepicker({
        format: 'YYYY-MM',
    });

    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    $("#month-input").val(year + '-' + month);

    console.log(ma_dviqly);
});

function loadData() {

    ma_dviqly = $('#cbo_dviqly').children("option:selected").val();
    localStorage.setItem("ma_dviqly", ma_dviqly);

    var td = '';
    var vc = '';
    if ($('#chk_loai_hdon_td').is(":checked")) td = $('#chk_loai_hdon_td').val();
    if ($('#chk_loai_hdon_vc').is(":checked")) vc = $('#chk_loai_hdon_vc').val();

    if (td != '' && vc != '') {
        loai_hdon = 'ALL';
    } else if (td == '' && vc == '') {
        alert("loai_hdon is empty");
        return;
    } else {
        loai_hdon = td + vc;
    };

    var thang = $("#month-input").val().split('-');

    console.log(ma_dviqly + ' ' + loai_hdon + ' ' + thang[0] + '-' + thang[1]);

    // return;

    if (ma_dviqly == '' || ma_dviqly == null) return;

    // var myurl = 'http://localhost:45860/api/hdn/' + ma_dviqly + '/VC/2019/11/1/all';
    // var myurl = 'http://localhost:45860/api/hdn/' + ma_dviqly + '/' + loai_hdon + '/' + thang[0] + '/' + thang[1] + '/1/all';
    // var myurl = 'http://cskh.pcdongnai.vn/BH2API/api/hdn/' + ma_dviqly + '/' + loai_hdon + '/' + thang[0] + '/' + thang[1] + '/1/all';

    if (table != null) {
        table.destroy();
        $('#tbl_body tr').remove();
    } else {
        console.log("table is NULL");
    }

    document.getElementById('spinner').setAttribute('hidden', false);

    $.ajax({
        url: myurl + '/hdn/' + ma_dviqly + '/' + loai_hdon + '/' + thang[0] + '/' + thang[1] + '/1/all',
        type: 'GET',
        dataType: 'json'
    }).done(function(d) {
        if (d != null) {
            console.log("OK");
            if (d.length > 0) {
                $.each(d, function(i, row) {
                    $('#tbl_body').append(
                        '<tr>' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + row.ma_khang + '</td>' +
                        '<td>' + row.ten_khang + '</td>' +
                        '<td>' + row.dthoai + '</td>' +
                        '<td>' + row.ma_kvuc + '.' + row.stt + '</td>' +
                        '<td>' + row.nam + '-' + row.thang + '</td>' +
                        '<td>' + row.ky + '</td>' +
                        '<td>' + moment(row.ngay_cky).format("DD/MM/YYYY") + '</td>' +
                        // '<td>' + $.format.Date(row.ngay_cky, 'dd/MM/yyyy') + '</td>' +
                        '<td>' + row.loai_hdon + '</td>' +
                        '<td>' + row.dien_tthu + '</td>' +
                        '<td>' + row.cosfi + '</td>' +
                        '<td>' + row.kcosfi + '</td>' +
                        '<td>' + row.so_tien + '</td>' +
                        '<td>' + row.tien_gtgt + '</td>' +
                        '<td>' + row.tong_tien + '</td>' +
                        '<td class="float-left">' +
                        ' <button class = "btn btn-outline-warning btn-sm btn-circle" onclick="updateNote(\'' + row.ma_khang + '\')"><i class = "fa fa-heart"></i></button >' +
                        '</td>' +
                        '</tr>');
                    // }

                })
                table = $('#table_hdn').DataTable();
            }
        } else {
            console.log("No data !");
        }
    }).fail(function(msg) {
        console.log("Load data failed !");
    });

    document.getElementById('spinner').setAttribute('hidden', true);

    return false;

}

function updateNote(ma_khang) {

    if (ma_khang == null || ma_khang == "") {
        console.log('ma_khang is empty');
        return;
    }

    $.ajax({
        url: myurl + '/update_th_diem_do/' + ma_dviqly + '/' + ma_khang + '/NOTE/T',
        type: 'GET',
        dataType: 'json'
    }).done(function(d) {
        if (d) {
            alert("Update Success!");
        } else {
            alert("Update fail !");
        }
    }).fail(function(msg) {
        alert("Update error !");
    });

    return false;
}