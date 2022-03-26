const school = "groenehartscholen"

let details = false

const apicall = async function(student, zapitoken, week){
  const today = new Date()
  const api_url = `https://${school}.zportal.nl/api/v3/liveschedule?student=${student}&week=${today.getFullYear()}${week}&fields=appointmentInstance,start,end,startTimeSlotName,endTimeSlotName,subjects,groups,locations,teachers,cancelled,changeDescription,schedulerRemark,content,appointmentType&access_token=${zapitoken}`
  const res = await fetch(api_url)
  const json = await res.json()
  const data = await json.response.data[0].appointments
  return data
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  return [d.getUTCFullYear(), weekNo];
}

function odetails(docent, les, lokaal, type){
  document.getElementById("details").style.width = "25vw"
  document.getElementById("calender").style.width = "60vw"
  elements = document.getElementsByClassName("les")
  for(var i = 0; i < elements.length; i++) {
    elements[i].style.width = "10vw"
  }
  if(type == "les"){
    document.getElementById("details").style.backgroundColor = "rgb(144, 238, 144)"
  }
  else if(type == "lesx"){
    document.getElementById("details").style.backgroundColor = "rgb(255, 160, 122)"
  }
  else{
    document.getElementById("details").style.backgroundColor = "#001220"
  }

  document.getElementById("vak").innerHTML = `${les}`
  document.getElementById("lokaal").innerHTML = `${lokaal}`
}

function cdetails(){
  document.getElementById("details").style.width = "0vw"
  document.getElementById("calender").style.width = "85vw"
  elements = document.getElementsByClassName("les")
  for(var i = 0; i < elements.length; i++) {
    elements[i].style.width = "15vw"
  }
  document.getElementById("details").style.backgroundColor = "#ffffff"
}

today = new Date()
week = getWeekNumber(new Date())[1]

sessionStorage.setItem("offset", "0");

function zweek(offset) {
  weekz = week + parseInt(sessionStorage.getItem("offset"))
  if(weekz.toString().length == 1){
  return 0 + weekz.toString()
}else{
  return weekz
}}

const rooster = async function(a){
  document.getElementById("event-container").innerHTML = ""
  let ln = getCookie('llnmr')
  let zapi = getCookie('zapi')
  let week = zweek(a)
  const data = await apicall(ln, zapi, week)
  data.forEach((data) => {
    let starttime = ((new Date(parseInt(data.start + "000")).getHours() - 8) * 60) + new Date(parseInt(data.start + "000")).getMinutes()
    if(data.appointmentType === 'lesson' || data.appointmentType === 'activity'){
      if(!data.cancelled === true && data.appointmentType === 'lesson'){
         createles(data.teachers, data.subjects, (data.end - data.start) / 60 - 2, starttime / 10 + 1, new Date(parseInt(data.start + "000")).getDay(), data.locations)
      }else if(data.cancelled === true && data.appointmentType === 'lesson'){
         createlesx(data.teachers, data.subjects, (data.end - data.start) / 60 - 2, starttime / 10 + 1, new Date(parseInt(data.start + "000")).getDay(), data.locations)
      }else if(data.appointmentType === 'activity'){
          createact(data.teachers, data.subjects, (data.end - data.start) / 60 - 2, starttime / 10 + 1, new Date(parseInt(data.start + "000")).getDay(), data.locations)
      }
    }
  })
  var element = document.getElementById("w");
  
  if (parseInt(sessionStorage.getItem("offset"))==0){
    element.innerHTML = element.innerHTML = `<u>Week ${week}</u>`
  }
  else{
    element.innerHTML = "Week " + week
  }
}

const createles = function(docent, les, length, start, day, lokaal){
  var element = document.getElementById("event-container");
  const div = document.createElement(`div`);
  div.onclick = function() {odetails(docent, les, lokaal, "les")}
  div.className = `les day${day}`
  div.id = "les"
  div.style = `height: ${length/60*10}vh; grid-row: ${start};`
  div.innerHTML += `<span class="info">${les} - ${docent}</span> <span class="lokaal" style="float: right;">${lokaal}</span>`
  element.appendChild(div)
}

const createlesx = function(docent, les, length, start, day, lokaal){
  var element = document.getElementById("event-container");
  const div = document.createElement(`div`);
  div.onclick = function() {odetails(docent, les, lokaal, "lesx")}
  div.className = `les canceled day${day}`
  div.id = "les"
  div.style = `height: ${length/60*10}vh; grid-row: ${start};`
  div.innerHTML += `<span class="info">${les} - ${docent}</span> <span class="lokaal" style="float: right;">${lokaal}</span>
  <br>
  
  <span class="material-icons">close</span>`
  element.appendChild(div)
}

const createact = function(docent, les, length, start, day, lokaal){
  var element = document.getElementById("event-container");
  const div = document.createElement(`div`);
  div.onclick = function() {odetails(docent, les, lokaal, "act")}
  div.className = `les act day${day}`
  div.id = "les"
  div.style = `height: ${length/60*10}vh; grid-row: ${start};`
  div.innerHTML += `<span class="info">${les} - ${docent }</span> <span class="lokaal" style="float: right;">${lokaal}</span>`
  element.appendChild(div)
}
    
function weekr(a){
  sessionStorage.setItem("offset", parseInt(sessionStorage.getItem("offset"))+a);
  rooster(parseInt(sessionStorage.getItem("offset")))
  console.log(sessionStorage.getItem("offset"))
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  console.log("cookie set: " + cname + ", " + cvalue)
}
  
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return "";
}

rooster(parseInt(sessionStorage.getItem("offset")))