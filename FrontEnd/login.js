
// Écouteurs d'événement pour la connexion
document.getElementById("btn-login").addEventListener("click", async (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  e.preventDefault();
// Requête serveur pour l'authentification
  const response = await fetch("http://localhost:5678/api/users/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
  });
// Comportement pour la connexion 
  const errorMessage = document.getElementById("error-login");
  const body = await response.json();
  if (body.token === undefined) {
    errorMessage.textContent = "E-mail ou Mot de passe incorrect";
  } else {
    setLocalStorageItem("token", body.token);
    window.location.href = "index.html";
  }
});
// Stockage local jeton d'authentification
function setLocalStorageItem(key, content) {
  localStorage.setItem(key, content);
}

