var fields = {
    "radio" : ["climbLevel", "crossedLine", "habStart"],
    "general" : ["scouterName", "teamNumber", "matchPrefix", "matchNumber", "cargoShipCargoSuccess", "cargoShipCargoFail", "cargoShipHPSuccess", "cargoShipHPFail", "rocket1CargoSuccess", "rocket1CargoFail", "rocket1HPSuccess", "rocket1HPFail", "rocket2CargoSuccess", "rocket2CargoFail", "rocket2HPSuccess", "rocket2HPFail", "rocket3CargoSuccess", "rocket3CargoFail", "rocket3HPSuccess", "rocket3HPFail", "climbSpeed", "comments", "strengths", "weaknesses", "climbFails"],
    "checkbox" : ["cargoShipCargo", "cargoShipHatchPanel", "rocketCargo", "rocketHatchPanel"]
}

var csvCaptions = ["teamNumber", "matchPrefix", "matchNumber", "scouterName", "habStart", "crossedLine", "rocketHatchPanel", "rocketCargo", "cargoShipHatchPanel", "cargoShipCargo", "cargoShipHPSuccess", "cargoShipHPFail", "cargoShipCargoSuccess", "cargoShipCargoFail", "rocket1HPSuccess", "rocket1HPFail", "rocket1CargoSuccess", "rocket1CargoFail", "rocket2HPSuccess", "rocket2HPFail", "rocket2CargoSuccess", "rocket2CargoFail", "rocket3HPSuccess", "rocket3HPFail", "rocket3CargoSuccess", "rocket3CargoFail", "climbLevel", "climbSpeed", "climbFails", "comments", "strengths", "weaknesses"]

var required = ["scouterName", "teamNumber", "matchNumber"]

