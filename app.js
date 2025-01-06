const apiKey = 'de7d1023faf34221b7b91840250601'; 

document.getElementById('city').addEventListener('input', () => {
  const query = document.getElementById('city').value.trim();
  const suggestionsUrl = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

  if (query === '') {
    clearSuggestions();
    return;
  }

  fetch(suggestionsUrl)
    .then(response => response.json())
    .then(data => {
      const suggestionBox = document.getElementById('suggestions');
      clearSuggestions();

      if (data.length) {
        data.forEach(item => {
          const suggestion = document.createElement('div');
          suggestion.className = 'suggestion-item';
          suggestion.textContent = `${item.name}, ${item.country}`;
          suggestion.addEventListener('click', () => {
            document.getElementById('city').value = item.name;
            clearSuggestions();
          });
          suggestionBox.appendChild(suggestion);
        });
      }
    })
    .catch(error => console.error('Error fetching suggestions:', error));
});

function clearSuggestions() {
  const suggestionBox = document.getElementById('suggestions');
  while (suggestionBox.firstChild) {
    suggestionBox.removeChild(suggestionBox.firstChild);
  }
}

document.getElementById('getWeather').addEventListener('click', () => {
  const city = document.getElementById('city').value.trim();
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  if (city === '') {
    document.getElementById('weatherResult').innerHTML = '<p>Please enter a city name.</p>';
    return;
  }

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found or other error.');
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('weatherResult').innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p>Temperature: ${data.current.temp_c}°C</p>
        <p>Condition: ${data.current.condition.text}</p>
        <img src="${data.current.condition.icon}" alt="Weather icon">
      `;
    })
    .catch(error => {
      document.getElementById('weatherResult').innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
