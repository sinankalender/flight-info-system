const ucuslar = [
  { ucusNo: "TK2241", havayolu: "THY", yon: "departure", hatTipi: "domestic", sehir: "Ankara", saat: "13:35", durum: "Kalktı" },

  { ucusNo: "PC2657", havayolu: "PGT", yon: "departure", hatTipi: "domestic", sehir: "İstanbul", saat: "17:35", durum: "Planlandı" },

  { ucusNo: "TK2351", havayolu: "AJT", yon: "departure", hatTipi: "domestic", sehir: "Antalya", saat: "16:30", durum: "Gecikmeli" }
];

const tbody = document.querySelector("tbody");

ucuslar.forEach(function(ucus) {
    
  const satir = `
    <tr>
      <td>${ucus.havayolu}</td>
      <td>${ucus.ucusNo}</td>
      <td>${ucus.sehir}</td>
      <td>${ucus.saat}</td>
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
        return "durum-hata";
    } 
    
    
    else {
        return "durum-notr";
    }
}