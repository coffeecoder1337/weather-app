const url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const token = "3d2be4e9aed746e908134a372399ae836e0b2523";
const input = document.getElementById("input_city");
const coords_input = document.getElementById("coords");
const city_input = document.getElementById("city");
const btn = document.getElementById("search_btn")

var datalist = document.getElementById("suggestions");
var suggs;

var isOver = false;

input.onblur = function(){
    if (!isOver) {
        datalist.style.display = 'none';
        input.style.borderRadius = "12px 0 0 12px";
    }
    
}

input.onfocus = function() {
    datalist.style.display = 'block';
    input.style.borderRadius = "12px 0 0 0";
    // btn.style.borderRadius = "0 12px 0 0";
}

datalist.onmouseover = function() {
    isOver = true;
}

datalist.onmouseleave = function() {
    isOver = false;
}


input.addEventListener("input", updateValue);

function optionClick(e) {
    input.value = e.target.value;
    datalist.style.display = 'none';
    input.style.borderRadius = "12px 0 0 12px";

    for (var j = 0; j < suggs.length; j++) {
        if (e.target.value === suggs[j].value) {
            coords_input.value = `${suggs[j].data["geo_lat"]} ${suggs[j].data["geo_lon"]}`;
            city_input.value = `${suggs[j].value}`; 
        }
    }
}

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
            var child = datalist.appendChild(document.createElement("option"));
            child.value = sugg.value;
            child.text = sugg.value;
            child.onclick = optionClick;
        }
        suggs = data.suggestions;
    })
    .catch(error => console.log("error", error));
    
}



