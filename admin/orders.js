'use-strict';
logout = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            location.replace('../index.html');
        });
};
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        if (user.email != 'admin@gmail.com')
            location.replace('../dangnhap.html');
        // else location.replace('index.html');
    } else {
        location.replace('../dangnhap.html');
    }
});

renderOrderss = async data => {
    const dataProduct = document.getElementById('dataProduct');
    data = Object.values(data);
    let dataReal = [];
    for (var i = 0; i < data.length; i++)
        dataReal = dataReal.concat(Object.values(data[i]));
    let dataFake = [];
    for (var i = 0; i < dataReal.length; i++) {
        let name;

        await firebase
            .database()
            .ref('users/' + dataReal[i].uid)
            .once('value', data => {
                name = data.val().ten;
            });
        const html = `<tr>      
                                <td style="text-align: center">${name}</td>
                                <td
                                    style="text-align: center"
                                   
                                >
                                    ${dataReal[i].madonhang}
                                </td>
                                <td style="text-align: center">
                                     ${dataReal[i].tonggia} VND
                                </td>
                                <td style="text-align: center" id="paypal">
                                     ${dataReal[i].phuongthucthanhtoan}
                                </td>
                                <td style="text-align: center">
                                    ${dataReal[i].tennguoinhan}
                                </td>
                                <td style="text-align: center">
                                    ${dataReal[i].diachi}
                                </td>
                                <td style="text-align: center">
                                    ${dataReal[i].sdt}
                                </td> 
                               
                                <td style="text-align: center">
                                    <button class="btn btn-danger" onclick="huydon('${dataReal[i].madonhang}', '${dataReal[i].uid}')"> Hủy đơn </button>
                                </td> 
                                </tr>`;
        dataProduct.insertAdjacentHTML('afterend', html);
    }
};
renderDataOrder = async () => {
    const order = await firebase
        .database()
        .ref('checkoutDone/')
        .once('value', data => {
            if (data.exists()) {
                renderOrderss(Object.values(data.val()));
            } else {
                alert('Không có đơn hàng nào của khách hàng !!');
            }
        });
    if (!order) {
        alert('Không có đơn hàng nào của khách hàng !!');
    }
};

renderDataOrder();

var GHNapi =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel';

function createOrder(data, madon, uid) {
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
            alert('Hủy đơn hàng thành công');
            location.replace('orders.html');
        })
        .then(data => {
            firebase
                .database()
                .ref('checkoutDone/' + uid + '/' + madon)
                .remove();
        });
}

huydon = (madon, uid) => {
    if (document.getElementById('paypal').value != 'paypal') {
        var jsonOrder = {
            order_codes: [madon],
        };
        createOrder(jsonOrder, madon, uid);
    } else {
        firebase
            .database()
            .ref('checkoutDone/' + uid)
            .remove();
    }
};
