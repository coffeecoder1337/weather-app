const url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const token = "3d2be4e9aed746e908134a372399ae836e0b2523";
const input = document.getElementById("input_city");
const coords_input = document.getElementById("coords");
const city_input = document.getElementById("city");
var datalist = document.getElementById("suggestions");
var suggs;

input.addEventListener("input", updateValue);

function updateValue(e) {
    
    var value = e.target.value;
    if (value.length < 2) {
        return;
    }
    var query = value;

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({query: query})
    }

    


    fetch(url, options)
    .then(response => response.json())
    .then((data) => {
        datalist.innerHTML = "";
        for (const sugg of data.suggestions) {
            datalist.appendChild(document.createElement("option")).value = sugg.value;
            //console.log(sugg);
        }
        suggs = data.suggestions;
    })
    .catch(error => console.log("error", error));

    var dc = datalist.children;
    for (var i = 0; i < dc.length; i++) {
        //console.log(dc[i].value);
        if (dc[i].value === input.value) {
            for (var j = 0; j < suggs.length; j++) {
                if (dc[i].value === suggs[j].value) {
                    coords_input.value = `${suggs[j].data["geo_lat"]} ${suggs[j].data["geo_lon"]}`;
                    city_input.value = `${suggs[j].value}`;
                    // alert(`geo_lat: ${suggs[j].data["geo_lat"]}, geo_lon: ${suggs[j].data["geo_lon"]}`);
                    
                }
            }
            
        }
    }
    
}



