if (!localStorage.getItem("Pass&key")) {
    localStorage.setItem("Pass&key", JSON.stringify(["0SMZWTkkomLUrayadvTgXw=="]))
}
alert(`
For testing purpose-
username- HarjasSodhi
pass- hello123!
`);
let form=document.querySelector("form");
form.addEventListener("submit",function(event){
    event.preventDefault();
    let id=document.querySelector(".id").value;
    let pass=document.querySelector(".pass").value;
    let passarr = JSON.parse(localStorage.getItem("Pass&key"));
        var hash = CryptoJS.HmacMD5(pass, id);
        let password = hash.toString(CryptoJS.enc.Base64);
        if (password == passarr[0]) {
            location.replace("Jira.html");
        }
        else {
            alert("login failed");
        }
})