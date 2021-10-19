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
const render = document.getElementById('dataProduct');
const totalItem = document.getElementById('totalItem');
const totalPrice = document.getElementById('totalPrice');
const enternvoucher = document.getElementById('enternvoucher');
// const phuongthuc = document.getElementById('phuongthuc');
let priceTotalVoucher = 0;
let priceTotal;
let totalItem_FB = 0;

var GHNapi =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create';

function createOrder(
    data,
    totalItem_FB,
    tennguoinhan,
    priceTotalVoucher,
    diachi,
    nhieusanpham,
    sdt,
    _madonhang
) {
    var option = {
        method: 'POST',
        headers: {
            Token: '3104c425-0fcf-11ec-b5ad-92f02d942f87',
            'Content-Type': 'application/json',
            ShopId: '82647',
        },
        body: JSON.stringify(data),
    };

    fetch(GHNapi, option)
        .then(function (response) {
            return response.json();
        })
        .then(data => {
            console.log(data);
            firebase
                .database()
                .ref('checkoutDone/' + userFB.uid + '/' + _madonhang)
                .update({
                    tonghang: totalItem_FB,
                    tonggia: String(priceTotalVoucher),
                    phuongthucthanhtoan: 'trả sau',
                    madonhangGHN: data.data.order_code,
                    madonhang: _madonhang,
                    tennguoinhan: tennguoinhan,
                    diachi: diachi,
                    sanpham: nhieusanpham,
                    sdt: sdt,
                    uid: userFB.uid,
                });
        })
        .then(data => {
            alert('Tạo đơn hàng thành công');
            location.replace('index.html');
        });
}

GHN = (
    totalItem_FB,
    tennguoinhan,
    priceTotalVoucher,
    diachi,
    nhieusanpham,
    sdt,
    _madonhang
) => {
    sanpham = Object.values(nhieusanpham); // [ {}, {}]
    let items = [];

    for (var i = 0; i < sanpham.length; i++) {
        sanpham[i].name = sanpham[i].ten;
        sanpham[i].code = 'Polo123';
        sanpham[i].quantity = Number(sanpham[i].soluong);
        sanpham[i].price = Number(sanpham[i].gia);
        sanpham[i].length = 12;
        sanpham[i].width = 12;
        sanpham[i].height = 12;
        sanpham[i].category = {
            level1: 'Điện thoại',
        };
    }
    var jsonOrder = {
        payment_type_id: 2,
        note: 'Tintest 123',
        required_note: 'KHONGCHOXEMHANG',
        return_phone: '0332190444',
        return_address: '39 NTT',
        return_district_id: null,
        return_ward_code: '',
        client_order_code: _madonhang,
        to_name: tennguoinhan,
        to_phone: sdt,
        to_address: diachi,
        to_ward_code: '20308',
        to_district_id: null,
        // Quận 3
        cod_amount: 0,
        content: 'Theo New York Times',
        weight: 200,
        length: 1,
        width: 19,
        height: 10,
        pick_station_id: 0,
        deliver_station_id: null,
        insurance_value: Number(priceTotalVoucher),
        service_id: 0,
        service_type_id: 2,
        order_value: Number(priceTotalVoucher),
        coupon: null,
        pick_shift: [2],
        items: sanpham,
    };
    createOrder(
        jsonOrder,
        totalItem_FB,
        tennguoinhan,
        priceTotalVoucher,
        diachi,
        nhieusanpham,
        sdt,
        _madonhang
    );
};
renderProduct = datarender => {
    totalItem.innerHTML = 'Tổng cộng mặt hàng trong giỏ: ' + datarender.length;
    totalItem_FB = datarender.length;
    priceTotal = 0;
    for (var i = 0; i < datarender.length; i++) {
        priceTotal += datarender[i].gia * 1 * (datarender[i].soluong * 1);
        const html = `<tr>
                            <td
                                style="text-align: center"
                                style="text-align: center"
                            >
                                <img
                                    src="${datarender[i].anh}"
                                    style="
                                        width: 50px;
                                        height: 50px;
                                        border: groove #000;
                                    "
                                    id="${`img` + i}"
                                />
                            </td>
                            <td style="text-align: center" class="${
                                `ten ten` + i
                            }">
                            ${datarender[i].ten}
                            </td>
                            <td style="text-align: center" id="${`gia` + i}">
                                ${datarender[i].gia}
                            </td>
                            <td style="text-align: center" class="${
                                `soluong soluong` + i
                            }"">                  
                                    ${datarender[i].soluong}

                            </td>
                        </tr>`;
        render.insertAdjacentHTML('afterend', html);
    }
};
const renderData = async () => {
    try {
        await firebase.auth().onAuthStateChanged(user => {
            if (!user) {
            } else {
                userFB = user;
                if (userFB) {
                    const renderItem = firebase
                        .database()
                        .ref('datsanpham/' + userFB.uid)
                        .once('value', snapshot => {
                            if (snapshot.exists()) {
                                data = Object.values(snapshot.val());
                                renderProduct(data);
                            } else {
                                document.getElementById(
                                    'checkouttrasau'
                                ).style.display = 'none';
                                document.getElementById(
                                    'paypal-button-container'
                                ).style.display = 'none';
                                totalPrice.innerHTML = 'Tổng cộng giá đã đặt:';
                                alert('Không có sản phẩm nào đã đặt');
                            }
                        });
                }
            }
        });
    } catch (err) {
        alert(err);
    }
};

