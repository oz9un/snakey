window.onload = () => {
    const details = document.getElementById("lux");
    details.innerHTML = +"deneme";

    
    // Feature detection
    if (window.AmbientLightSensor){
        try{
          const sensor = new AmbientLightSensor();

          // Detect changes in the light
          sensor.onreading = () => {
            details.innerHTML += sensor.illuminance;
            
              // Read the light levels in lux 
              // < 50 is dark room
              if (sensor.illuminance < 50) {
                document.body.className = 'darkEnv';
              } else {
                document.body.className = 'brightEnv';
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