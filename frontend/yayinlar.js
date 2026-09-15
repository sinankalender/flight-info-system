const yayinFormlari = document.querySelector("#yayin-formlari");
const yayinIcerikMesaji = document.querySelector("#yayin-icerik-mesaji");
const yayinIcerikYenile = document.querySelector("#yayin-icerik-yenile");
let duzenlenebilirYayinlar = [];
let yayinUcuslari = [];
let yayinlarYukleniyor = false;

function yayinFormMesaji(form, metin, hata = false) {
  const mesaj = form.querySelector(".yayin-kayit-mesaji");
  mesaj.textContent = metin;
  mesaj.className = hata ? "yayin-kayit-mesaji mesaj-hata" : "yayin-kayit-mesaji mesaj-basarili";
}

function onizlemeyiGoster(form) {
  const img = form.querySelector(".yayin-onizleme");
  if (!img) return;
  if (form.onizlemeAdresi) URL.revokeObjectURL(form.onizlemeAdresi);
  form.onizlemeAdresi = null;
  const dosya = form.elements.namedItem("resimDosyasi").files[0];
  const yol = form.elements.namedItem("resimYolu");
  yol.required = !dosya;
  let adres = yol.value.trim();
  if (dosya) {
    form.onizlemeAdresi = URL.createObjectURL(dosya);
    adres = form.onizlemeAdresi;
  }
  img.hidden = true;
  form.querySelector(".gorsel-onizleme-mesaji").textContent = "";
  if (adres) img.src = adres;
  else img.removeAttribute("src");
}

function yayinUcusSecenekleriniDoldur(form) {
  const select = form.elements.namedItem("ucusNo");
  if (!select || form.dataset.busy === "true") return;
  const secili = select.value;
  select.replaceChildren(new Option("Uçuş seç", ""));
  yayinUcuslari.forEach(ucus => {
    select.append(new Option(`${ucus.ucusNo} — ${ucus.sehir} (${ucus.yon === "departure" ? "Gidiş" : "Geliş"})`, ucus.ucusNo));
  });
  if (secili && !yayinUcuslari.some(ucus => ucus.ucusNo === secili)) {
    select.append(new Option(`${secili} — artık kayıtlı değil; başka uçuş seç`, secili));
  }
  select.value = secili;
}

function yayinFormunuDoldur(form, yayin) {
  form.closest("details").querySelector(".yayin-ozet-adi").textContent = yayin.name;
  for (const alan of ["name", "baslik", "resimYolu", "resimAciklama", "ucusNo"]) {
    const input = form.elements.namedItem(alan);
    if (input) input.value = yayin[alan] || "";
  }
  if (yayin.tip === "tek-ucus" && yayin.ucusNo && !form.elements.namedItem("ucusNo").value) {
    form.elements.namedItem("ucusNo").append(new Option(`${yayin.ucusNo} — artık kayıtlı değil`, yayin.ucusNo, true, true));
  }
  if (yayin.tip === "gorsel") {
    form.elements.namedItem("resimDosyasi").value = "";
    onizlemeyiGoster(form);
  }
}

function yayinFormlariniGoster() {
  yayinFormlari.querySelectorAll("form").forEach(form => {
    if (form.onizlemeAdresi) URL.revokeObjectURL(form.onizlemeAdresi);
  });
  yayinFormlari.replaceChildren();
  duzenlenebilirYayinlar.forEach(yayin => {
    const duzenleyici = document.createElement("details");
    duzenleyici.className = "duzenleyici";
    const ozet = document.createElement("summary");
    const ad = document.createElement("span");
    ad.className = "yayin-ozet-adi";
    const ipucu = document.createElement("span");
    ipucu.className = "duzenle-ipucu";
    ipucu.textContent = "Düzenle";
    ozet.append(ad, ipucu);
    duzenleyici.append(ozet);
    duzenleyici.addEventListener("toggle", () => {
      ipucu.textContent = duzenleyici.open ? "Kapat" : "Düzenle";
    });
    const form = document.createElement("form");
    form.id = `yayin-form-${yayin.id}`;
    form.className = "yayin-form";
    form.dataset.yayinId = yayin.id;
    duzenleyici.append(form);
    // Şablon sabittir; veritabanı değerleri aşağıda value/textContent ile doldurulur.
    form.innerHTML = `
      <fieldset>
        <legend class="sr-only">Yayın içeriği</legend>
        <div class="form-grid">
          <label>Yayın adı<input name="name" required maxlength="100"></label>
          ${yayin.tip === "gorsel" ? `
            <label>Duyuru başlığı<input name="baslik" required maxlength="160"></label>
            <label>Görsel adresi<input name="resimYolu" required maxlength="2000" placeholder="images/duyuru.png veya https://..."></label>
            <label>Bilgisayardan görsel seç<input name="resimDosyasi" type="file" accept="image/png,image/jpeg,image/gif,image/webp"><small>PNG, JPEG, GIF, WebP · en fazla 2 MB</small></label>
            <label>Açıklama<textarea name="resimAciklama" maxlength="600"></textarea></label>
          ` : `
            <label>Gösterilecek uçuş<select name="ucusNo" required></select></label>
          `}
        </div>
        ${yayin.tip === "gorsel" ? '<img class="yayin-onizleme" alt="Duyuru önizlemesi" hidden><p class="gorsel-onizleme-mesaji" role="status"></p>' : ""}
        <div class="form-actions">
          <button type="submit">Yayını kaydet</button>
          <button type="button" class="secondary yayin-vazgec">Vazgeç</button>
        </div>
      </fieldset>
      <p class="yayin-kayit-mesaji" role="status"></p>
    `;
    yayinUcusSecenekleriniDoldur(form);
    if (yayin.tip === "gorsel") {
      const img = form.querySelector("img");
      img.addEventListener("load", () => { img.hidden = false; });
      img.addEventListener("error", () => {
        img.hidden = true;
        form.querySelector(".gorsel-onizleme-mesaji").textContent = "Görsel yüklenemedi. Adresi veya seçtiğin dosyayı kontrol et.";
      });
      form.elements.namedItem("resimYolu").addEventListener("change", () => onizlemeyiGoster(form));
      form.elements.namedItem("resimDosyasi").addEventListener("change", () => onizlemeyiGoster(form));
    }
    form.querySelector(".yayin-vazgec").addEventListener("click", () => {
      const kayit = duzenlenebilirYayinlar.find(kayit => kayit.id === yayin.id);
      yayinFormunuDoldur(form, kayit);
      yayinFormMesaji(form, "");
      duzenleyici.open = false;
      ozet.focus();
    });
    yayinFormunuDoldur(form, yayin);
    yayinFormlari.append(duzenleyici);
  });
}

