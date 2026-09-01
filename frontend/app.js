const screens = [
    {

      name: "Gidiş Salonu İç Hatlar",
     content: "İç Hatlar Gidiş",
     status: "online"
    },
    {
     name: "Geliş Salonu iç Hatlar",
     content: "İç Hatlar Geliş",
     status: "online"
    },

    {
     name: "Gidiş Salonu Dış Hatlar",
     content: "Dış Hatlar Gidiş",
     status: "online"
    },

    {
     name: "Geliş Salonu Dış Hatlar",
     content: "Dış Hatlar Geliş",
     status: "online"
    },

    
    {
     name: "Ana Salon",
     content: "Video/Reklam",
     status: "offline"
    },

    {
     name: "Kapı 1 Gidiş",
     content: "Uçuş Bilgisi",
     status: "online"
    },

]

const container = document.querySelector("#screen-list");

screens.forEach(function(screen) {

  const card = `
    <div class="screen-card">
      <h3>${screen.name}</h3>
      <p>${screen.content}</p>
      <span class="status-point ${statusClass(screen.status)}"></span>
    </div>
  `;
  container.innerHTML += card;

});


function statusClass(status) {
    if(status=="online"){
        return "status-online";
    }
    else {
        return "status-offline";
    }



}
    





