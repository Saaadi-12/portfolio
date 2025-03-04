document.addEventListener("DOMContentLoaded", () => {
  var map = L.map("map").setView([59.3293, 18.0686], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  let windTurbines = [
    { lat: 59.4227, lon: 17.8351, name: "Vindkraftverk 1" },
    { lat: 58.3838, lon: 16.5417, name: "Vindkraftverk 2" },
    { lat: 36.778, lon: 119.4179, name: "vindkraftverk 3" },
    { lat: 36.778, lon: 119.7179, name: "vindkraftverk 3" },
    { lat: 38.8951, lon: -77.13634, name: "vindkraftverk 5" },
    { lat: 10.4396, lon: 45.0143, name: "vindkraftverk 5" },
  ];

  windTurbines.forEach((turbine) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${turbine.lat}&longitude=${turbine.lon}&hourly=windspeed_10m`
    )
      .then((response) => response.json())
      .then((data) => {
        let wind_speed = data.hourly.windspeed_10m[0];
        let power = calculate_power(wind_speed);

        L.marker([turbine.lat, turbine.lon])
          .addTo(map)
          .bindPopup(
            `<b>${turbine.name}</b><br>Vindhastighet: ${wind_speed} m/s<br>Produktion: ${power} MW/h`
          )
          .openPopup();
      })
      .catch((error) => console.error("API Error:", error));
  });
});

function calculate_power(wind_speed) {
  if (wind_speed < 10) {
    return 2;
  } else if (wind_speed < 20) {
    return 4;
  } else {
    return 0;
  }
}
