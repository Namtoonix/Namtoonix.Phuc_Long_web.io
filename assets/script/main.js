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
                        ??i???n tho???i: ${store.phone}
                    </p>
                    <button href="${store.url}" class="col-lg-4 col-sm-12 address-btn font-14">Ch??? ???????ng</button>
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
        // hi???u th??? sp li??n quan
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
                                <h4 class="title">C?? ph?? ${products[product.productId].name}</h4>
                                <p>${product.quantity}x ${product.price}.000??</p>
                            </div>
                            <button onclick="app.removeProduct(${product.id})" class="material-icons-outlined cart-remove">close</button>
                        </div>
                    `
                })
                listBuy.innerHTML = html_listCart.join('');
    
                totalPay.innerText = `${_this.totalCoin}.000 ??`
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
                    <h4 class="product-name">C?? Ph?? ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 ??</p>
                </div>`
            }
        })
        productList_1.innerHTML = htmls_1.join('');

        const htmls_2 = products.map((product) => {
            if (product.type == 'list_2') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">C?? Ph?? ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 ??</p>
                </div>`
            }
        })
        productList_2.innerHTML = htmls_2.join('');

        const htmls_3 = products.map((product) => {
            if (product.type == 'list_3') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">C?? Ph?? ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 ??</p>
                </div>`
            }
        })
        productList_3.innerHTML = htmls_3.join('');

        const htmls_4 = products.map((product) => {
            if (product.type == 'list_4') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">C?? Ph?? ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 ??</p>
                </div>`
            }
        })
        productList_4.innerHTML = htmls_4.join('');

        const htmls_5 = products.map((product) => {
            if (product.type == 'list_5') {
                return `
                <div onclick="app.loadCurrentProduct(${product.id})" class="product-item" data-index="${product.id}">
                    <img src="${product.img}">
                    <h4 class="product-name">C?? Ph?? ${product.name}</h4>
                    <p class="product-weight">${product.weight} g</p>
                    <p class="product-price">${product.price}.000 ??</p>
                </div>`
            }
        })
        productList_5.innerHTML = htmls_5.join('');
    },

    handleEvents: function () {
        const _this = this;

        // X??? l?? khi b???m v??o login
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

        // X??? l?? khi b???m v??o nav-toggle
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
        // X??? l?? khi b???m v??o EN/VN
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

        // X??? l?? khi hover v??o cart
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

        // X??? l?? khi hover/click v??o m???c S???n ph???m
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

        // X??? l?? khi click v??o m???c S???n ph???m CF
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

        // X??? l?? khi click v??o m???c S???n ph???m Tea
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

        // Hi???n th??ng b??o khi ngo??i gi??? l??m vi???c
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

        // L???c store
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
                  <a href="http://127.0.0.1:5500/">Trang ch???</a>
                  / <a href="">S???n ph???m</a>
                  / <a href="#">C?? ph?? ${product.name}</a>
                </div>
                <div class="info-content text-center row g-2">
                    <img class="col-lg-5 info-left" src="${product.img}" alt="">
                    <div class="col-lg-7 info-right">
                        <h3 class="content-title font-28">C?? ph?? ${product.name}</h3>
                        <h2 class="content-price">${product.price}.000 ??</h2>
                        <p class="content-code">M?? s???n ph???m: CPVAN006</p>
                        <p class="font-w">S??? l?????ng</p>
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
                            <span>?????T H??NG</span>
                        </button>
                    </div>
                </div>
                <div class="product-more row">
                  <div class="more-left more-item">
                    <h6 class="title">Th??ng tin s???n ph???m</h6>
                    <p class="border-bottom pb-3">Quy c??ch: 200g</p>
                    <p class="text">M?? t???: C?? ph?? ${product.name} l?? s??? k???t h???p gi???a c?? ph?? robusta v?? h????ng vani ph??p, h????ng vani ???????c k???t h???p v??o l??m b???t th??m h????ng v?? v??? c???a c?? ph??, c?? ph?? vani mang l???i cho ng?????i d??ng s??? d???u nh??? ???m ??p t??m h???n.</p>
                  </div>
                  <div class="more-center more-item">
                    <img src="${product.img}" alt="">
                  </div>
                  <div class="more-right more-item">
                    <h6 class="title">H?????ng d???n s??? d???ng</h6>
                    <p class="border-bottom pb-3">B???o qu???n: N??i kh?? tho??ng</p>
                    <p class="border-bottom pb-3">H???n s??? d???ng: Xem tr??n bao b??</p>
                    <p class="text">C??ch pha c?? ph??: <br>
                      - Tr??ng phin v?? t??ch b???ng n?????c n??ng.<br>
                      - Cho 3 - 4 mu???ng c?? ph?? (kho???ng 15 - 20g) v??o phin. L???c nh??? phin cho m???t c?? ph?? b???ng ph???ng. ?????y l?????i ch??n c?? ph??, nh???n nh???.<br>
                      - ????? kho???ng 25ml n?????c s??i v??o phin cho c?? ph?? ng???m ?????u.<br>
                      - Cho th??m kho???ng 45ml n?????c s??i v??o phin, ?????y n???p phin. Kho???ng 5 ph??t l?? c?? th??? d??ng ???????c.<br>
                      - C?? th??? d??ng chung v???i s???a ho???c ???????ng t??y theo kh???u v???.</p>
                  </div>
                </div>
                <p class="font-sw text-start font-24 ps-5">S???n ph???m li??n quan:</p>
                `
            productLoad.innerHTML = htmls_more;

            const htmls_4 = products.map((product_relate, index) => {
                if (app.indexList.includes(index)) {
                    return `    
                    <div onclick="app.reloadDOMEvent(${product_relate.id})" class="product-item item-relate" data-index="${product_relate.id}">
                        <img src="${product_relate.img}">
                        <h4 class="product-name">C?? Ph?? ${product_relate.name}</h4>
                        <p class="product-weight">${product_relate.weight} g</p>
                        <p class="product-price">${product_relate.price}.000 ??</p>
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