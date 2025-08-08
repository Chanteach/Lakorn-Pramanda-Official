var product;

// [{},{},{},{}] // length = 2

$(document).ready(() => {

    $.ajax({
        method: 'get',
        url: './api/getallproduct.php',
        success: function(response) {
            console.log(response)
            if(response.RespCode == 200) {

                product = response.Result;

                var html = '';
            for (let i = 0; i < product.length; i++) {
            let safeType = product[i].type.replace(/[ /.]/g, '');
            html += `<div onclick="openproductdetail(${i})" class="product-items ${safeType}">
            <img class="product-img" src="./images/${product[i].img}" alt="">
            <center>
            <p style="font-size: 1.2vw;">${product[i].name}</p>
            <p style="font-size: 1vw;">${ numberWithCommas(product[i].price) } THB</p>
            </center>
            </div>`;
    }
    $("#productlist").html(html);
            }
        }, error: function(err) {
            console.log(err)
        }
    })
})

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function searchsomething(elem) {
    var value = $('#' + elem.id).val();
    console.log(value);

    var html = '';
    for (let i = 0; i < product.length; i++) {
        if (product[i].name.includes(value)) {
            let safeType = product[i].type.replace(/[ /.]/g, '');
            html += `<div onclick="openproductdetail(${i})" class="product-items ${safeType}">
                <img class="product-img" src="./images/${product[i].img}" alt="">
                <center>
                    <p style="font-size: 1.2vw;">${product[i].name}</p>
                    <p style="font-size: 1vw;">${numberWithCommas(product[i].price)} THB</p>
                </center>
            </div>`;
        }
    }

    if (html == '') {
        $("#productlist").html(`<p>ไม่พบสินค้า</p>`);
    } else {
        $("#productlist").html(html);
    }
}

function searchproduct(param)  {
    console.log(param)
    $(".product-items").css('display' , 'none')
    if(param == 'all') {
        $(".product-items").css('display', 'block')
    }
    else {
        $("."+param).css('display', 'block')
    }
}

var productindex = 0;
function openproductdetail(index) {
    productindex = index;
    console.log(productindex)
    $("#modalDesc").css('display', 'flex')
    $("#mdd-img").attr('src', './images/' + product[index].img);
    $("#mdd-name").text(product[index].name)
    $("#mdd-price").text(numberWithCommas(product[index].price) + ' THB')
    $("#mdd-desc").text(product[index].description)
}

function closemodal() {
    $(".modal").css('display', 'none')
}

var bag = [];
function addtobag() {
    var pass = true;

    for (let i = 0; i < bag.length; i++) {
        if( productindex == bag[i].index ) {
            console.log('found same product')
            bag[i].count++;
            pass = false;
        }
    }

    if(pass) {
        var obj = {
            index: productindex,
            id: product[productindex].id,
            name: product[productindex].name,
            price: product[productindex].price,
            img: product[productindex].img,
            count: 1
        };
        //console.log(obj)
        bag.push(obj)
    }
    console.log(bag)

    Swal.fire({
        icon: 'success',
        title: 'เพิ่ม ' + product[productindex].name + ' ในกระเป๋าแล้ว !'
    })
    $("#bagcount").css('display','flex').text(bag.length)
}

function openbag() {
    $('#modalbag').css('display','flex')
    renderbag();
}

function renderbag() {
    if(bag.length > 0) {
        var html = '';
        for (let i = 0; i < bag.length; i++) {
            html += `<div class="baglist-items">
                     <div class="baglist-left">
                     <img src="./images/${bag[i].img}"
                        alt="">
                        <div class="baglist-detail">
                        <p style="font-size: 1.5vw;">${bag[i].name}</p>
                        <p style="font-size: 1.2vw;">${ numberWithCommas(bag[i].price * bag[i].count) } THB</p>
                        </div>
                     </div>
                     <div class="baglist-right">
                        <p onclick="deinitems('-', ${i})" class="btnc">-</p>
                        <p id="countitems${i}" style="margin: 0 20px;">${bag[i].count}</p>
                        <p onclick="deinitems('+', ${i})" class="btnc">+</p>
                     </div>
                 </div>`;
        }
        $("#mybag").html(html)
    }
    else {
        $("#mybag").html(`<p>ไม่พบสินค้าในกระเป๋า</p>`)
    }
}

function deinitems(action, index) {
    if(action == '-') {
        if(bag[index].count > 0) {
            bag[index].count--;
            $("#countitems" +index).text(bag[index].count)
            if(bag[index].count <= 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ยืนยันที่จะลบสินค้าออกจากกระเป๋า ?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก'
                }).then((res) => {
                    if(res.isConfirmed) {
                        bag.splice(index, 1)
                        console.log(bag)
                        renderbag();
                        $("#bagcount").css('display','flex').text(bag.length)
                        
                        if(bag.length <= 0) {
                            $("#bagcount").css('display','none')
                        }
                    }
                    else {
                        bag[index].count++;
                        $("#countitems"+index).text(bag[index].count)
                    }
                })
            }
        }
    }
    else if(action == '+') {
        bag[index].count++;
        $("#countitems"+index).text(bag[index].count)
    }
}

function buynow() {
    $.ajax({
        method: 'post',
        url: './api/buynow.php',
        data: {
            product: bag
        }, success: function(response) {
            console.log(response);
            if(response.RespCode == 200) {
                if (response.Amount && response.Amount.Amount) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ !',
                        html: `<p>Amount: ${response.Amount.Amount} THB</p>`
                    }).then((res) => {
                        if(res.isConfirmed) {
                            bag = [];
                            closemodal();
                            $("#bagcount").css('display','none');
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ข้อมูลไม่ครบถ้วน!',
                        text: 'ไม่สามารถแสดงข้อมูลการทำรายการได้'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ทำรายการไม่สำเร็จ !'
                })
            }
        }, error: function(err) {
            console.log(err)
        }
    })
}