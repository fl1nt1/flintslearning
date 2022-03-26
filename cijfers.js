async function cijfers(){
    let ln = ""
    let auth = ""
    const api_url = `https://magisterapi.fl1nt.repl.co/api/magister/12345?ln=${ln}&auth=${auth}`
    const res = await fetch(api_url, { mode: 'no-cors'})
    const data = await res.json()
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
  console.log("")
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

cijfers()