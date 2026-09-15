let pages = [];
let screens = [];
let ekranlarYukleniyor = false;
const kaydedilenEkranlar = new Set();

const container = document.querySelector("#screen-list");
const ekranYenileButton = document.querySelector("#ekran-yenile");
const ekranListeMesaji = document.querySelector("#ekran-liste-mesaji");
const ONIZLEME_GENISLIGI = 1280;
const onizlemeBoyutlandirici = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const iframe = entry.target.querySelector("iframe");
    iframe.style.transform = `scale(${entry.contentRect.width / ONIZLEME_GENISLIGI})`;
  });
});

function renderScreens() {
  onizlemeBoyutlandirici.disconnect();
  container.replaceChildren();
  screens.forEach(screen => {
    const page = pages.find(page => page.id === screen.yayinId);
    const card = document.createElement("div");
    card.className = "screen-card";
    card.dataset.screenId = screen.id;

    const baslik = document.createElement("h3");
    baslik.textContent = screen.name;
    const yayinAdi = document.createElement("p");
    yayinAdi.className = "yayin-adi";
    yayinAdi.textContent = page?.name || "Yayın bulunamadı";
    const onizleme = document.createElement("a");
    onizleme.className = "screen-preview";
    onizleme.href = `ekran.html?id=${screen.id}`;
    onizleme.target = "_blank";
    onizleme.rel = "noopener";
    onizleme.setAttribute("aria-label", `${screen.name} canlı önizlemesini büyük aç`);
    const iframe = document.createElement("iframe");
    iframe.src = `ekran.html?id=${screen.id}&onizleme=1&v=14.2`;
    iframe.title = `${screen.name} canlı yayın önizlemesi`;
    iframe.loading = "lazy";
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    onizleme.append(iframe);
    const onizlemeEtiketi = document.createElement("p");
    onizlemeEtiketi.className = "onizleme-etiketi";
    onizlemeEtiketi.textContent = "Canlı önizleme · Yaklaşık 5 saniyede güncellenir";
    const label = document.createElement("label");
    label.htmlFor = `yayin-${screen.id}`;
    label.textContent = "Yayın: ";
    const select = document.createElement("select");
    select.id = label.htmlFor;
    pages.forEach(page => {
      const option = document.createElement("option");
      option.value = page.id;
      option.textContent = page.name;
      select.append(option);
    });
    select.value = screen.yayinId;

    const durum = document.createElement("span");
    durum.className = `status-point ${screen.status === "online" ? "status-online" : "status-offline"}`;
    durum.title = screen.status;
    durum.setAttribute("aria-label", screen.status);
    const linkAlani = document.createElement("div");
    linkAlani.className = "screen-actions";
    const link = document.createElement("a");
    // Ekran kendi kimliğiyle açılır; güncel yayın atamasını API'den öğrenir.
    link.href = `ekran.html?id=${screen.id}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Ekranı aç";
    const duzenleLink = document.createElement("a");
    duzenleLink.className = "yayin-duzenle-link";
    duzenleLink.href = `#yayin-form-${screen.yayinId}`;
    duzenleLink.textContent = "Yayın içeriğini düzenle";
    duzenleLink.hidden = !["gorsel", "tek-ucus"].includes(page?.tip);
    linkAlani.append(link, duzenleLink);
    const mesaj = document.createElement("p");
    mesaj.className = "atama-mesaji";
    mesaj.setAttribute("role", "status");

    card.append(baslik, yayinAdi, onizleme, onizlemeEtiketi, label, select, durum, linkAlani, mesaj);
    container.append(card);
    onizlemeBoyutlandirici.observe(onizleme);
  });
}

container.addEventListener("change", async event => {
  if (!event.target.matches("select")) return;
  const select = event.target;
  const card = select.closest(".screen-card");
  const id = Number(card.dataset.screenId);
  const screen = screens.find(screen => screen.id === id);
  const yayinId = Number(select.value);
  if (!screen || kaydedilenEkranlar.has(id) || yayinId === screen.yayinId) return;

  const mesaj = card.querySelector(".atama-mesaji");
  kaydedilenEkranlar.add(id);
  select.disabled = true;
  ekranYenileButton.disabled = true;
  mesaj.className = "atama-mesaji";
  mesaj.textContent = "Kaydediliyor...";
  try {
    const kayit = await veriGonder(`/screens/${id}`, "PATCH", { yayinId });
    Object.assign(screen, kayit);
    select.value = screen.yayinId;
    const duzenleLink = card.querySelector(".yayin-duzenle-link");
    duzenleLink.href = `#yayin-form-${screen.yayinId}`;
    duzenleLink.hidden = !["gorsel", "tek-ucus"].includes(pages.find(page => page.id === screen.yayinId)?.tip);
    card.querySelector(".yayin-adi").textContent =
      pages.find(page => page.id === screen.yayinId)?.name || "Yayın bulunamadı";
    mesaj.className = "atama-mesaji mesaj-basarili";
    mesaj.textContent = "Kaydedildi. Açık ekran otomatik güncellenecek.";
  } catch (error) {
    select.value = screen.yayinId;
    mesaj.className = "atama-mesaji mesaj-hata";
    mesaj.textContent = error.message;
  } finally {
    kaydedilenEkranlar.delete(id);
    select.disabled = false;
    ekranYenileButton.disabled = kaydedilenEkranlar.size > 0;
  }
});

container.addEventListener("click", event => {
  if (event.target.closest("select, label, a")) return;
  const card = event.target.closest(".screen-card");
  if (card) window.open(card.querySelector("a").href, "_blank", "noopener");
});

async function paneliBaslat() {
  if (ekranlarYukleniyor || kaydedilenEkranlar.size > 0) return;
  ekranlarYukleniyor = true;
  ekranYenileButton.disabled = true;
  container.querySelectorAll("select").forEach(select => { select.disabled = true; });
  ekranListeMesaji.hidden = false;
  ekranListeMesaji.textContent = "Ekranlar yükleniyor...";
  try {
    const [yeniPages, yeniScreens] = await Promise.all([
      veriGetir("/pages"), veriGetir("/screens"),
    ]);
    pages = yeniPages;
    screens = yeniScreens;
    renderScreens();
    ekranListeMesaji.textContent = screens.length ? "" : "Kayıtlı ekran bulunmuyor.";
    ekranListeMesaji.hidden = screens.length > 0;
  } catch (error) {
    ekranListeMesaji.textContent = `Ekran bilgileri alınamadı. ${error.message}`;
  } finally {
    ekranlarYukleniyor = false;
    ekranYenileButton.disabled = false;
    container.querySelectorAll("select").forEach(select => { select.disabled = false; });
  }
}

ekranYenileButton.addEventListener("click", paneliBaslat);
document.addEventListener("yayin-guncellendi", event => {
  const kayit = event.detail;
  const page = pages.find(page => page.id === kayit.id);
  if (page) Object.assign(page, kayit);
  container.querySelectorAll(".screen-card").forEach(card => {
    const option = card.querySelector(`option[value="${kayit.id}"]`);
    if (option) option.textContent = kayit.name;
    const screen = screens.find(screen => screen.id === Number(card.dataset.screenId));
    if (screen?.yayinId === kayit.id) card.querySelector(".yayin-adi").textContent = kayit.name;
  });
});
paneliBaslat();
