const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const shopList = $$('.shop-list');
const navVn = $('#nav-vn');
const navEn = $('#nav-en');
const containerVnBody = $('.container-none-vn');
const containerEnBody = $('.container-none-en');

const activeLinkHome = $('.link-home')
const activeLinkCafe = $('.link-cafe')
const activeLinkTea = $('.link-tea')

const sliderElement = $('#slider');
const cafePage_link = $$('.to-cafe-page');
const teaPage_link = $$('.to-tea-page');
const cafePage = $('.cafe-page');
const teaPage = $('.tea-page');

const productList_1 = $('.cafe-mui-list');
const productList_2 = $('.cafe-phin-nhom-list');
const productList_3 = $('.tra-olong-list');
const productList_4 = $('.tra-lon-thiec-list');
const productList_5 = $('.tra-lon-giay-list');

const cafeInfoPage = $('.cafe-info');
const teaInfoPage = $('.tea-info');
const productRelate = $('.product-relate');
const productLoad = $('.load-here');
const quatityTotal = $('.quatity-total');
const listBuy = $('.list-buy');
const totalPay = $('.total-pay');

const selectCity = $('.select-local');
const selectDistrict = $('.select-district');

// API
const listCartApi = 'http://localhost:3000/listCart';
const listStoreApi = 'http://localhost:3000/listStore';
const listProductApi = 'http://localhost:3000/listProduct';

