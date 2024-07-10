let openShopping  = document.querySelector('.add')
let closeShopping = document.querySelector('.closeShopping')
let list = document.querySelector('.list')
let Container = document.querySelector('.container')
let body = document.querySelector('body');
let total= document.querySelector('.totals')
let  quantity = document.querySelector('.cart-count')
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.cart-count span')


openShopping.addEventListener('click', ()=>{
    body.classList.add('active')
});

closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active')
})
total.addEventListener('click',()=>{
    alert('Order successfull !!!')
    body.classList.toggle('active') 
  
})
let listProducts = [];
let carts =[];
 
const addDataToHTML =() => {
    Container.innerHTML = '';
    if(listProducts.length>0){
        listProducts.forEach(product =>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `<img src="${product.image}" alt="">
        <h2>"${product.name}"</h2>
        <div class="price">"${product.price}"</div>
        <button  class="add-buy">Add to Cart</button>`;
        Container.appendChild(newProduct);
        })
    }
}

Container.addEventListener('click' , (event)=>{
    let postionClick = event.target;
    if(postionClick.classList.contains('add-buy')){
        let product_id = postionClick.parentElement.dataset.id;
        addToCart(product_id)
    }
})
const addToCart = (product_id) =>{
    let positionThisProductInCart = carts.findIndex((value)=> value.product_id == product_id)
    if(carts.length <= 0){
       
        carts = [{
        product_id: product_id,
        quantity: 1
    }] 
    }else if(positionThisProductInCart < 0){
    carts.push({
        product_id: product_id,
        quantity: 1
    })
    }else{
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity +1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () =>{
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addCartToHTML = ()=>{
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if(carts.length > 0 ){
        carts.forEach(cart=> {
           
                totalQuantity = totalQuantity + cart.quantity ;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct]
            newCart.innerHTML = `
              <div class="image">
                            <img src=${info.image} alt="">

                        </div>
                        <div class="name">${info.name}</div>
                        <div class="totalPrice">
                          ${info.price}
                        </div>
                        <div class="quantity">
                            <button class="minus"><</button>
                            <span>${cart.quantity}</span>
                            <button class="plus">></button>
                        </div>`;
      listCartHTML.appendChild(newCart)
        })
    }
    iconCartSpan.innerText = totalQuantity;


}
listCartHTML.addEventListener('click', (event)=>{
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let change = 'minus';
        if(positionClick.classList.contains('plus')){
            change ='plus'
        }
        changeQuantity(product_id , change)
    }
})
const changeQuantity = (product_id, change) =>{
  let positionItemInCart = carts.findIndex((value)=> value.product_id == product_id);
  if(positionItemInCart >=0){
    switch(change){
        case 'plus':
            carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
            break;
            default:
                let valueChange =  carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1)
                }
                break;
    }
  }
  addCartToMemory();
  addCartToHTML();
}


const initApp = () => {
    //get dta from json
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        //console.log(listProducts);
        addDataToHTML();
        //get cart from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'))
            addCartToHTML();
        }
    })
}
initApp();
