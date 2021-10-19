function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        ' '
    );
    return str.toLowerCase().replace(/ /g, '');
}
let userFB;
renderData = async () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const user_ = await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userFB = user;
            const render = firebase
                .database()
                .ref('users/' + userFB.uid)
                .once('value', data => {
                    name.innerHTML = data.val().ten;
                    email.innerHTML = data.val().email;
                });
        } else {
            location.replace('dangnhap.html');
        }
    });
    if (user_) {
    }
};

renderData();

const render = document.getElementById('render');

renderOrderss = data => {
    const dataProduct = document.getElementById('dataProduct');
    for (var i = 0; i < data.length; i++) {
        const html = `<tr>
                                <td
                                    style="text-align: center"
                                   
                                >
                                    ${data[i].madonhang}
                                </td>
                                <td style="text-align: center">
                                     ${data[i].tonggia} VND
                                </td>
                                <td style="text-align: center" id="paypal">
                                     ${data[i].phuongthucthanhtoan}
                                </td>
                                <td style="text-align: center">
                                    ${data[i].tennguoinhan}
                                </td>
                                <td style="text-align: center">
                                    ${data[i].diachi}
                                </td>
                                <td style="text-align: center">
                                    ${data[i].sdt}
                                </td> 
                                <td style="text-align: center">
                                    <button class="btn btn-danger" onclick="huydon('${data[i].madonhangGHN}', '${data[i].uid}', '${data[i].madonhang}')"> Hủy đơn </button>
                                </td> 
                                </tr>`;
        dataProduct.insertAdjacentHTML('afterend', html);
    }
};
renderDataOrder = () => {
    firebase
        .database()
        .ref('checkoutDone/' + userFB.uid)
        .once('value', data => {
            if (data.exists()) {
                console.log(Object.values(data.val()));
                renderOrderss(Object.values(data.val()));
            } else {
                alert('Bạn chưa có đơn hàng nào !!');
            }
        });
};
renderOrder = () => {
    const child = document.getElementById('child');
    if (child) render.removeChild(child);
    const html = `<div class="row" id="child">
        <div class="col-sm-12">
            <div class="table-responsive">
                    <div style="overflow-x: scroll">
                        <table
                            class="table table-hover table-striped"
                            style="font-size: 18px"
                        >
                            <tr id="dataProduct">
                                <th style="text-align: center; width: 10%">
                                    Mã đặt hàng
                                </th>
                                <th style="text-align: center; width: 10%">
                                    Tổng giá
                                </th>
                                <th style="text-align: center; width: 10%">
                                    Phương thức
                                </th>
                                 <th style="text-align: center; width: 10%">
                                    Tên người nhận
                                </th>
                                <th style="text-align: center; width: 10%">
                                    Địa chỉ
                                </th>
                                 <th style="text-align: center; width: 10%">
                                    SĐT
                                </th>
                                <th style="text-align: center; width: 10%"></th>
                            </tr>
                     
                        </table>
                    </div>
        </div>
    </div> `;
    render.insertAdjacentHTML('afterbegin', html);

    renderDataOrder();
};
var GHNapi =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel';

function cancerOrder(data, uid, madon) {
    var option = {
        method: 'POST',
        headers: {
            Token: '3104c425-0fcf-11ec-b5ad-92f02d942f87',
            'Content-Type': 'application/json',
            ShopId: '82647',
        },
        body: JSON.stringify(data),
    };

    fetch(GHNapi, option).then(function (response) {
        const check = firebase
            .database()
            .ref('checkoutDone/' + uid + '/' + madon)
            .remove();
        if (check) {
            alert('Hủy đơn hàng thành công');
            location.replace('taikhoan.html');
        }
    });
}

huydon = (madonghn, uid, madon) => {
    if (document.getElementById('paypal').value != 'paypal') {
        var jsonOrder = {
            order_codes: [madonghn],
        };
        cancerOrder(jsonOrder, uid, madon);
    } else {
        firebase
            .database()
            .ref('checkoutDone/' + uid)
            .remove();
    }
};

thaymatkhau = () => {
    firebase
        .auth()
        .sendPasswordResetEmail(userFB.email)
        .then(() => {
            alert('Vui lòng vào email để đổi mật khẩu !!');
        });
};