const app = {
    currentIndexProduct: 0,
    currentQuatity: 1,
    currentTotal: 0,
    totalCoin: 0,
    languageEn: false,
    productItems: [],
    indexList: [],

    getListStore: function (callback) {
        fetch(listStoreApi)
            .then(function (response) {
                return response.json();
            })
            .then(callback);
    },

    getListProduct: function (callback) {
        fetch(listProductApi)
            .then(function (response) {
                return response.json();
            })
            .then(callback);
    },

    getListCart: function (callback) {
        fetch(listCartApi)
            .then(function (response) {
                return response.json();
            })
            .then(callback);
    },

    updateListCart: function (data, callback) {
        var options = {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(listCartApi, options)
            .then(function (response) {
                return response.json();
            })
            .then(callback)
            .then(function () {
                app.renderListCart();
            })
    },

    renderStore: function (stores) {
        const htmls = stores.map((store, index) => {
            return `
                <div class="address row" data-index="${index}">
                    <span class="col-lg-1 col-sm-2 material-icons-outlined font-28">storefront</span>
                    <p class="col-lg-7 col-sm-10 font-16">
                        ${store.name} - ${store.address} <br>
                        Điện thoại: ${store.phone}
                    </p>
                    <button href="${store.url}" class="col-lg-4 col-sm-12 address-btn font-14">Chỉ đường</button>
                </div>
            `
        })
        shopList[0].innerHTML = htmls.join('')
        shopList[1].innerHTML = htmls.join('')
    },

    random: function (currentId) {
        while (this.indexList.length < 4) {
            const indexRandom = Math.floor(Math.random() * 18)
            if (currentId <= 11) {
                if (!this.indexList.includes(indexRandom) && indexRandom != currentId && indexRandom <= 11) {
                    this.indexList.push(indexRandom)
                } else {
                    this.indexList;
                }
            } else {
                if (!this.indexList.includes(indexRandom) && indexRandom != currentId && indexRandom > 11) {
                    this.indexList.push(indexRandom)
                } else {
                    this.indexList;
                }
            }
        }
    },

    loadCurrentLanguage: function () {
        if (this.languageEn) {
            navEn.classList.add('is-active')
            containerEnBody.classList.add('is-active')
            navVn.classList.remove('is-active')
            containerVnBody.classList.remove('is-active')
        } else {
            this.languageEn = false;
            navVn.classList.add('is-active')
            containerVnBody.classList.add('is-active')
            navEn.classList.remove('is-active')
            containerEnBody.classList.remove('is-active')
        }
    },

    reloadDOMEvent: function (currentId) {
        // hiểu thị sp liên quan
        this.indexList = [];
        this.currentQuatity = 1;
        this.random(currentId);
        this.loadCurrentProduct(currentId);
    },

    reduceQuantity: function (currentId) {
        this.currentQuatity = this.currentQuatity > 0 ? this.currentQuatity - 1 : 0;
        this.loadCurrentProduct(currentId)
    },

    raiseQuantity: function (currentId) {
        this.currentQuatity += 1;
        this.loadCurrentProduct(currentId)
    },

    removeProduct: function (indexRemove) {
        var options = {
            method: 'DELETE'
        }
        fetch(listCartApi + '/' + indexRemove, options)
            .then(function (response) {
                return response.json();
            })
            .then(function () {
                app.renderListCart();
            })
    },

    addProductToList: function (productId, quantity, price) {
        var data = {
            productId: productId,
            quantity: quantity,
            price: price
        }
        this.updateListCart(data)
    },

    renderListCart: function () {
        app.getListProduct(function(products) {
            app.getListCart(function (listCart) {
                const _this = this;
                this.totalCoin = 0;
                this.currentTotal = 0;
    
                const html_listCart = listCart.map(function (product) {
                    _this.totalCoin += (product.quantity * product.price);
                    _this.currentTotal += product.quantity;
    
                    return `
                        <div class="row border-top border-bottom">
                            <img class="cart-img" src="${products[product.productId].img}">
                            <div class="cart-info">
                                <h4 class="title">Cà phê ${products[product.productId].name}</h4>
                                <p>${product.quantity}x ${product.price}.000đ</p>
                            </div>
                            <button onclick="app.removeProduct(${product.id})" class="material-icons-outlined cart-remove">close</button>
                        </div>
                    `
                })
                listBuy.innerHTML = html_listCart.join('');
    
                totalPay.innerText = `${_this.totalCoin}.000 đ`
                quatityTotal.innerText = `${_this.currentTotal}`
            })
        })
    },

    getDateTime: function () {
        var now = new Date();
        var hour = now.getHours();

        if (hour.toString().length == 1) {
            hour = '0' + hour;
        }
        var currentTime = hour
        return currentTime;
    },

    renderProduct: function (products) {
        const htmls_1 = products.map((product) => {
            if (product.type == 'list_1') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">Cà Phê ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 đ</p>
                </div>`
            }
        })
        productList_1.innerHTML = htmls_1.join('');

        const htmls_2 = products.map((product) => {
            if (product.type == 'list_2') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">Cà Phê ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 đ</p>
                </div>`
            }
        })
        productList_2.innerHTML = htmls_2.join('');

        const htmls_3 = products.map((product) => {
            if (product.type == 'list_3') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">Cà Phê ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 đ</p>
                </div>`
            }
        })
        productList_3.innerHTML = htmls_3.join('');

        const htmls_4 = products.map((product) => {
            if (product.type == 'list_4') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">Cà Phê ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 đ</p>
                </div>`
            }
        })
        productList_4.innerHTML = htmls_4.join('');

        const htmls_5 = products.map((product) => {
            if (product.type == 'list_5') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">Cà Phê ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 đ</p>
                </div>`
            }
        })
        productList_5.innerHTML = htmls_5.join('');
    },

    handleEvents: function () {
        const _this = this;

        // Xử lý khi bấm vào login
        const formLogin = $('#form-login');
        const loginBtn = $$('.login-btn');
        const navBody = $('.nav-body');
        loginBtn[0].onclick = function () {
            containerVnBody.classList.remove('is-active');
            sliderElement.style.display = 'none';
            formLogin.style.display = 'flex';
        }
        loginBtn[1].onclick = function () {
            containerVnBody.classList.remove('is-active');
            sliderElement.style.display = 'none';
            formLogin.style.display = 'flex';
            navBody.style.display = 'none'
        }
        loginBtn[2].onclick = function () {
            containerEnBody.classList.remove('is-active');
            sliderElement.style.display = 'none';
            formLogin.style.display = 'flex';
        }

        // Xử lí khi bấm vào nav-toggle
        const navToggleBtn = $('.nav-toggle .more');
        const closeBtn = $('.nav-toggle .close')
       
        navToggleBtn.onclick = function() {
            closeBtn.style.display = 'flex'
            navBody.style.display = 'block'
            navToggleBtn.style.display = 'none'
        }
        closeBtn.onclick = function() {
            closeBtn.style.display = 'none  '
            navBody.style.display = 'none'
            navToggleBtn.style.display = 'block'
        }
        // Xử lý khi bấm vào EN/VN
        const vnBtn = $$('.lang-vn')
        const enBtn = $$('.lang-en')

        enBtn[0].onclick = function () {
            enBtn[1].classList.add('active');
            vnBtn[1].classList.remove('active');
            _this.languageEn = true;
            _this.loadCurrentLanguage();
            _this.render();
        }
        vnBtn[1].onclick = function () {
            vnBtn[0].classList.add('active');
            enBtn[0].classList.remove('active');
            _this.languageEn = false;
            _this.loadCurrentLanguage()
            _this.render();
        }

        // Xử lý khi hover vào cart
        const cartVnBtn = $('.btn-vn');
        const cartEnBtn = $('.btn-en');
        const boxCartVn = $('.cart-vn')
        const boxCartEn = $('.cart-en')


        cartVnBtn.onclick = function () {
            if (boxCartVn.getAttribute('class') == 'box-cart cart-vn' ) {
                boxCartVn.classList.add('is-active')
            } else {
                boxCartVn.classList.remove('is-active')
            }
        }
        boxCartVn.onmouseleave = function () {
            boxCartVn.style.display = 'none';
        }
        cartEnBtn.onclick = function () {
            boxCartEn.style.display = 'block';
        }
        boxCartEn.onmouseleave = function () {
            boxCartEn.style.display = 'none';
        }

        // Xử lý khi hover/click vào mục Sản phẩm
        const productBtn = $('.product');
        const productBox = $('.product-box');
        const arrowDown = $('.arrow-down');
        const arrowUp = $('.arrow-up');

        productBtn.onclick = function () {
            if (productBox.style.display == 'none') {
                productBox.style.display = 'flex';
                arrowDown.style.display = 'none'
                arrowUp.style.display = 'block'
            } else {
                productBox.style.display = 'none';
                arrowDown.style.display = 'block'
                arrowUp.style.display = 'none'
            }
        }
        productBtn.onmouseover = function () {
            productBox.style.display = 'flex';
        }
        productBox.onmouseleave = function () {
            productBox.style.display = 'none';
        }

        // Xử lý khi click vào mục Sản phẩm CF
        const cartBottom = $('.nav-header-right');

        for(i = 0; i < cafePage_link.length; i++) {
            cafePage_link[i].addEventListener('click', function(){
                activeLinkTea.classList.remove('nav-active')
                activeLinkHome.classList.remove('nav-active')
                activeLinkCafe.classList.add('nav-active')

                containerVnBody.classList.remove('is-active');
                sliderElement.style.display = 'none';
                productBox.style.display = 'none';
                teaPage.style.display = 'none';
                cafeInfoPage.style.display = 'none'
                teaInfoPage.style.display = 'none'
                productRelate.style.display = 'none'
                cafePage.style.display = 'block';
                cartBottom.style.display = 'flex';
                navBody.style.display = 'none'
                closeBtn.style.display = 'none  '
                navToggleBtn.style.display = 'block'

                _this.getListProduct(_this.renderProduct)
            });
        }

        // Xử lý khi click vào mục Sản phẩm Tea
        for(j = 0; j < teaPage_link.length; j++) {
            teaPage_link[j].addEventListener('click', function(){
                activeLinkTea.classList.add('nav-active')
                activeLinkHome.classList.remove('nav-active')
                activeLinkCafe.classList.remove('nav-active')

                containerVnBody.classList.remove('is-active');
                sliderElement.style.display = 'none';
                productBox.style.display = 'none';
                cafePage.style.display = 'none';
                cafeInfoPage.style.display = 'none'
                teaInfoPage.style.display = 'none'
                productRelate.style.display = 'none'
                teaPage.style.display = 'block';
                cartBottom.style.display = 'flex';
                navBody.style.display = 'none'
                closeBtn.style.display = 'none  '
                navToggleBtn.style.display = 'block'

                _this.getListProduct(_this.renderProduct)
            });
        }

        // Hiện thông báo khi ngoài giờ làm việc
        const notifyPage = $('.notify-time');
        const okBtn = $('.btn-ok');

        var time = _this.getDateTime();
        if (time < 8 || time >= 18) {
            notifyPage.style.display = 'block';
        } else {
            notifyPage.style.display = 'none';
        }
        okBtn.onclick = function () {
            notifyPage.style.display = 'none';
        }

        // Lọc store
        selectCity.onchange = function() {
            let idCity = selectCity.options[selectCity.selectedIndex].value;
            let localStores = 'all';
            if (idCity == 1) {
                localStores = 'hcm'
            } else if (idCity == 2) {
                localStores = 'ct'
            }
            let newStores = [];
            _this.getListStore(function(stores) {
                stores.forEach(function(store) {
                    if (store.local == localStores) {
                        newStores.push(store);
                    } else if (localStores == 'all') {
                        newStores.push(store);
                    }
                })
                app.renderStore(newStores)
            })
        }
        selectDistrict.onchange = function() {
            let idDistrict = selectDistrict.options[selectDistrict.selectedIndex].value;
            let localStores = 'all';
            if (idDistrict == 1) {
                localStores = 'q1'
            } else if (idDistrict == 2) {
                localStores = 'q2'
            } else if (idDistrict == 3) {
                localStores = 'q3'
            } else if (idDistrict == 4) {
                localStores = 'qnk'
            }
            let newStores = [];
            _this.getListStore(function(stores) {
                stores.forEach(function(store) {
                    if (store.district == localStores) {
                        newStores.push(store);
                    } else if (localStores == 'all') {
                        newStores.push(store);
                    }
                })
                app.renderStore(newStores)
            })
        }
    },

    loadCurrentProduct: function (currentId) {
        cafeInfoPage.style.display = 'block';
        teaInfoPage.style.display = 'block';
        productRelate.style.display = 'flex';
        cafePage.style.display = 'none';
        teaPage.style.display = 'none';

        this.indexList = [];
        this.random(currentId);
        this.getListProduct(function (products) {
            var product = products[currentId];
            const htmls_more = `
                <img src="https://phuclong.com.vn/uploads/category/efdbe511dd7f43-cphphclong.jpg" style="width: 100%;" alt="">
                <div class="nav-way">
                  <a href="http://127.0.0.1:5500/">Trang chủ</a>
                  / <a href="">Sản phẩm</a>
                  / <a href="#">Cà phê ${product.name}</a>
                </div>
                <div class="info-content text-center row g-2">
                    <img class="col-lg-5 info-left" src="${product.img}" alt="">
                    <div class="col-lg-7 info-right">
                        <h3 class="content-title font-28">Cà phê ${product.name}</h3>
                        <h2 class="content-price">${product.price}.000 đ</h2>
                        <p class="content-code">Mã sản phẩm: CPVAN006</p>
                        <p class="font-w">Số lượng</p>
                        <div class="row">
                            <div class="input-group quatity-group">
                                <span onclick="app.reduceQuantity(${product.id})" class="input-group-text input-reduce">-</span>
                                <span class="quatity">${app.currentQuatity}</span>
                                <span onclick="app.raiseQuantity(${product.id})" class="input-group-text input-raise">+</span>
                            </div>
                        </div>
                        <button onclick="app.addProductToList(${product.id}, ${app.currentQuatity}, ${product.price})" class="order-btn">
                            <img class="product-surf" src="${product.img}" alt="">
                            <span class="material-icons-outlined">shopping_cart</span> 
                            <span>ĐẶT HÀNG</span>
                        </button>
                    </div>
                </div>
                <div class="product-more row">
                  <div class="more-left more-item">
                    <h6 class="title">Thông tin sản phẩm</h6>
                    <p class="border-bottom pb-3">Quy cách: 200g</p>
                    <p class="text">Mô tả: Cà phê ${product.name} là sự kết hợp giữa cà phê robusta và hương vani pháp, hương vani được kết hợp vào làm bật thêm hương và vị của cà phê, cà phê vani mang lại cho người dùng sự dịu nhẹ ấm áp tâm hồn.</p>
                  </div>
                  <div class="more-center more-item">
                    <img src="${product.img}" alt="">
                  </div>
                  <div class="more-right more-item">
                    <h6 class="title">Hướng dẫn sử dụng</h6>
                    <p class="border-bottom pb-3">Bảo quản: Nơi khô thoáng</p>
                    <p class="border-bottom pb-3">Hạn sử dụng: Xem trên bao bì</p>
                    <p class="text">Cách pha cà phê: <br>
                      - Tráng phin và tách bằng nước nóng.<br>
                      - Cho 3 - 4 muỗng cà phê (khoảng 15 - 20g) vào phin. Lắc nhẹ phin cho mặt cà phê bằng phẳng. Đậy lưới chèn cà phê, nhấn nhẹ.<br>
                      - Đổ khoảng 25ml nước sôi vào phin cho cà phê ngấm đều.<br>
                      - Cho thêm khoảng 45ml nước sôi vào phin, đậy nắp phin. Khoảng 5 phút là có thể dùng được.<br>
                      - Có thể dùng chung với sữa hoặc đường tùy theo khẩu vị.</p>
                  </div>
                </div>
                <p class="font-sw text-start font-24 ps-5">Sản phẩm liên quan:</p>
                `
            productLoad.innerHTML = htmls_more;

            const htmls_4 = products.map((product_relate, index) => {
                if (app.indexList.includes(index)) {
                    return `    
                    <div onclick="app.reloadDOMEvent(${product_relate.id})" class="product-item item-relate" data-index="${product_relate.id}">
                        <img src="${product_relate.img}">
                        <h4 class="product-name">Cà Phê ${product_relate.name}</h4>
                        <p class="product-weight">${product_relate.weight} g</p>
                        <p class="product-price">${product_relate.price}.000 đ</p>
                    </div>`
                }
            })
            productRelate.innerHTML = htmls_4.join('');
        });
    },

    start: function () {

        this.renderListCart()

        this.getListStore(this.renderStore);

        this.handleEvents();
    },
}

app.start()