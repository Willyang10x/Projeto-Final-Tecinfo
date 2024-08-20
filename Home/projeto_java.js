document.addEventListener('DOMContentLoaded', () => {
    let indiceAtual = 0;
    const banners = document.querySelectorAll('.banner');
    const totalBanners = banners.length;
    const wrapperBanner = document.querySelector('.wrapper-banner');

    function mostrarBanner(indice) {
        const deslocamento = -indice * 100;
        wrapperBanner.style.transform = `translateX(${deslocamento}%)`;
    }

    function proximoBanner() {
        indiceAtual = (indiceAtual + 1) % totalBanners;
        mostrarBanner(indiceAtual);
    }

    mostrarBanner(indiceAtual);
    setInterval(proximoBanner, 3000);
});