renderTotal = async () => {
    try {
        await firebase.auth().onAuthStateChanged(user => {
            if (!user) {
            } else {
                userFB = user;
                if (userFB) {
                    const renderItem = firebase
                        .database()
                        .ref('checkout/' + userFB.uid)
                        .once('value', snapshot => {
                            if (snapshot.exists()) {
                                priceTotalVoucher = snapshot.val().tonggia * 1;
                                if (priceTotal == priceTotalVoucher)
                                    totalPrice.innerHTML =
                                        'Tổng cộng giá đã đặt: ' +
                                        priceTotalVoucher +
                                        ' VND';
                                else
                                    totalPrice.innerHTML =
                                        'Tổng cộng giá đã đặt: ' +
                                        priceTotalVoucher +
                                        ' VND (Đã áp dụng voucher)';
                            } else {
                                totalPrice.innerHTML = 'Tổng cộng giá đã đặt:';
                                alert('Không có sản phẩm nào đã đặt');
                            }
                        });
                }
            }
        });
    } catch (err) {
        alert(err);
    }
};
renderData();
renderTotal();
checkouttrasau = async () => {
    const tennguoinhan = document.getElementById('tennguoinhan').value;
    const diachi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    let nhieusanpham;
    if (sdt.length != 10) {
        alert('số điện thoại không hợp lệ !!');
        return;
    }
    if (tennguoinhan != '' && diachi != '') {
        const laysanpham = await firebase
            .database()
            .ref('datsanpham/' + userFB.uid)
            .once('value', data => {
                nhieusanpham = data.val();
            });
        if (laysanpham) {
            await firebase
                .database()
                .ref('datsanpham/' + userFB.uid)
                .remove();
            let _madonhang = 'ORDER' + Math.floor(Math.random() * 1000000 + 1);
            await firebase
                .database()
                .ref('checkoutDone/' + userFB.uid + '/' + _madonhang)
                .set({
                    tonghang: totalItem_FB,
                    tonggia: String(priceTotalVoucher),
                    phuongthucthanhtoan: 'trả sau',
                    madonhang: _madonhang,
                    tennguoinhan: tennguoinhan,
                    diachi: diachi,
                    sanpham: nhieusanpham,
                    sdt: sdt,
                    uid: userFB.uid,
                })
                .then(data => {
                    GHN(
                        totalItem_FB,
                        tennguoinhan,
                        priceTotalVoucher,
                        diachi,
                        nhieusanpham,
                        sdt,
                        _madonhang
                    );
                });
        }
    } else alert('Vui lòng nhập thông tin');
};
update_ = async (nhieusanpham, details, madonhang) => {
    console.log(nhieusanpham);
    const check = await firebase
        .database()
        .ref('datsanpham/' + userFB.uid)
        .remove();

    const updatepaypal = await firebase
        .database()
        .ref('checkoutDone/' + userFB.uid + '/' + madonhang)
        .set({
            tonggia: String(priceTotalVoucher),
            phuongthucthanhtoan: 'paypal',
            madonhang: madonhang,
            tennguoinhan: details.purchase_units[0].shipping.name.full_name,
            diachi:
                details.purchase_units[0].shipping.address.address_line_1 +
                ', ' +
                details.purchase_units[0].shipping.address.admin_area_2,
            sanpham: nhieusanpham,
            uid: userFB.uid,
        })
        .then(() => {
            alert('Thanh toán PAYPAL thành công, mã đơn hàng: ' + madonhang);
            location.replace('index.html');
        });
};
paypal
    .Buttons({
        createOrder: function (data, actions) {
            try {
                return actions.order.create({
                    intent: 'CAPTURE',
                    payer: {
                        name: {
                            given_name: 'nguoitratien',
                            surname: '',
                        },
                        address: {
                            address_line_1:
                                'Số 13, đường số 11, Linh Chiểu, Thủ Đức',
                            address_line_2: '',
                            admin_area_2: '',
                            admin_area_1: '',
                            postal_code: '3333',
                            country_code: 'VN',
                        },
                        email: `${userFB.email}`,
                        phone: {
                            phone_type: 'MOBILE',
                            phone_number: {
                                national_number: '0912398123',
                            },
                        },
                    },
                    purchase_units: [
                        {
                            amount: {
                                value: `${(priceTotalVoucher / 23000).toFixed(
                                    2
                                )}`,
                                currency_code: 'USD',
                            },
                        },
                    ],
                });
            } catch (error) {
                alert(error);
            }
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                madonhang = details.id;
                status = details.status;
                let nhieusanpham;
                const laysanpham = firebase
                    .database()
                    .ref('datsanpham/' + userFB.uid)
                    .once('value', data => {
                        nhieusanpham = data.val();
                        update_(nhieusanpham, details, madonhang);
                    });
            });
        },
    })
    .render('#paypal-button-container');
