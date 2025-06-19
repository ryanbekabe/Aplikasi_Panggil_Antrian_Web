const socket = io();

const currentNumberEl = document.getElementById('currentNumber');
const latestNumberEl = document.getElementById('latestNumber');
const loketInfo = document.getElementById('loketInfo');
const callLogDiv = document.getElementById('callLog');
let callLog = [];

function updateCallLogDisplay() {
  callLogDiv.innerHTML = '<h3>5 Panggilan Terakhir</h3>' +
    '<ul>' +
    callLog.map(item => `<li>Nomor ${item.nomor} - Loket ${item.loket}</li>`).join('') +
    '</ul>';
}

function speakQueueNumber(nomor, loket) {
  let text = `Nomor antrian ${nomor}, silakan menuju loket ${loket}`;
  const utter = new window.SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const indoVoice = voices.find(v => v.lang.startsWith('id'));
  if (indoVoice) utter.voice = indoVoice;
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

let lastCurrentNumber = null;

socket.on('queueUpdate', (data) => {
  currentNumberEl.textContent = data.current;
  latestNumberEl.textContent = data.latest;
  if (data.loket) {
    loketInfo.textContent = `Menuju Loket ${data.loket}`;
  } else {
    loketInfo.textContent = '';
  }
  // Log hanya jika ada pemanggilan
  if (data.current && data.loket && (callLog.length === 0 || callLog[0].nomor !== data.current)) {
    callLog.unshift({ nomor: data.current, loket: data.loket });
    if (callLog.length > 5) callLog = callLog.slice(0, 5);
    updateCallLogDisplay();
  }
  // Suara panggilan hanya di display
  if (data.action === 'panggil' && data.current && data.loket && lastCurrentNumber !== data.current) {
    speakQueueNumber(data.current, data.loket);
  }
  lastCurrentNumber = data.current;
});