$(document).ready(function () {
    function injectData(data) {
        for (var i in fields["radio"]) {
            var id = fields["radio"][i]

            $('#' + id + data[id]).prop('checked',true)
        }

        for (var i in fields["general"]) {
            var id = fields["general"][i]

            $('#' + id).val(data[id])
        }

        for (var i in fields["checkbox"]) {
            var id = fields["checkbox"][i]

            $('#' + id).prop('checked', data[id])
        }
    }

    function extractData() {

        var out = {};

        for (var i in fields["radio"]) {
            var id = fields["radio"][i]

            out[id] = $('input[name=' + id + ']:checked').val()
        }

        for (var i in fields["general"]) {
            var id = fields["general"][i]

            out[id] = $('#' + id).val()
        }

        for (var i in fields["checkbox"]) {
            var id = fields["checkbox"][i]

            out[id] = $('#' + id).is(":checked")
        }

        out['eventName'] = localStorage.currentEvent

        return out;

    }

    if (localStorage.currentEvent) {
        $('#current-event').html(localStorage.currentEvent + ' EVENT')
        $('#eventName').val(localStorage.currentEvent)
    } else {
        localStorage.currentEvent = 'WATERLOO'
    }

    $('#save').on('click', function() {
        var data = extractData()

        var requiredDone = true;

        for (var i = 0; i < required.length; i++) {
            if (!data[required[i]]) {
                requiredDone = false;
                break
            }
        }

        if (requiredDone) {

            addEntry(data['teamNumber'], localStorage.currentEvent + '-' + data['matchPrefix'] + data['matchNumber'], data)

            swal('Saved', 'I think it\'s saved', 'success');

        } else {
            swal('Unable to save', 'MAKE SURE TO FILL IN ALL REQUIRED FIELDS', 'error')
        }

        generateEntryDropdown()

    })

    $('#saveEventName').on('click', function() {

        if ($('#eventName').val()) {
            localStorage.currentEvent = $('#eventName').val().toUpperCase()

            $('#current-event').html(localStorage.currentEvent + ' EVENT')

            swal('Event Name Saved', 'Event name set to: ' + localStorage.currentEvent, 'success')
        } else {
            swal('Error', 'Bro you can\'t set event name to nothing!', 'error')
        }
    })

    $('#newEntry').on('click', function() {

        swal({
            title: "Are you sure you want to create a new match?",
            text: "All unsaved changes will be lost!",
            type: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((generate) => {
                if (generate) {

                    injectData({'matchPrefix': 'Q'})

                } else {
                    swal("Mission aborted.");
                }
            });

    });

    $('#loadEntry').on('click', function() {

        swal({
            title: "Are you sure you want to load match?",
            text: "All unsaved changes will be lost!",
            type: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((generate) => {
                if (generate) {

                    var data = JSON.parse(sessionStorage.dropdownMap)[$('#matchSelection').val()]

                    injectData(getLocalStorage()[data[0]][data[1]])

                } else {
                    swal("Mission aborted.");
                }
            });
    })

    $('#loadTeam').on('click', function() {
        loadTeam($('#teamSelection').val())
    })

    $('#import').on('click', function() {
        $('#fileUpload').click()
    })

    $('#export').on('click', function() {
        generateMatchCSV(getLocalStorage())
    })

    $('#export-overview').on('click', function() {
        generateTeamCSV(JSON.parse(sessionStorage.teamData))
    })

    generateEntryDropdown()
});

function initFileImport() {
    document.getElementById('fileUpload').addEventListener('change', upload, false);
}

// Method that checks that the browser supports the HTML5 File API
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
    }
    return isCompatible;
}

// Method that reads and processes the selected file
function upload(evt) {
    if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser!');
    } else {
        var data = getLocalStorage();


        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {

            var newData = 0;
            var csvData = event.target.result;

            csvData =  CSVToArray(csvData)

            console.log(csvData)


            var keys = csvData[0]

            for (var i = 1; i < csvData.length; i++) {
                console.log(i)

                var teamNumber = csvData[i][keys.indexOf('teamNumber')]
                var matchID = csvData[i][keys.indexOf('matchID')]

                if (!teamNumber || !matchID) {
                    continue
                }

                if (!data[teamNumber]) {
                    data[teamNumber] = {}
                }

                data[teamNumber][matchID] = {}

                for (var n = 0; n < keys.length; n++) {
                    data[teamNumber][matchID][keys[n]] = csvData[i][n]
                }

                newData ++


            }

            console.log(data)

            setLocalStorage(data)
            generateEntryDropdown()

            swal('Imported!', 'Imported ' + newData + ' matches!', 'success')

        };
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
    }
}

function generateTeamDropdown() {
    var teamData = JSON.parse(sessionStorage.teamData)

    var out = ''
    var teamNames = Object.keys(teamData)

    teamNames.sort()

    for (var i = 0; i < teamNames.length; i++) {

        out += '<option value="' + teamNames[i] + '" selected>' + teamNames[i] +  '</option>'
    }

    $('#teamSelection').html(out)
}


function generateEntryDropdown() {
    var localData = getLocalStorage()
    var teams = Object.keys(localData)

    var out = ''
    var dropdownMap = {}

    for (var i = 0; i < teams.length; i++) {
        var teamName = teams[i]
        var matchNames = Object.keys(localData[teamName])

        for (var z = 0; z < matchNames.length; z++) {
            var pairName = teamName + '/' + matchNames[z]

            out += '<option value="' + pairName + '" selected>' + pairName+ '</option>'
            dropdownMap[pairName] = [teamName, matchNames[z]]
        }
    }

    sessionStorage.dropdownMap = JSON.stringify(dropdownMap)

    $('#matchSelection').html(out)
}

function generateTeamCSV(object) {
    var csvCaptionString = JSON.stringify(csvCaptions)
    var csv = csvCaptionString.substring(1, csvCaptionString.length-1) + "\n"

    var teamNumbers = Object.keys(object)

    for (var t = 0; t < teamNumbers.length; t++) {

        var teamNumber = teamNumbers[t]
        var matches = object[teamNumber]
        var matchNames = Object.keys(matches)

        for (var m = 0; m < matchNames.length; m++) {
            var matchName = matchNames[m]
            var match = matches[matchName]

            csv += "\"" + matchName + "\", "

            for (var i = 0; i < csvCaptions.length; i++) {
                csv += "\"" + match[csvCaptions[i]] + (i == csvCaptions.length - 1 ? "\"" : "\", ")
            }

            console.log(teamNumber, matchName)

            csv += "\n"
        }

    }

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", 'teamoverview' + Date() + ".csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function generateMatchCSV(object) {
    var csvCaptionString = JSON.stringify(csvCaptions)
    var csv = "\"matchID\"," + csvCaptionString.substring(1, csvCaptionString.length-1) + "\n"

    var teamNumbers = Object.keys(object)

    for (var t = 0; t < teamNumbers.length; t++) {

        var teamNumber = teamNumbers[t]
        var matches = object[teamNumber]
        var matchNames = Object.keys(matches)

        for (var m = 0; m < matchNames.length; m++) {
            var matchName = matchNames[m]
            var match = matches[matchName]

            csv += "\"" + matchName + "\", "

            for (var i = 0; i < csvCaptions.length; i++) {
                csv += "\"" + match[csvCaptions[i]] + (i == csvCaptions.length - 1 ? "\"" : "\", ")
            }

            console.log(teamNumber, matchName)

            csv += "\n"
        }

    }

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", 'matchoverview' + Date() + ".csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


}

function getLocalStorage() {
    try {
        return JSON.parse(localStorage.scoutingData)
    } catch (e) {
        return {}
    }
}

function setLocalStorage(data) {
    localStorage.scoutingData = JSON.stringify(data)
}

function CSVToArray( str ){

    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

function addEntry (team, match, data) {

    /*
    * Data structure
    * teams
    * |-4903
    *   |-Match #1
    *       |-Some nice data
    * */

    var localData = getLocalStorage()

    if (!localData.hasOwnProperty(team)) {
        localData[team] = {}
    }

    localData[team][match] = data

    setLocalStorage(localData)

}

function generateOverview() {

    var buffer = ''

    var teamData = {}
    var stats = {'Teams': 0, 'Entries': 0}

    var data = getLocalStorage()

    var primaryPoints = ['cargoShipCargoSuccess', 'cargoShipCargoFail', 'cargoShipHPSuccess', 'cargoShipHPFail', 'rocket1CargoSuccess', 'rocket1CargoFail', 'rocket1HPSuccess', 'rocket1HPFail', 'rocket2CargoSuccess', 'rocket2CargoFail', 'rocket2HPSuccess', 'rocket2HPFail', 'rocket3CargoSuccess', 'rocket3CargoFail', 'rocket3HPSuccess', 'rocket3HPFail']
    var primaryKeys = ['cargoShipCargo', 'cargoShipHP', 'rocket1Cargo', 'rocket1HP', 'rocket2Cargo', 'rocket2HP', 'rocket3Cargo', 'rocket3HP']

    var finalPoints = ['comments', 'strengths', 'weaknesses']

    for (var team in data) {
        console.log(team)
        
        teamData[team] = {

            'cargoShipCargoSuccess':0,
            'cargoShipCargoFail':0,
            'cargoShipHPSuccess':0,
            'cargoShipHPFail':0,
            
            'rocket1CargoSuccess':0,
            'rocket1CargoFail':0,
            'rocket1HPSuccess':0,
            'rocket1HPFail':0,
            
            'rocket2CargoSuccess':0,
            'rocket2CargoFail':0,
            'rocket2HPSuccess':0,
            'rocket2HPFail':0,
            
            'rocket3CargoSuccess':0,
            'rocket3CargoFail':0,
            'rocket3HPSuccess':0,
            'rocket3HPFail':0,

            'climb0': 0,
            'climb1': 0,
            'climb2': 0,
            'climb3': 0,

            'climb2Speed': 0,
            'climb3Speed': 0,

            'climbFails': 0,

            'rates' : {
                'cargoShipCargo': 0,
                'cargoShipHP': 0,
                'rocket1Cargo': 0,
                'rocket1HP': 0,
                'rocket2Cargo': 0,
                'rocket2HP': 0,
                'rocket3Cargo': 0,
                'rocket3HP': 0,

                'climb0': 0,
                'climb1': 0,
                'climb2': 0,
                'climb3': 0
            },
            'average' : {
                'cargoShipCargo': 0,
                'cargoShipHP': 0,
                'rocket1Cargo': 0,
                'rocket1HP': 0,
                'rocket2Cargo': 0,
                'rocket2HP': 0,
                'rocket3Cargo': 0,
                'rocket3HP': 0,

                'climb0': 'N/A',
                'climb1': 'N/A',
                'climb2': 0,
                'climb3': 0
            },
            
            'matches': 0,

            'comments': [],
            'strengths': [],
            'weaknesses': [],

            'scoutedBy': {}
            
        }

        for (var matchID in data[team]) {
            var matchData = data[team][matchID]

            for (var point in primaryPoints) {

                point = primaryPoints[point]

                if (matchData[point] && !isNaN(matchData[point])) {
                    teamData[team][point] += parseInt(matchData[point])
                }
            }

            try {
                if (matchData['climbLevel'] && !isNaN(matchData['climbLevel'])) {
                    teamData[team]['climb' + matchData['climbLevel']]++
                }
            } catch (e) {
                console.log(e)
            }

            try {
                if (matchData['climbSpeed'] && !isNaN(matchData['climbSpeed'])) {
                    teamData[team]['climb' + matchData['climbLevel'] + 'Speed'] += parseInt(matchData['climbSpeed'])
                }
            } catch (e) {
                console.log(e)
            }


            for (var point in finalPoints) {
                point = finalPoints[point]

                if (matchData[point]) {
                    teamData[team][point].push(matchData[point])
                }
            }

            matchData['scouterName'] = matchData['scouterName'].trim()

            if (!teamData[team]['scoutedBy'][matchData['scouterName']]) {
                teamData[team]['scoutedBy'][matchData['scouterName']] = 0
            }

            teamData[team]['scoutedBy'][matchData['scouterName']] ++

            stats['Entries']++
            teamData[team]['matches']++
        }

        for (var k in primaryKeys) {
            k = primaryKeys[k]

            if (teamData[team][k + 'Success'] + teamData[team][k + 'Fail'] != 0) {
                teamData[team]['rates'][k] = (teamData[team][k + 'Success'] / (teamData[team][k + 'Success'] + teamData[team][k + 'Fail']) * 100).toFixed(2)
            } else {
                teamData[team]['rates'][k] = '0.00%'

            }

            teamData[team]['average'][k] = (teamData[team][k + 'Success'] / teamData[team]['matches']).toFixed(2)
        }

        for (var i = 0; i < 4; i++) {
            teamData[team]['rates']['climb' + i] = (100 * teamData[team]['climb' + i] / teamData[team]['matches']).toFixed(2)

            if (i >= 2) {
                teamData[team]['average']['climb' + i] = (teamData[team]['climb' + i + 'Speed'] / teamData[team]['matches']).toFixed(2) + ' secs'
            }
        }

        stats['Teams']++
    }

    console.log(teamData)

    for (var s in stats) {
        buffer += s + ': ' + stats[s] + ' | '
    }

    buffer = buffer.substring(0, buffer.length - 3)

    $('#statistics').html('<b>' + buffer + '</b>')

    sessionStorage.teamData = JSON.stringify(teamData)


}

function loadTeam(team) {

    try {

        var tableBuffer = ''
        var teamData = JSON.parse(sessionStorage.teamData)

        team = parseInt(team)

        $('#preloadMessage').attr('hidden', true)
        $('#teamView').attr('hidden', false)


        for (var key in teamData[team]['rates']) {

            tableBuffer += '<tr>\n' +
                '    <td>\n' +
                '        <b>' + key + '</b>\n' +
                '    </td>\n' +
                '    <td>\n' +
                '        ' + teamData[team]['rates'][key] + '\n' +
                '    </td>\n' +
                '    <td>\n' +
                '        ' + teamData[team]['average'][key] + '\n' +
                '    </td>\n' +
                ' </tr> '

        }

        $('#comments').html(teamData[team]['comments'].join('<br><br>'))
        $('#strengths').html(teamData[team]['strengths'].join('<br><br>'))
        $('#weakness').html(teamData[team]['weaknesses'].join('<br><br>'))

        $('#scouted-by').html(JSON.stringify(teamData[team]['scoutedBy']))
        $('#matches').html(teamData[team]['matches'])

        $('#overviewTableBody').html(tableBuffer)

    } catch (e) {
        swal('Error', 'Unable to load team', 'error')
    }
}