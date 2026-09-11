const API_URL = "http://127.0.0.1:8000";

async function veriGetir(endpoint) {
  const response = await fetch(API_URL + endpoint);

  if (!response.ok) {
    throw new Error(`İstek başarısız: ${response.status}`);
  }

  const veri = await response.json();
  return veri;
}