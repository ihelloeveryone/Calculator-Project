let input = document.getElementById("inputBox");
let buttons = document.querySelectorAll("button");


  let string = "";
  let arr = Array.from(buttons);
  arr.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.innerHTML == "=") {
        string = eval(string);
        input.value = string;
      } else if (e.target.innerHTML == "C") {
        string = "";
        input.value = string;
      } else {
        console.log(e.target);
        string = string + e.target.innerHTML;
        input.value = string;
      }
    });
  })
  function display(x){
    document.getElementById("inputBox").value += x
  }
  function del(){
    document.getElementById("inputBox").value = document.getElementById("inputBox").value.slice(0,-1)
  }
  function percent(){
    document.getElementById("inputBox").value = document.getElementById("inputBox").value/100
  }
  function calculate(){
    document.getElementById("inputBox").value = eval(document.getElementById("inputBox").value)
  }
  function clearcalc(){
    document.getElementById("inputBox").value = ""
  }
  function SCLOGIN(){
    window.open("https://worksclogin.netlify.app/","_self")
    console.log("user from calculator")
  }