async function yayinIcerikleriniYukle() {
  if (yayinlarYukleniyor || yayinFormlari.querySelector('[data-busy="true"]')) return;
  yayinlarYukleniyor = true;
  yayinIcerikYenile.disabled = true;
  yayinFormlari.querySelectorAll("fieldset").forEach(alan => { alan.disabled = true; });
  yayinIcerikMesaji.textContent = "Yayınlar yükleniyor...";
  try {
    const [yayinlar, ucuslar] = await Promise.all([veriGetir("/pages"), veriGetir("/flights")]);
    duzenlenebilirYayinlar = yayinlar.filter(yayin => ["gorsel", "tek-ucus"].includes(yayin.tip));
    yayinUcuslari = ucuslar;
    yayinFormlariniGoster();
    yayinDuzenleyicisiniAc(location.hash);
    yayinIcerikMesaji.textContent = duzenlenebilirYayinlar.length ? "" : "Düzenlenebilir yayın bulunmuyor.";
    yayinlar.forEach(yayin => document.dispatchEvent(new CustomEvent("yayin-guncellendi", { detail: yayin })));
  } catch (error) {
    yayinIcerikMesaji.textContent = error.message;
  } finally {
    yayinlarYukleniyor = false;
    yayinIcerikYenile.disabled = false;
    yayinFormlari.querySelectorAll("fieldset").forEach(alan => { alan.disabled = false; });
  }
}

yayinFormlari.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.target;
  if (form.dataset.busy === "true" || !form.reportValidity()) return;
  const yayin = duzenlenebilirYayinlar.find(yayin => yayin.id === Number(form.dataset.yayinId));
  const veri = { tip: yayin.tip, name: form.elements.namedItem("name").value };
  if (yayin.tip === "tek-ucus") {
    veri.ucusNo = form.elements.namedItem("ucusNo").value;
  } else {
    for (const alan of ["baslik", "resimYolu", "resimAciklama"]) veri[alan] = form.elements.namedItem(alan).value;
  }
  form.dataset.busy = "true";
  form.querySelector("fieldset").disabled = true;
  yayinIcerikYenile.disabled = true;
  yayinFormMesaji(form, "Kaydediliyor...");
  try {
    if (yayin.tip === "gorsel") {
      const dosyaInput = form.elements.namedItem("resimDosyasi");
      const dosya = dosyaInput.files[0];
      if (dosya) {
        if (dosya.size > 2 * 1024 * 1024) throw new Error("Görsel en fazla 2 MB olabilir.");
        const yuklenen = await veriGetir("/images", { method: "POST", body: dosya });
        veri.resimYolu = yuklenen.resimYolu;
        form.elements.namedItem("resimYolu").value = yuklenen.resimYolu;
        dosyaInput.value = "";
        onizlemeyiGoster(form);
      }
    }
    const kayit = await veriGonder(`/pages/${yayin.id}`, "PUT", veri);
    Object.assign(yayin, kayit);
    yayinFormunuDoldur(form, yayin);
    document.dispatchEvent(new CustomEvent("yayin-guncellendi", { detail: kayit }));
    yayinFormMesaji(form, "Yayın kaydedildi. Açık ekranlar otomatik güncellenecek.");
  } catch (error) {
    yayinFormMesaji(form, error.message, true);
  } finally {
    form.dataset.busy = "false";
    form.querySelector("fieldset").disabled = false;
    yayinIcerikYenile.disabled = Boolean(yayinFormlari.querySelector('[data-busy="true"]'));
    yayinUcusSecenekleriniDoldur(form);
  }
});

document.addEventListener("ucuslar-guncellendi", event => {
  yayinUcuslari = event.detail;
  yayinFormlari.querySelectorAll("form").forEach(yayinUcusSecenekleriniDoldur);
});

function yayinDuzenleyicisiniAc(hash) {
  if (!/^#yayin-form-\d+$/.test(hash)) return;
  const form = document.getElementById(hash.slice(1));
  if (!form) return;
  form.closest("details").open = true;
  form.scrollIntoView({ block: "center" });
  form.elements.namedItem("name").focus({ preventScroll: true });
}

// Ekran kartındaki bağlantı, kapalı düzenleme alanını da açar.
document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#yayin-form-"]');
  if (link) yayinDuzenleyicisiniAc(link.getAttribute("href"));
});
window.addEventListener("hashchange", () => yayinDuzenleyicisiniAc(location.hash));
yayinIcerikYenile.addEventListener("click", yayinIcerikleriniYukle);
yayinIcerikleriniYukle();
