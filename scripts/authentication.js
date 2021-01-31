const loginBTN = document.querySelector("#loginBTN");
const signupBTN = document.querySelector("#signupBTN");
const backend = "https://note-callobration.herokuapp.com/api/";
if (localStorage.getItem("token")) {
  window.location = "main.html";
}
loginBTN.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const username = document.querySelector("#userLogin").value;
    const password = document.querySelector("#passLogin").value;
    let token = await fetch(backend + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    console.log(token.status);
    if (token.status != 200 && token.status != 201) throw new Error();
    token = await token.text();
    localStorage.setItem("token", token);
    window.location = "main.html";
  } catch (ex) {
    console.log("err");
  }
});

signupBTN.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const username = document.querySelector("#userSignup").value;
    const password = document.querySelector("#passSignup").value;
    let token = await fetch(backend + "user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (token.status != 200 && token.status != 201) throw new Error();
    token = await token.text();
    localStorage.setItem("token", token);
    window.location = "main.html";
  } catch (ex) {
    console.log("err");
  }
});
