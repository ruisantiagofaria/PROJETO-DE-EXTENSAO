const CHAVE = "falecidos";
const form = document.getElementById("form-falecido");
const msg = document.getElementById("mensagem");
const tbody = document.querySelector("#tabela tbody");

const ler = () => JSON.parse(localStorage.getItem(CHAVE) || "[]");
const gravar = (lista) => localStorage.setItem(CHAVE, JSON.stringify(lista));

function mostrar(texto, ok) {
  msg.textContent = texto;
  msg.className = ok ? "ok" : "erro";
}

function dataBR(iso) {
  return iso.split("-").reverse().join("/");
}

function validar(d) {
  const hoje = new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD local
  if (!d.nome || d.nome.trim().length < 3) return "Informe o nome completo do falecido.";
  if (!d.dataNascimento || !d.dataObito) return "Informe as datas de nascimento e de óbito.";
  if (d.dataObito > hoje) return "A data do óbito não pode ser futura.";
  if (d.dataNascimento > d.dataObito) return "O nascimento não pode ser depois do óbito.";
  if (!d.numeroDO.trim()) return "Informe o nº da Declaração de Óbito.";
  if (ler().some(f => f.numeroDO === d.numeroDO.trim())) return "Já existe cadastro com essa Declaração de Óbito.";
  if (!d.respNome.trim() || !d.respTelefone.trim()) return "Informe nome e telefone do responsável.";
  if (d.tarifa !== "normal" && !d.comprovante.trim()) return "Informe o documento comprobatório da tarifa.";
  return null;
}

function renderizar() {
  tbody.innerHTML = "";
  ler().forEach(f => {
    const tr = document.createElement("tr");
    [f.nome, dataBR(f.dataObito), f.numeroDO, f.respNome, f.tarifa].forEach(valor => {
      const td = document.createElement("td");
      td.textContent = valor; // textContent evita injeção de HTML
      tr.appendChild(td);
    });
    const tdAcao = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.addEventListener("click", () => {
      gravar(ler().filter(x => x.id !== f.id));
      renderizar();
    });
    tdAcao.appendChild(btn);
    tr.appendChild(tdAcao);
    tbody.appendChild(tr);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  const erro = validar(dados);
  if (erro) return mostrar(erro, false);

  dados.numeroDO = dados.numeroDO.trim();
  dados.id = Date.now();
  gravar([...ler(), dados]);
  form.reset();
  mostrar("Falecido cadastrado com sucesso.", true);
  renderizar();
});

renderizar();
