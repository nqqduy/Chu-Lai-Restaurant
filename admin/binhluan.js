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
    } else {
        location.replace('../dangnhap.html');
    }
});
const render = document.getElementById('dataProduct');
renderbinhluan = async () => {
    await firebase
        .database()
        .ref('binhluan/')
        .once('value', data => {
            let dataCMT = Object.values(data.val());
            for (var i = 0; i < dataCMT.length; i++) {
                const html = `<tr>
                            <td style="text-align: center" class="${`ten ten`}">
                            ${dataCMT[i].ten}
                            </td>
                              <td style="text-align: center">
                                
                                ${dataCMT[i].noidung}
                            </td>
                            <td style="text-align: center">
                                <button class="btn btn-danger"
                                onclick="delete_('${
                                    dataCMT[i].uid
                                }')">Xóa</button>
                            </td>
                        </tr>`;
                render.insertAdjacentHTML('afterend', html);
            }
        });
};

renderbinhluan();

delete_ = uid => {
    firebase
        .database()
        .ref('binhluan/' + uid)
        .remove()
        .then(data => {
            alert('xóa thành công');
            location.replace('binhluan.html');
        });
};
