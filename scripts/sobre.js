const carouselPrevBtn = document.querySelector(".carousel-control-prev");
const carouselNextBtn = document.querySelector(".carousel-control-next");


carouselNextBtn.onclick = (e) => {
    const ativoAgora = document.querySelector('div[class*="active"]');
    ativoAgora.classList.remove("active");
    if (ativoAgora.nextElementSibling != null)
        ativoAgora.nextElementSibling.classList.add("active");
    else
        ativoAgora.parentElement.firstElementChild.classList.add("active");
};

carouselPrevBtn.onclick = (e) => {
    const ativoAgora = document.querySelector('div[class*="active"]');
    ativoAgora.classList.remove("active");
    if (ativoAgora.previousElementSibling != null)
        ativoAgora.previousElementSibling.classList.add("active");
    else
        ativoAgora.parentElement.lastElementChild.classList.add("active");
};