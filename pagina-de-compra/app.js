document.addEventListener('DOMContentLoaded', () => {
    fetch('../Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    fetch('../Footer/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      });

});

let elementoDetalhes = document.querySelectorAll('.sobre');

elementoDetalhes.forEach(function (sobre) {
    sobre.addEventListener('click', function() {
        sobre.classList.toggle('active')
    })
});
