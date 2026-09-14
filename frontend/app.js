let pages = [];
let screens = [];

const container = document.querySelector("#screen-list");

function statusClass(status) {
  return status === "online" ? "status-online" : "status-offline";
}

function renderScreens() {
  container.innerHTML = "";

  screens.forEach(function(screen) {
    const page = pages.find(function(page) {
      return page.id === screen.yayinId;
    });

    const options = pages.map(function(page) {
      const selected = page.id === screen.yayinId ? "selected" : "";

      return `
        <option value="${page.id}" ${selected}>
          ${page.name}
        </option>
      `;
    }).join("");

    const url = `ekran.html?id=${screen.id}&yayinId=${screen.yayinId}`;

    container.innerHTML += `
      <div class="screen-card" data-screen-id="${screen.id}">
        <h3>${screen.name}</h3>
        <p>${page.name}</p>

        <label for="yayin-${screen.id}">Yayın:</label>
        <select id="yayin-${screen.id}">
          ${options}
        </select>

        <span
          class="status-point ${statusClass(screen.status)}"
          title="${screen.status}"
        ></span>

        <p>
          <a href="${url}" target="_blank" rel="noopener">
            Ekranı aç
          </a>
        </p>
      </div>
    `;
  });
}

container.addEventListener("change", function(event) {
  if (!event.target.matches("select")) {
    return;
  }

  const card = event.target.closest(".screen-card");
  const screenId = Number(card.dataset.screenId);
  const yayinId = Number(event.target.value);

  const screen = screens.find(function(screen) {
    return screen.id === screenId;
  });

  screen.yayinId = yayinId;
  renderScreens();

  document.querySelector(`#yayin-${screenId}`).focus();
});

container.addEventListener("click", function(event) {
  if (event.target.closest("select, label, a")) {
    return;
  }

  const card = event.target.closest(".screen-card");

  if (!card) {
    return;
  }

  const link = card.querySelector("a");
  window.open(link.href, "_blank", "noopener");
});

async function paneliBaslat() {
  container.textContent = "Ekranlar yükleniyor...";

  try {
    pages = await veriGetir("/pages");
    screens = await veriGetir("/screens");

    renderScreens();
  } catch (error) {
    container.textContent =
      `Ekran bilgileri alınamadı. ${error.message}`;

    console.error(error);
  }
}

paneliBaslat();
