window.onload = () => {
    const details = document.getElementById("lux");
    const aciklama = document.getElementById("aciklama");
    details.innerHTML += "";
    
    // Feature detection
    if (window.AmbientLightSensor){
        try{
          const sensor = new AmbientLightSensor();

          // Detect changes in the light
          sensor.onreading = () => {
            details.innerHTML = sensor.illuminance;
            
              // Read the light levels in lux 
              // < 50 is dark room
              if (sensor.illuminance < 50) {
                document.body.className = 'darkEnv';
                aciklama.innerHTML = 'Karanlık ortam';
              } 
              else if(sensor.illuminance < 150) {
                document.body.className = 'mediumEnv';
                aciklama.innerHTML = 'Yarı aydınlık ortam';
              }
              else {
                document.body.className = 'brightEnv';
                aciklama.innerHTML = 'Aydınlık ortam';
              }
          }
          
          // Has an error occured?
          sensor.onerror = event => document.getElementById("lux").innerHTML = event.error.message;
          sensor.start();
        } catch(err) {
          details.innerHTML = err.message;
        }
    } else {
      details.innerHTML = 'It looks like your browser doesnt support this feature'; 
    }
}
