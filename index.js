var countDownDate;
var now ;
var timeId;
var timeleft;
CounterTimer().then(value => alert(`Page has started: ${value}.`));
 function CounterTimer() {
   return new Promise((resolve, reject) => {
   
    fetch("http://localhost:8000/api/time")
        .then(response => {
          if (response.status === 200) {     
            return response.json();
          } else {
            throw new Error("This is an error");
          }
        })
        .then(data => {
          countDownDate = data[0].time;
          timeId = data[0].id;
        //   console.log(timeId)
        //   console.log('countDownTime when fetch from DB ', countDownDate);
        });

        // button clicked 
        


     var countdownTimer = setInterval(() => {
        var now = new Date().getTime(); 
        var   timeleft = parseInt(countDownDate) - parseInt(now);
        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24)); // get the days 
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // get the hours
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)); // get the minutes 
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000); // get the seconds
        
        document.getElementById("days").innerHTML = days + "d "
        document.getElementById("hours").innerHTML = hours + " h" 
        document.getElementById("minutes").innerHTML = minutes + " m" 
        document.getElementById("seconds").innerHTML = seconds + " s"
      
        
 
       if (timeleft <= 0) {
         clearInterval(countdownTimer);      
        document.getElementById("days").className = "d-none"
        document.getElementById("hours").className = "d-none"
        document.getElementById("minutes").className = "d-none"
        document.getElementById("seconds").className = "d-none"
        document.getElementById("discount_end").className = "d-none"
        let list = document.getElementsByClassName("external");
        //console.log(list[0]);
        var index;
        for (index = 0; index < list.length; index++) {
          
            list[index].children.namedItem("price").style.display = "none"
            list[index].children.namedItem("discount_end").style.display = "none"
            list[index].children.namedItem("show_main").style.display = ""

        }
          
         document.getElementById("end").innerHTML.style = "TIME'S UP, DISCOUNT End !";
        reject(true);
       }
    
     }, 1000);
     $("#onemore").click(function(){
        console.log('button clicked ')
        countDownDate = parseInt(countDownDate) + (10000);
        timeleft = parseInt(countDownDate) - parseInt(now);
      
          fetch("http://localhost:8000/api/time/"+countDownDate,{
            method:'POST',
            dataType: "json",                
        }).then(response=>{
            return response.json()
        }).then(data=> 
        console.log(data)
        ).catch(err => console.log(err))  
     });
   });
 }
 

var pro_Card;
$(document).ready(function() {
    $.getJSON('http://localhost:8000/api/product')
        .then(data => {
            $.each(data, function (i, product) {
                 proCard = '<div class="card m-3" style="width: 14rem; height: 17rem;">' +
                '<div class="card-body external">' +
                    '<h5 class="card-title" style="background-color:pink ; padding:15px; border-radius:20px">' + product.name + '</h5>' +
                    '<p class="card-text">  '   + truncateString(product.decsription, 10)  + '</p>' +
                    '<div class="card-text" id="price" style="text-decoration: line-through; color:red; ">Price $'   + product.price + '</div>' +
                    '<div class="card-text" id= "discount_end" style="font-weight:bold">Discount Price $'   + product.discount_price + '</div>' +        
                    '<h5 class="card-text" id = "show_main" style = "display : none">Price $'   + product.price + '</h5>' +
                    `<button class="btn btn-danger" onclick="addToCart(${product.id},${product.price},${product.discount_price})"> Add to Cart </button>` +
                    '</div>' + 
                '</div>';
                 $('#userList').append(proCard);
            }); 
        })
        
       
})



let dropdown = $('#category');

dropdown.empty();

dropdown.append('<option selected="true" disabled>Choose Category</option>');
dropdown.prop('selectedIndex', 0);

const url = 'http://localhost:8000/api/category';

