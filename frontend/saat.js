const saatAlani = document.querySelector("#saat");
const saatBicimi = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit",
});

function saatiGuncelle() {
  const simdi = new Date();
  saatAlani.dateTime = simdi.toISOString();
  saatAlani.textContent = `Saat: ${saatBicimi.format(simdi)}`;
}

saatiGuncelle();
setInterval(saatiGuncelle, 1000);
