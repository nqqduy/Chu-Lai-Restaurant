'use-strict';
let userFB;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const taikhoan = document.getElementById('taikhoan');

        userFB = user;
        taikhoan.innerHTML = 'Tài khoản';
    }
});
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
renderdetail = data1 => {
    const render = document.getElementsByClassName('render');
    const html = `<div class="row mt-3 ">
                <div class="col-lg-6 col-md-6">
                    <img src="${data1.val().anh}" alt="" class="anhchitiet" />
                </div>
                <div class="col-lg-6 col-md-6">
                    <h2>${data1.val().ten}</h2>
                    <br />
                    <p style="font-size:20px">Số lượng: ${
                        data1.val().soluong
                    }</p>
                    <br />
                    <p style="font-size:20px">Mô tả: ${data1.val().mota}</p>
                    <br />
                      <p style="font-size:20px">Giá: ${data1.val().gia}</p>
                    <br />
                    <button
                        type="button"
                        style="width: 30%"
                        class="btn btn-danger"
                        onclick="addCart('${data1.val().ten}', '${
        data1.val().gia
    }','${data1.val().anh}')"
                    >
                        <i class="fa fa-shopping-cart"> Thêm vào giỏ </i>
                    </button>
                </div>
            </div>`;
    console.log(render[0]);
    render[0].insertAdjacentHTML('afterend', html);
};
renderItem = async () => {
    let path = window.location.href;
    path = path.split('?');
    let data = path[1].split('-'); // loai - nhan - ten
    await firebase
        .database()
        .ref('sanpham/' + data[0] + '/' + data[1] + '/' + data[2])
        .once('value', data1 => {
            renderdetail(data1);
        });
    console.log(data);
};
renderItem();

let soluong = 0;
getSoluong = async (ten, user) => {
    try {
        const renderItem = await firebase
            .database()
            .ref('datsanpham/' + user.uid + '/' + removeVietnameseTones(ten))
            .once('value', snapshot => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    soluong = snapshot.val().soluong;
                } else {
                    soluong = 0;
                }
            });
    } catch (err) {
        alert(err);
    }
};
addCart = async (ten, gia, anh) => {
    try {
        if (userFB) {
            await getSoluong(ten, userFB);
            const addItemCart = await firebase
                .database()
                .ref(
                    'datsanpham/' +
                        userFB.uid +
                        '/' +
                        removeVietnameseTones(ten)
                )
                .set({
                    ten: ten,
                    gia: gia,
                    soluong: ++soluong,
                    anh: anh,
                })
                .then(data => {
                    alert(ten + ' thêm vào giỏ hàng thành công');
                });
        } else {
            alert('Vui lòng đăng nhập');
            location.replace('dangnhap.html');
        }
    } catch (error) {
        alert(error);
    }
};
