var apiKey = "";
function callAPI() {
    var element = document.getElementById("input");
    apiKey = element.value;
    apiKey = encodeURIComponent(apiKey);
    var url = "https://api.wunderground.com/api/" + apiKey + "/geolookup/q/autoip.json";
    $.getJSON(url, {}, getZip);
}

function getZip(resp) {
    var zipCode = resp.location.zip;
    if (zipCode == null) {
        error("Zipcode was not found.");
        return;
    }
    zipCode = encodeURIComponent(zipCode);
    var url = "https://api.wunderground.com/api/" + apiKey + "/hourly/q/" + zipCode + ".json";

    $.getJSON(url, {}, getLocation);
}
function getLocation(resp) {
    var t = makeTable();
    var i = 0;
    for (var key in resp.hourly_forecast) {
        i++;
        var time = resp.hourly_forecast[key].FCTTIME.pretty;
        var epoch = resp.hourly_forecast[key].FCTTIME.epoch;
        var tempCelsius = resp.hourly_forecast[key].temp.metric;
        var condition = resp.hourly_forecast[key].conditon;
        var iconURL = resp.hourly_forecast[key].icon_url;
        iconURL = iconURL.replace(/^http:\/\//i, 'https://');

        var info = {
            time: time,
            epoch: epoch,
            tempCelsius: tempCelsius,
            condition: condition,
            iconURL: iconURL
        };
        addData(t, info, i);
    }
}
function makeTable() {
    var tableD = document.getElementById("results");

    while (tableD.firstChild) {
        tableD.removeChild(tableD.firstChild);
    }

    var tbl = tableD.appendChild(document.createElement("table"));
    addRow(tbl, 3);
    tbl.rows[0].cells[0].innerHTML = "Time";
    tbl.rows[0].cells[1].innerHTML = "Temperature";
    tbl.rows[0].cells[2].innerHTML = "Icon";

    return tbl;
}
function addData(tbl, info, i) {
    addRow(tbl, 3);
    var d = new Date(info.epoch * 1000);
    var img = document.createElement("img");
    img.setAttribute('src', info.iconURL);
    tbl.rows[i].columns[0].innerHTML = d.toLocaleDateString();
    tbl.rows[i].columns[1].innerHTML = info.tempCelsius;
    tbl.rows[i].columns[2].innerHTML = img.outerHTML;
}

/**
 * Adds a row to the table with two cells.
 * @param tbl The table obj
 * @param count Number of rows.
 */
function addRow(tbl, count) {
    var newRow = tbl.insertRow();
    for (var i = 0; i < count; i++) {
        newRow.insertCell();
    }
}
function error(error) {
    console.log(error);
}