// Populate dropdown with list of provinces
$.getJSON(url, function (data) {
  $.each(data, function (key, entry) {
    dropdown.append(`<option value=${entry.id}> ${entry.name}</option>`);
  })
});
function appendCard(product){
    var productCard = '<div class="card m-3" style="width: 14rem; height: 17rem;">' +
    '<div class="card-body">' +
        '<h5 class="card-title" style="background-color:pink ; padding:15px; border-radius:20px">' + product.name + '</h5>' +
        '<p class="card-text">  '   + truncateString(product.decsription, 10)  +'</p>' +
        '<div class="card-text"  id="price" style="text-decoration: line-through; color:red ;">Price $'   + product.price + '</div>' +
        '<div class="card-text" id= "discount_end"  style="font-weight:bold">Discount Price $'   + product.discount_price + '</div >' +        
        '<div class="card-text" id = "show_main" style = "display : none ; ">Price $'   + product.price + '</div>' +
         `<button class="btn btn-danger" onclick="addToCart(${product.id})"> Add to Cart </button>` +
    '</div>' + 
    '</div>';
    $('#userList').append(productCard);
}
function createProduct() {  
    var product = {};  
    product.name   = $('#name').val();  
    product.price  = $('#price').val();  
    product.discount_price  = $('#discount_price').val(); 
    product.decsription = $('#decsription').val();  
    product.category_id    = $('#category').val();  
    console.log(product)
     
      
        $.ajax({  
            url: 'http://localhost:8000/api/product',  
            method: 'POST',  
            data:  product,
            dataType: "json",  
            success: function (data) {   
                console.log(data); 
                appendCard(data.message);
                showToast("Product Successfully Created !")
            },  
            error: function (err) {  
                console.log(err);  
            }  
        });  
    
    }
function showToast(message){
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: true, // Prevents dismissing of toast on hover
        onClick: function(){} // Callback after click
      }).showToast();
}


function truncateString(string, limit) {
    if (string.length > limit) {
      return string.substring(0, limit) + "..."
    } else {
      return string
    }
  }

function showCart(){
 document.getElementById("cartItems").innerHTML="";
    $.ajax({
        type: "GET",
        url: "http://localhost:8000/api/cart/",
        success: function (products) {
            console.log(products);
          products.forEach((element) => {
            //console.log(element);
           
            document.getElementById("cartItems").innerHTML += `
                  <div class = "card w-90 mt-5 bg-light" id = ${element.id}>
                  <div class = "card-body">
                      <h5 class = "card-title">Product Name : ${element.name}</h5>
                      <p class = "card-text">Price : $${element.price}</p>
                       
                      <a href = "#" class = "btn btn-danger" onclick="removeFromCart(${element.id})" >Rmove from cart</a>
    
                  </div>
                   </div>`;
          });
        },
      });
}
 
function addToCart(id, price,discount_price){
    
    fetch("http://localhost:8000/api/time")
      .then(response => {
        if (response.status === 200) {     
          return response.json();
        } else {
          throw new Error("This is an error");
        }
      })
      .then(data => {
        countDownDate = data[0].time;
        timeId = data[0].id;
      //   console.log(timeId)
         console.log('countDownTime when fetch from DB ', countDownDate);
      });
      var now = new Date().getTime(); 
      var   timeleft = parseInt(countDownDate) - parseInt(now);
      var days = Math.floor(timeleft / (1000 * 60 * 60 * 24)); // get the days 
      var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // get the hours
      var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)); // get the minutes 
      var seconds = Math.floor((timeleft % (1000 * 60)) / 1000); // get the seconds
      // button clicked 
     console.log('countDownDate', countDownDate);
     console.log(days, hours , minutes , seconds);
     console.log(id,price, discount_price,timeleft);
     if (timeleft <= 0) {
      toSend = {
        product_id: id,
        qty:1,
        price:price
      };
     }
     else {
      toSend = {
        product_id: id,
        qty:1,
        price:discount_price
      };
     }

     $.ajax({
       url: "http://localhost:8000/api/cart",
       type: "POST",
       data: toSend,
       //processData: false,
       success: function (data) {
         Toastify({
           text: `Add to Cart Successfuly `,
           duration: 2000,
         }).showToast();
         
       },
       error: function (error) {
         console.error(error);
       },
     });
   }
 
function removeFromCart(id)
{
    toDelete = {
       product_id: id,
     };
     e_url = "http://localhost:8000/api/cart/" + id;
     console.log(e_url);
     $.ajax({
       url: e_url,
       type: "DELETE",
       data: toDelete,
       //processData: false,
       success: function (data) {
         Toastify({
           text: `Remove from Cart Successfully`,
   
           duration: 2000,
         }).showToast();
          
       },
       error: function (error) {
         console.error(error);
       },
     });
     var erase = document.getElementById(id)
     ;
       erase.className = "d-none";
       console.log("This is cart.." + id);
   }