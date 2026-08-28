const ucuslar = [
  { ucusNo: "TK2241", havayolu: "THY", yon: "departure", hatTipi: "domestic", sehir: "Ankara", planlanan_saat: "13:35", tahmini_saat: "14:20",  kapi: "2",durum: "Kalktı" },

  { ucusNo: "PC2657", havayolu: "PGT", yon: "departure", hatTipi: "domestic", sehir: "İstanbul", planlanan_saat: "17:35", tahmini_saat: "18:00",  kapi: "5", durum: "Planlandı" },

  { ucusNo: "TK2351", havayolu: "AJT", yon: "departure", hatTipi: "domestic", sehir: "Antalya", planlanan_saat: "16:30", tahmini_saat: "17:00", kapi: "3", durum: "Gecikmeli" }
];

const tbody = document.querySelector("tbody");

ucuslar.forEach(function(ucus) {
    
  const satir = `
    <tr>
      <td>${ucus.havayolu}</td>
      <td>${ucus.ucusNo}</td>
      <td>${ucus.sehir}</td>
      <td>${ucus.planlanan_saat}</td>
      <td>${ucus.tahmini_saat}</td>
      <td>${ucus.kapi}</td>
      <td class="${durumSinifi(ucus.durum)}">${ucus.durum}</td>
      
    </tr>
  `;
  tbody.innerHTML += satir;
});


function durumSinifi(durum) {
    if(durum=="Kalktı" || durum=="İndi"){
        return "durum-basarili";
    } else if(durum=="Planlandı"){
        return "durum-notr";

    
    } else if(durum=="Gecikmeli"){
        return "durum-uyari";
    }
    else if (durum=="İptal"){
        return "durum-iptal";
    } 
    
    
    else {
        return "durum-notr";
    }
}