const cpf_regex = /(\d{3}.){2}(\d{3}-\d{2})/gm;

let formValido = false;

document.getElementById("form_confirma_btn").onclick = () => {
    const form = document.getElementById("info_gelo");
    validarForm(form);
    if (formValido) {
        mostrarConfirmacao(form);
        estadoAnterior = document.getElementById("qf_select").disabled;
        document.querySelectorAll("form fieldset").forEach(e => e.disabled = true);
    }
};

function mostrarConfirmacao(form) {
    const el = document.getElementById("confirma_cont");
    el.innerHTML = "<h2> Confirme suas informações: </h2>";
    const dadosForm = new FormData(form);
    for (const [i, k] of dadosForm) {
        if (i.includes("gelo_interesse"))
            continue;

        if (i.includes("nasc")) {
            const idd = validarIdade(k);
            const idd_el = document.createElement("p");
            idd_el.innerText = `Idade: ${idd}`;
            el.appendChild(idd_el);
        }
        el.appendChild(fazerElementoConfirmacao(i, k));
    }
    el.insertAdjacentHTML("beforeend", `<p>Interesse em gelos naturais: ${dadosForm.getAll("gelo_interesse_n").join(", ")}.</p>`);
    el.insertAdjacentHTML("beforeend", `<p>Interesse em gelos artificiais: ${dadosForm.getAll("gelo_interesse_a").join(", ")}.</p>`);
    fazerBotoes().forEach(b => el.appendChild(b));
    el.hidden = false;
}

let estadoAnterior = undefined;
function fazerBotoes() {
    const reset = (e) => {
        e.target.parentElement.hidden = true;
        document.querySelectorAll("form fieldset").forEach((e) => e.disabled = false);
        document.getElementById("qf_select").disabled = estadoAnterior;
    };

    const env = document.createElement("button");
    env.type = "submit";
    env.innerText = "Enviar";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.innerText = "Editar";
    edit.onclick = reset;
    const limpar = document.createElement("button");
    limpar.type = "reset";
    limpar.innerText = "Limpar";
    limpar.onclick = reset;
    return [env, edit, limpar];
}


function fazerElementoConfirmacao(nome, info) {
    const dadosLabel = document.querySelector(`#info_gelo label[for*='${nome}']`);
    const elem = document.createElement("p");
    elem.innerText = `${dadosLabel.innerText} ${info}`;
    return elem;
}

function validarForm(e) {
    // e.preventDefault();
    limparAvisos();
    formValido = true;
    const dadosForm = new FormData(e);
    if (dadosForm.get("nome").length === 0) {
        mostrarAviso("nome");
    }

    if (!validarEmail(dadosForm.get("mail"))) {
        mostrarAviso("mail");
    }

    if (!dadosForm.get("cpf").match(cpf_regex)) {
        mostrarAviso("cpf", "CPF inválido.");
    }

    const data = dadosForm.get("nasc");
    if (data.length === 0) {
        mostrarAviso("nasc", "A data de nascimento deve ser preenchida.");
    }

    const aniv = validarIdade(data);
    if (aniv === -1) {
        mostrarAviso("nasc", "Selecione uma data de nascimento real.");
    }

    const intrNat = dadosForm.getAll("gelo_interesse_n");
    if (intrNat.length === 0) {
        mostrarAviso("gelo_interesse_n", "Selectione pelo menos 1 opção.");
    }

    const intrArt = dadosForm.getAll("gelo_interesse_a");
    if (intrArt.length === 0) {
        mostrarAviso("gelo_interesse_a", "Selectione pelo menos 1 opção.");
    }
};

function limparAvisos() {
    document.querySelectorAll(`*[class*='aviso']`).forEach(e => e.parentElement.removeChild(e));
};

document.forms[0].onchange = (e) => {
    [...e.target.parentElement.childNodes].filter(f => {
        if (f.classList != undefined && f.classList.contains("aviso")) {
            e.target.parentElement.removeChild(f);
        }
    });
};

document.forms[0].nasc.onchange = (e) => {
    const aniv = validarIdade(e.target.value);
    if (aniv != -1)
        mostrarIdade(aniv);
};

document.forms[0].nome.onchange = (e) => {
    if (e.target.value.length === 0) {
        mostrarErro(e.target);
    }
};

document.forms[0].cpf.onkeyup = (e) => {
    if (e.key == 'Delete' || e.key == 'Backspace')
        return;

    if (!(!isNaN(e.key) || e.key === '.' || e.key === '-')) {
        e.target.value = e.target.value.replace(e.key, "");
    }
    else {
        switch (e.target.value.length) {
            case 3:
            case 7:
                e.target.value += ".";
                break;
            case 11:
                e.target.value += "-";
                break;
            default:
                break;
        }
    }
    if (e.target.value.length < 15) {
        mostrarErro(e.target);
    }
    if (e.target.value.match(cpf_regex))
        limpaErro(e.target);
};

document.forms[0].ja_fez_gelo.forEach(el => el.onchange = (e) => document.getElementById("qf_select").disabled = e.target.value != "não");

function validarEmail(end) {
    let arr = end.indexOf("@");
    if (arr === -1) {
        return false;
    }
    else {
        return end.indexOf(".") - arr > 1;
    }
}

function mostrarErro(el) {
    el.classList.add("erro");
}

function limpaErro(el) {
    el.classList.remove("erro");
}

function mostrarAviso(nome, msg) {
    formValido = false;
    const el = document.querySelector(`input[name*='${nome}']`);
    el.parentNode.appendChild(fazerAviso(nome, msg));
}

function fazerAviso(nome, msg) {
    const p = document.createElement("span");
    p.innerText = msg === undefined ? `O campo ${nome} deve ser preenchido.` : msg;
    p.classList.add("aviso");
    return p;
}

function validarIdade(data) {
    const aniv = (new Date().getFullYear() - new Date(data).getFullYear());
    return (aniv > 140 || aniv < 10) ? -1 : aniv;
}

function mostrarIdade(val) {
    const p = document.forms[0].nasc.parentElement.querySelector("p");
    p.innerText = `Idade: ${isNaN(val) ? "--" : val}`;
}